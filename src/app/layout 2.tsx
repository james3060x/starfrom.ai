import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
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
      <body className={`${inter.className} antialiased min-h-screen flex flex-col bg-[#050508] text-white noise-overlay`}>
        {/* Rich Animated Background */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          {/* Base Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-[#0a0a12] to-[#050508]" />
          
          {/* Tech Grid */}
          <div className="absolute inset-0 tech-grid opacity-30" />
          
          {/* Animated Gradient Orbs */}
          <div className="gradient-orb orb-cyan w-[600px] h-[600px] top-[-10%] left-[-10%]" />
          <div className="gradient-orb orb-purple w-[500px] h-[500px] bottom-[-10%] right-[-5%]" />
          <div className="gradient-orb orb-cyan w-[400px] h-[400px] top-[40%] right-[20%] opacity-30" />
          <div className="gradient-orb orb-purple w-[300px] h-[300px] bottom-[30%] left-[10%] opacity-30" />
          
          {/* Radial Gradients for Depth */}
          <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-cyan-500/[0.05] rounded-full blur-[150px] float" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/[0.05] rounded-full blur-[150px] float-delayed" />
          
          {/* Top Light Leak */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-cyan-500/10 to-transparent blur-[100px]" />
        </div>
        
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
