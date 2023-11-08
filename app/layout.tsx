import './globals.css'
import type { Metadata } from 'next'
import { Inclusive_Sans } from 'next/font/google'

import { ThemeProvider } from "@/components/theme-provider"
import { MobileNav } from "@/components/mobile-nav"
import { Sidebar } from "@/components/sidebar"

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
      <body className={font.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MobileNav />
          <Sidebar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
