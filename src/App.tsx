import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AppHeader } from './components/AppHeader';

const HomePage = lazy(() => import('./pages/HomePage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const RoadmapPage = lazy(() => import('./features/roadmap/RoadmapPage'));
const PartTestPage = lazy(() => import('./features/tests/PartTestPage'));
const Lesson01 = lazy(() => import('./features/lessons/b1/Lesson01Intro'));
const Lesson02 = lazy(() => import('./features/lessons/b2/Lesson02Agents'));
const Lesson03 = lazy(() => import('./features/lessons/b3/Lesson03Search'));

// Lên đầu trang khi đổi route; tôn trọng #anchor trong cùng trang.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, [pathname]);
  return null;
}

const loading = (
  <div className="container mono" style={{ padding: '60px 24px', color: 'var(--muted-2)', fontSize: 12 }}>
    đang nạp…
  </div>
);

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={loading}>
        <Routes>
          {/* Bài học full-bleed: tự có thanh điều hướng riêng */}
          <Route path="/courses/csc14003/lessons/b1" element={<Lesson01 />} />
          <Route path="/courses/csc14003/lessons/b2" element={<Lesson02 />} />
          <Route path="/courses/csc14003/lessons/b3" element={<Lesson03 />} />
          {/* Các trang còn lại dùng header chung */}
          <Route
            path="*"
            element={
              <>
                <AppHeader />
                <Suspense fallback={loading}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/courses/:slug" element={<RoadmapPage />} />
                    <Route path="/courses/:slug/tests" element={<PartTestPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}
