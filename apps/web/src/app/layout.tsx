import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BizRadar | Intelligence Dashboard",
  description: "Production-grade AI Lead Intelligence SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrainsMono.variable} dark`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-on-surface selection:bg-primary/30 overflow-hidden h-screen flex">
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#1a2235',
              color: '#dae2fd',
              border: '1px solid rgba(189, 194, 255, 0.2)',
              borderRadius: '8px',
              fontSize: '14px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
            },
            success: {
              iconTheme: {
                primary: '#bdc2ff',
                secondary: '#1a2235',
              },
            },
            error: {
              iconTheme: {
                primary: '#ffb4ab',
                secondary: '#1a2235',
              },
              style: {
                border: '1px solid rgba(255, 180, 171, 0.3)',
                background: '#2c1a1d',
              }
            }
          }}
        />
        {children}
      </body>
    </html>
  );
}
