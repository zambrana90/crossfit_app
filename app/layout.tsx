import type { Metadata } from 'next';
import { Barlow_Condensed, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Providers } from '@/_app/providers';
import '@/_app/styles/globals.css';

export const metadata: Metadata = {
  title: 'CrossFit WOD',
  description: 'Tus entrenamientos de CrossFit, en todo momento.',
};

// Global typography system (the login-page pattern, app-wide):
//   - Barlow Condensed → headings (`font-display`)
//   - Hanken Grotesk   → body text (`font-body`)
//   - JetBrains Mono   → label-caps / buttons / badges (`font-brand-mono`)
const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-barlow',
});

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-hanken',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-jetbrains',
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${barlow.variable} ${hanken.variable} ${jetbrains.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
