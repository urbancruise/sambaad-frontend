import React from 'react';
import './globals.css'; 
import StoreProvider from '@/src/components/StoreProvider';
import AuthInitializer from '../features/auth/components/auth/AuthInitializer';

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
      <body className="bg-slate-50 text-slate-900 antialiased">
          <StoreProvider>

    <AuthInitializer/>

    {children}

</StoreProvider>
      </body>
    </html>
  );
}