import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import { I18nProvider } from '@/lib/i18n';
import { ThemeModeProvider } from '@/lib/themeMode';

export const metadata = {
  title: 'DiGi Teacher Hub | ระบบโปรไฟล์อาจารย์',
  description: 'DiGi Teacher Hub — Digital Faculty Profile Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('theme-mode');
                  if (mode === 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <I18nProvider>
            <ThemeModeProvider>
              {children}
            </ThemeModeProvider>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
