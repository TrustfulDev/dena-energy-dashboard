import Link from "next/link"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen">
            <div className="hidden bg-primary flex-1 p-6 xl:p-16 md:flex flex-col">
                <h2 className="text-foreground text-2xl xl:text-4xl mb-2 xl:mb-4">Dena Energy</h2>
                <h1 className="text-foreground text-4xl xl:text-6xl">Best Energy Data <br/>Analytics Platform</h1>

                <p className="text-foreground text-xl mt-auto">Secured with Clerk Authentication</p>
            </div>
            <div className="relative flex-1 p-6 xl:p-16">
                {children}
                <Link href="/privacy" className="absolute bottom-6 xl:bottom-16 left-1/2 -translate-x-1/2">Privacy Policy</Link>
            </div>
        </div>
    )
}