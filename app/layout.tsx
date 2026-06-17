import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rituine — Your Daily Discipline Dashboard',
  description:
    'A personal routine tracker for building unstoppable daily habits. Track your morning ritual, study sessions, gym, and more — all in one beautiful dashboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#080b14" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-radial antialiased">
        {children}
      </body>
    </html>
  );
}
