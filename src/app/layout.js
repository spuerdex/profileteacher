import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import { I18nProvider } from '@/lib/i18n';

export const metadata = {
  title: 'Teacher Profile System | ระบบโปรไฟล์อาจารย์',
  description: 'ระบบจัดการโปรไฟล์อาจารย์ - Teacher Profile Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        <AuthProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
