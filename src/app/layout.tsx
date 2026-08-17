import React from 'react';
import './globals.css'; 
import StoreProvider from '@/src/components/StoreProvider';
import ThemeProvider from '@/src/components/theme/ThemeProvider';
import AuthInitializer from '../features/auth/components/auth/AuthInitializer';
import GlobalEmailListener from '@/src/features/email/component/GlobalEmailListener';

export const metadata = {
  title: 'Sambaad Task System',
  description: 'Enterprise Performance-Driven Task Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <StoreProvider>

    <AuthInitializer/>
    <GlobalEmailListener />

    {children}

          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}