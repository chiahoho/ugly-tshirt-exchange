import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ugly T-Shirt Exchange",
  description: "Secret Santa, but for ugly t-shirts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-br from-pink-100 via-yellow-50 to-green-100">
        <header className="text-center py-6">
          <a href="/" className="text-3xl font-bold tracking-tight text-gray-800">
            Ugly T-Shirt Exchange
          </a>
        </header>
        <main className="flex-1 flex items-start justify-center px-4 pb-12">
          {children}
        </main>
      </body>
    </html>
  );
}
