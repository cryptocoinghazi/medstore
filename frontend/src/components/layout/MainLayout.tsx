"use client"

import { usePathname } from "next/navigation"
import Navbar from "./Navbar"
import Footer from "./Footer"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Don't show public Navbar/Footer on dashboard routes
  const isDashboard = pathname?.startsWith("/dashboard")

  return (
    <div className="flex min-h-screen flex-col">
      {!isDashboard && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isDashboard && <Footer />}
    </div>
  )
}
