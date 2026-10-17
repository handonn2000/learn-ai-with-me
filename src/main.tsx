import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, Navigate, RouterProvider } from 'react-router'
import { MotionConfig } from 'motion/react'
import './styles.css'
import { AppShell } from '@/ui/AppShell'
import { CoursePage } from '@/app/CoursePage'
import { NotebookPage } from '@/app/NotebookPage'
import { HomePage } from '@/app/HomePage'
import { coursesLink } from '@/app/CourseSection'
import { GoalPage } from '@/app/GoalPage'
import { LessonPage } from '@/app/LessonPage'
import { SessionPage } from '@/app/SessionPage'
import { ReviewPage } from '@/app/ReviewPage'
import { PlacementPage } from '@/app/PlacementPage'
import { NotFound } from '@/app/NotFound'
import { RouteError, reloadForNewVersion } from '@/app/RouteError'
import { initAccount } from '@/learning/account'

// Trang xem thành phần: chỉ tải khi mở /dev/ui
const DevUi = lazy(() => import('@/app/DevUi'))

// Hash router: GitHub Pages không cần trang 404 giả để giữ route.
const router = createHashRouter([
  {
    // Lỗi ở bất kỳ màn nào (vd. chunk cũ sau deploy) hiện RouteError thay vì màn lỗi mặc định.
    errorElement: <RouteError />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'goal/:goalId', element: <GoalPage /> },
          { path: 'map', element: <Navigate to="/goal/astar" replace /> },
          // Màn Khóa học đã gộp vào Hôm nay; link cũ chuyển về đó và cuộn tới phần khóa học.
          { path: 'courses', element: <Navigate {...coursesLink} replace /> },
          { path: 'courses/:courseId', element: <CoursePage /> },
          { path: 'notebook', element: <NotebookPage /> },
          { path: '*', element: <NotFound /> },
        ],
      },
      {
        path: 'dev/ui',
        element: (
          <Suspense fallback={null}>
            <DevUi />
          </Suspense>
        ),
      },
      // Màn học và kiểm tra: không có thanh điều hướng, chỉ một tiêu điểm.
      { path: 'session', element: <SessionPage /> },
      { path: 'review', element: <ReviewPage /> },
      { path: 'learn/:lessonId', element: <LessonPage /> },
      { path: 'check/:goalId', element: <PlacementPage /> },
    ],
  },
])

// Vite báo khi không tải được chunk preload: tải lại trang để lấy index.html mới.
window.addEventListener('vite:preloadError', (event) => {
  if (reloadForNewVersion()) event.preventDefault()
})

// Máy đã từng đăng nhập thì tải Firebase để khôi phục phiên và đồng bộ tiến độ.
initAccount()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  </StrictMode>,
)
