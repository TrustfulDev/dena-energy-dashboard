"use client"

import { 
    LayoutDashboard, 
    BarChart3,
    FilePieChart,
    UserCog,
    LogOut,
} from "lucide-react"

import { NavBtn } from "@/components/navigation/nav-btns"
import { usePathname, useRouter } from "next/navigation"
import { useClerk, useUser } from "@clerk/nextjs"

export const Sidebar = () => {
    const pathname = usePathname();
    const { signOut } = useClerk();
    const router = useRouter();
    const { user } = useUser();

    return (
        <aside className="hidden md:inline-flex flex-col gap-3 w-[368px] h-screen border-r-2 border-primary p-6">
            <header className="mb-4">
                <h2>Welcome Back</h2>
                <h1 className="text-5xl">{user?.fullName || "Valued User"}</h1>
            </header>

            <NavBtn Icon={LayoutDashboard} text="Overview" link="/" active={pathname === "/"} className="" />
            <NavBtn Icon={BarChart3} text="Analytics" link="/analytics" active={pathname === "/analytics"} className="" />
            <NavBtn Icon={FilePieChart} text="Reports" link="/reports" active={pathname === "/reports"} className="" />
            <NavBtn Icon={UserCog} text="Account Linking" link="/linking" active={pathname === "/linking"} className="" />

            {/* Overwrite text color and hover effects. Destructive Button */}
            <NavBtn Icon={LogOut} text="Log out" link="#" active={false} className="mt-auto text-red-400 hover:border-red-400 hover:bg-red-400 hover:bg-opacity-10 hover:text-red-400" clickHandler={() => signOut(() => router.push("/"))} />
        </aside>
    )
}