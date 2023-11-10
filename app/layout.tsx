import './globals.css'
import type { Metadata } from 'next'
import { Inclusive_Sans } from 'next/font/google'

import { ThemeProvider } from "@/components/theme-provider"
import { MobileNav } from "@/components/navigation/mobile-nav"
import { Sidebar } from "@/components/navigation/sidebar"
import { DesktopHeader } from "@/components/navigation/desktop-header"

const font = Inclusive_Sans({ weight: "400", style: "normal", subsets: ['latin'], display: "swap" })

export const metadata: Metadata = {
  title: 'Energy Dashboard',
  description: 'Dena Energy Inc - Energy Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${font.className} block md:flex`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MobileNav />
          
          <Sidebar />
          <section className="md:p-6 flex-1">
            <DesktopHeader />
            {children}
          </section>
        </ThemeProvider>
      </body>
    </html>
  )
}
