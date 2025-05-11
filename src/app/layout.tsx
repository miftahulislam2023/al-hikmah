import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from 'next/font/google'
import localFont from 'next/font/local'


const solaimanlipi = localFont({
  src: [
    {
      path: '../../public/fonts/SolaimanLipi_22-02-2012.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SolaimanLipi_Bold_10-03-12.ttf',
      weight: '700',
      style: 'normal',
    }
  ],
  variable: '--font-solaimanlipi',
})


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: "Al-Hikmah Academy",
  description: "Coding Academy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${poppins.variable} ${solaimanlipi.variable} font-bengali`}>
        {children}
      </body>
    </html>
  );
}
