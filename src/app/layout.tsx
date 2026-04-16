import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { Poppins, Roboto } from 'next/font/google';

import { AppProviders } from '@/app/providers';
import { authOptions } from '@/lib/auth/auth-options';

import { Toast } from '@heroui/react';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins-family',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto-family',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Garuda Pramuka Dashboard',
  description: 'Dashboard management anggota pramuka',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="id" className="h-full antialiased">
      <body className={`${poppins.variable} ${roboto.variable} min-h-full bg-white font-sans text-slate-900`}>
        <Toast.Provider placement="top" />
        <AppProviders session={session}>{children}</AppProviders>
      </body>
    </html>
  );
}
