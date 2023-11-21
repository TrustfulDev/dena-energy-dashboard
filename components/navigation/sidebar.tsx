"use client"

import { 
    LayoutDashboard, 
    BarChart3,
    FilePieChart,
    Settings,
    LogOut
} from "lucide-react"

import { NavBtn } from "@/components/navigation/nav-btns"
import { usePathname } from "next/navigation"


export const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="hidden md:inline-flex flex-col gap-4 w-[368px] h-screen border-r border-primary-card p-6">
            <header className="mb-4">
                <h1 className="text-4xl">Dena Energy</h1>
            </header>

            <NavBtn Icon={LayoutDashboard} text="Dashboard" link="/" active={pathname === "/"} className="" />
            <NavBtn Icon={BarChart3} text="Analytics" link="/analytics" active={pathname === "/analytics"} className="" />
            <NavBtn Icon={FilePieChart} text="Reports" link="/reports" active={pathname === "/reports"} className="" />
            <NavBtn Icon={Settings} text="Settings" link="/settings" active={pathname === "/settings"} className="" />

            <NavBtn Icon={LogOut} text="Log out" link="#" active={false} className="mt-auto text-red-400" />
        </aside>
    )
}