import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Social Media Agent",
  description: "AI-powered social media content creation and strategy platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
