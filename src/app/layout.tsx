import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ElegantBackground } from "@/components/ElegantBackground"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StarFrom AI - 为中小企业打造专属 AI 智能体",
  description: "StarFrom AI 提供模块化 AI 服务，帮助企业快速部署智能客服、知识库问答、流程自动化等 AI 解决方案。3 天交付，仅需市场价 30%。",
  keywords: "AI, 智能体, 客服机器人, 知识库, RAG, 中小企业, SaaS",
  authors: [{ name: "StarFrom AI" }],
  openGraph: {
    title: "StarFrom AI - 为中小企业打造专属 AI 智能体",
    description: "模块化 AI 服务，3 天交付，仅需市场价 30%",
    type: "website",
    locale: "zh_CN",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col bg-[#030305] text-white`}>
        <ElegantBackground />
        
        <div 
          className="fixed inset-0 z-[1] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: 0.02,
          }}
        />
        
        <Header />
        <main className="flex-1 relative z-10">
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
