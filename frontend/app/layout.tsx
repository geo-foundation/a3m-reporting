"use client"; // This must be the first statement in the file

import localFont from "next/font/local";
import "./globals.css";
import { usePathname } from 'next/navigation';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatBot from './components/ChatBot';

// Load the fonts locally
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get the current path

  // If we are on the root path ("/"), don't apply the layout components
  if (pathname === '/') {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children} {/* Only render the landing page content */}
        </body>
      </html>
    );
  }

  // Apply the layout (Navbar, Sidebar, ChatBot) for all other routes
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-64">
            <Navbar />
            <main>{children}</main>
          </div>
        </div>
        <ChatBot />
      </body>
    </html>
  );
}
