import { cn } from '#/lib/utils';
import type { Metadata } from 'next';
import { Playwrite_DE_Grund } from 'next/font/google';
import './globals.css';

const pinyin = Playwrite_DE_Grund({
  variable: '--font-pinyin',
  weight: 'variable',
});

export const metadata: Metadata = {
  title: 'Print',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(pinyin.variable, 'antialiased')}>{children}</body>
    </html>
  );
}
