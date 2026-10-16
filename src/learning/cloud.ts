import { FirebaseError, initializeApp } from 'firebase/app'
import {
  connectAuthEmulator,
  getAuth,
  getRedirectResult,
  GithubAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as fbSignOut,
} from 'firebase/auth'
import { connectFirestoreEmulator, doc, getDoc, getFirestore, serverTimestamp, setDoc, type DocumentReference } from 'firebase/firestore'
import { setHint, useAccount } from './account'
import { useProgress } from './progress'
import { CLOUD_VERSION, mergeProgress, parseCloud, pickData, toPlain, type ProgressData } from './sync'

/**
 * Phần chạy thật của đăng nhập + đồng bộ. Chỉ `account.ts` import file này (động), để Firebase
 * nằm ở chunk riêng. Dữ liệu: một document `users/{uid}` = { version, progress, updatedAt }.
 */

// Cấu hình web app Firebase là thông tin công khai; quyền truy cập do luật Firestore quyết định.
// authDomain trùng tên miền Hosting để đăng nhập không cần cookie bên thứ ba (Safari iOS chặn).
const app = initializeApp({
  apiKey: 'AIzaSyA1WGk6Q4kCmJRoB0fjfuwAScIMS1GPFBQ',
  authDomain: 'learn-ai-with-me.web.app',
  projectId: 'learn-ai-with-me',
  appId: '1:658069242004:web:1adfc95e7aa43602813481',
})
const auth = getAuth(app)
auth.languageCode = 'vi'
const db = getFirestore(app)

if (import.meta.env.VITE_FIREBASE_EMULATORS) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
}

/** Chờ người học ngừng thao tác chừng này rồi mới ghi, để một buổi học không thành hàng chục lần ghi. */
const WRITE_DELAY = 2000

let stopSync: (() => void) | null = null
let flush: (() => Promise<void>) | null = null

function message(e: unknown): string | null {
  const code = e instanceof FirebaseError ? e.code : ''
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null
  if (code === 'auth/network-request-failed') return 'Mất mạng nên chưa đăng nhập được.'
  if (code === 'auth/account-exists-with-different-credential') return 'Email này đã gắn với một cách đăng nhập khác.'
  return 'Đăng nhập không thành công. Thử lại sau nhé.'
}

async function write(ref: DocumentReference, data: ProgressData) {
  useAccount.setState({ sync: 'saving' })
  try {
    await setDoc(ref, { version: CLOUD_VERSION, progress: toPlain(data), updatedAt: serverTimestamp() })
    useAccount.setState({ sync: 'saved' })
  } catch {
    useAccount.setState({ sync: 'error', error: 'Chưa lưu được tiến độ lên mây. Trong máy vẫn còn nguyên.' })
  }
}

async function startSync(uid: string) {
  stopSync?.()
  const ref = doc(db, 'users', uid)
  useAccount.setState({ sync: 'saving' })
  let remote: ProgressData
  try {
    remote = parseCloud((await getDoc(ref)).data())
  } catch {
    useAccount.setState({ sync: 'error', error: 'Chưa tải được tiến độ trên mây. Trong máy vẫn còn nguyên.' })
    return
  }
  // Gộp với trạng thái lúc này (không phải lúc bắt đầu tải), để không mất gì người học vừa làm.
  const merged = mergeProgress(pickData(useProgress.getState()), remote)
  useProgress.setState(merged)
  await write(ref, merged)

  let timer: ReturnType<typeof setTimeout> | undefined
  let dirty = false
  const save = async () => {
    clearTimeout(timer)
    if (!dirty) return
    dirty = false
    await write(ref, pickData(useProgress.getState()))
  }
  const unsub = useProgress.subscribe((s, prev) => {
    if (s.skills === prev.skills && s.lessonStep === prev.lessonStep && s.follow === prev.follow) return
    dirty = true
    clearTimeout(timer)
    timer = setTimeout(save, WRITE_DELAY)
  })
  // Rời trang khi còn thay đổi chưa ghi: ghi luôn (cố gắng hết mức, trình duyệt có thể cắt ngang).
  const onHide = () => {
    if (document.visibilityState === 'hidden') void save()
  }
  document.addEventListener('visibilitychange', onHide)
  flush = save
  stopSync = () => {
    unsub()
    clearTimeout(timer)
    document.removeEventListener('visibilitychange', onHide)
    stopSync = null
    flush = null
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    setHint(true)
    useAccount.setState({ status: 'signedIn', user: { name: user.displayName ?? user.email ?? 'Bạn', photo: user.photoURL } })
    void startSync(user.uid)
  } else {
    setHint(false)
    stopSync?.()
    useAccount.setState({ status: 'signedOut', user: null, sync: 'idle' })
  }
})

// Quay về sau signInWithRedirect: thành công thì onAuthStateChanged lo; ở đây chỉ bắt lỗi.
getRedirectResult(auth).catch((e: unknown) => useAccount.setState({ error: message(e) }))

export async function signIn() {
  const provider = new GithubAuthProvider()
  try {
    await signInWithPopup(auth, provider)
  } catch (e) {
    if (e instanceof FirebaseError && e.code === 'auth/popup-blocked') {
      setHint(true)
      await signInWithRedirect(auth, provider)
      return
    }
    useAccount.setState({ error: message(e) })
  }
}

/**
 * Ghi nốt thay đổi còn chờ, đăng xuất, rồi xóa tiến độ trong máy: dữ liệu đã nằm trên mây,
 * và máy dùng chung thì người sau không thấy (hay gộp nhầm) tiến độ của người trước.
 */
export async function signOut() {
  await flush?.()
  stopSync?.()
  await fbSignOut(auth)
  useProgress.getState().reset()
}
