import './globals.css'
import type { Metadata } from 'next'
import { Kanit } from 'next/font/google'
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs'

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { MobileNav } from "@/components/navigation/mobile-nav"
import { Sidebar } from "@/components/navigation/sidebar"
import { DesktopHeader } from "@/components/navigation/desktop-header"
import { Footer } from "@/components/navigation/footer"
import { ContextWrapper } from '@/context'


const font = Kanit({ weight: "400", style: "normal", subsets: ['latin'] })

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
    <ClerkProvider>
      <html lang="en">
        <SignedIn>
          <body className={`${font.className} flex flex-col lg:flex-row`}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <MobileNav />

              <Sidebar />
              <section className="px-3 lg:px-6 lg:pt-6 lg:pb-4 flex-1 flex flex-col min-h-0 lg:mt-0 max-h-screen" style={{ minHeight: 'calc(100vh - 88px)'}}>
                <DesktopHeader />
                <ContextWrapper>
                  {children}
                </ContextWrapper>
                <Footer />
              </section>
              <Toaster richColors closeButton />
            </ThemeProvider>
            
          </body>
        </SignedIn>

        <SignedOut>
          <body className={`${font.className} block lg:flex`}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <section className="flex-1">
                {children}
              </section>
            </ThemeProvider>
          </body>
        </SignedOut>
      </html>
    </ClerkProvider>
  )
}