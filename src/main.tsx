import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LOCALE_BASENAME } from './lib/locale';
import { ThemeProvider } from './lib/theme';
import App from './App';
import './styles/global.css';

// locale.ts phải được nạp TRƯỚC createRoot: nó chốt LOCALE, sửa URL (replaceState) và đặt
// <html lang>. Import ở đây đủ đảm bảo — ES module chạy phụ thuộc trước thân module.
// Không có LocaleProvider: locale không đổi mà không reload nên nó là hằng số, không phải state.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={LOCALE_BASENAME}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
