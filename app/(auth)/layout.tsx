export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen">
            <div className="hidden bg-primary-cta flex-1 p-6 xl:p-16 md:flex flex-col">
                <h2 className="text-primary-card font-bold text-2xl xl:text-4xl mb-2 xl:mb-4">Dena Energy</h2>
                <h1 className="text-primary-bg font-bold text-4xl xl:text-6xl">Best Energy Data <br/>Analytics Platform</h1>

                <p className="text-primary-bg mt-auto">Secured with Clerk Authentication</p>
            </div>
            <div className="flex-1 p-6 xl:p-16">{children}</div>
        </div>
    )
}