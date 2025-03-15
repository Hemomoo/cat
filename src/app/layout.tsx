
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { NavBar } from "@/components/nav-bar";
import { SchedulerInit } from "@/components/scheduler-init";
export const metadata: Metadata = {
  title: "房东的猫 - 民谣音乐组合",
  description: "房东的猫是一支成立于2014年的民谣组合，由主唱耳朵和吉他手姬赓组成。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`font-sans antialiased bg-gray-50 text-gray-900`}>
        <SchedulerInit />
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
          <NavBar />
        </header>
        <main className="mt-16">
          {children}
          <Toaster />
        </main>
        <footer className="bg-gray-900 text-white py-8 mt-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p>© 2024 房东的猫. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
