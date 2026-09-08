import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AppHeader } from './components/AppHeader';
import { LOCALE, altUrls } from './lib/locale';
import { UI } from './content/ui';
import { getCourse } from './content/courses';

const HomePage = lazy(() => import('./pages/HomePage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const RoadmapPage = lazy(() => import('./features/roadmap/RoadmapPage'));
const PartTestPage = lazy(() => import('./features/tests/PartTestPage'));
const DefLesson07 = lazy(() => import('./features/lessons/def/b7/Lesson07Ingestion'));
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

// canonical + hreflang cho trang hiện tại. Ba thẻ này đã có sẵn trong index.html (trỏ vào gốc
// site, để crawler không chạy JS vẫn thấy); ở đây ta GHI ĐÈ href của chính chúng thay vì thêm
// thẻ mới — hai thẻ hreflang="vi" khác href trên cùng một trang là tín hiệu mâu thuẫn.
//
// Không prerender: cần dependency mới, mà ADR-0001 đã chốt là không. Deep link trên GitHub
// Pages vốn trả 404 kèm index.html (ADR-0007) nên SEO từng trang có trần thấp sẵn.
function SeoLinks() {
  const { pathname } = useLocation();
  useEffect(() => {
    const course = pathname.startsWith('/courses/') ? getCourse(pathname.split('/')[2]) : undefined;
    document.title = course ? `${course.title} ${course.titleAccent} · Learn AI with me` : 'Learn AI with me';
    const { vi, en } = altUrls();
    const put = (sel: string, attrs: Record<string, string>) => {
      let el = document.head.querySelector<HTMLLinkElement>(sel);
      if (!el) {
        el = document.createElement('link');
        document.head.appendChild(el);
      }
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    };
    put('link[rel="canonical"]', { rel: 'canonical', href: LOCALE === 'en' ? en : vi });
    put('link[rel="alternate"][hreflang="vi"]', { rel: 'alternate', hreflang: 'vi', href: vi });
    put('link[rel="alternate"][hreflang="en"]', { rel: 'alternate', hreflang: 'en', href: en });
    put('link[rel="alternate"][hreflang="x-default"]', { rel: 'alternate', hreflang: 'x-default', href: vi });
  }, [pathname]);
  return null;
}

const loading = (
  <div className="container mono" style={{ padding: '60px 24px', color: 'var(--muted-2)', fontSize: 12 }}>
    {UI.app.loading}
  </div>
);

export default function App() {
  return (
    <>
      <ScrollToTop />
      <SeoLinks />
      <Suspense fallback={loading}>
        <Routes>
          {/* Bài học full-bleed: tự có thanh điều hướng riêng */}
          <Route path="/courses/csc14003/lessons/b1" element={<Lesson01 />} />
          <Route path="/courses/csc14003/lessons/b2" element={<Lesson02 />} />
          <Route path="/courses/csc14003/lessons/b3" element={<Lesson03 />} />
          <Route path="/courses/data-engineering-foundation/lessons/b7" element={<DefLesson07 />} />
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
