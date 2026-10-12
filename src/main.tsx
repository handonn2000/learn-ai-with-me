import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router'
import { MotionConfig } from 'motion/react'
import './styles.css'
import { AppShell } from '@/ui/AppShell'
import { CoursesPage } from '@/app/CoursesPage'
import { CoursePage } from '@/app/CoursePage'
import { ComingSoon } from '@/app/ComingSoon'
import { HomePage } from '@/app/HomePage'
import { GoalPage } from '@/app/GoalPage'
import { LessonPage } from '@/app/LessonPage'
import { SessionPage } from '@/app/SessionPage'
import { ReviewPage } from '@/app/ReviewPage'
import { PlacementPage } from '@/app/PlacementPage'
import { NotFound } from '@/app/NotFound'

// React Flow + elk khá nặng: chỉ tải khi mở bản đồ
const MapPage = lazy(() => import('@/app/MapPage'))
const DevUi = lazy(() => import('@/app/DevUi'))

// Hash router: GitHub Pages không cần trang 404 giả để giữ route.
const router = createHashRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'goal/:goalId', element: <GoalPage /> },
      {
        path: 'map',
        element: (
          <Suspense fallback={<p className="pt-10 text-muted">Đang vẽ bản đồ…</p>}>
            <MapPage />
          </Suspense>
        ),
      },
      { path: 'review', element: <ReviewPage /> },
      { path: 'courses', element: <CoursesPage /> },
      { path: 'courses/:courseId', element: <CoursePage /> },
      { path: 'notebook', element: <ComingSoon title="Sổ tay" /> },
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
  { path: 'learn/:lessonId', element: <LessonPage /> },
  { path: 'check/:goalId', element: <PlacementPage /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  </StrictMode>,
)
