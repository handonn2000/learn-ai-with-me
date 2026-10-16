import { create } from 'zustand'

/**
 * Tài khoản (đăng nhập GitHub qua Firebase Auth) và trạng thái đồng bộ tiến độ.
 * Firebase nặng nên chỉ tải khi người học bấm đăng nhập, hoặc khi máy này đã từng đăng nhập (`HINT`).
 * Không đăng nhập vẫn học bình thường: tiến độ nằm ở localStorage như trước.
 */

export interface AccountUser {
  name: string
  photo: string | null
}

export type SyncState = 'idle' | 'saving' | 'saved' | 'error'

interface AccountState {
  /** `loading`: đang hỏi Firebase xem phiên trước còn không. */
  status: 'loading' | 'signedOut' | 'signedIn'
  user: AccountUser | null
  sync: SyncState
  /** Lỗi gần nhất để hiện cho người học (đăng nhập hỏng, không lưu được…). */
  error: string | null
}

/** Đánh dấu máy này đang đăng nhập, để lần mở sau tải Firebase ngay. Không chứa dữ liệu gì. */
export const HINT = 'learn-ai-v2-signed-in'

function hinted(): boolean {
  try {
    return localStorage.getItem(HINT) === '1'
  } catch {
    return false
  }
}

export function setHint(on: boolean) {
  try {
    if (on) localStorage.setItem(HINT, '1')
    else localStorage.removeItem(HINT)
  } catch {
    // localStorage bị chặn: chỉ mất việc tự tải lại phiên, đăng nhập vẫn chạy.
  }
}

export const useAccount = create<AccountState>(() => ({
  status: hinted() ? 'loading' : 'signedOut',
  user: null,
  sync: 'idle',
  error: null,
}))

const loadCloud = () => import('./cloud')

/** Gọi một lần khi app khởi động. */
export function initAccount() {
  if (hinted()) void loadCloud().catch(() => useAccount.setState({ status: 'signedOut', error: 'Không tải được phần đăng nhập.' }))
}

export async function signIn() {
  useAccount.setState({ error: null })
  try {
    const cloud = await loadCloud()
    await cloud.signIn()
  } catch {
    useAccount.setState({ error: 'Không tải được phần đăng nhập. Kiểm tra mạng rồi thử lại.' })
  }
}

export async function signOut() {
  const cloud = await loadCloud()
  await cloud.signOut()
}
