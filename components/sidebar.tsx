import { 
    LayoutDashboard, 
    BarChart3,
    FilePieChart,
    Settings,
    LogOut
} from "lucide-react"

import { NavBtn } from "@/components/nav-btns"

export const Sidebar = () => {
    return (
        <aside className="hidden md:inline-flex flex-col gap-4 w-[368px] h-screen border-r border-primary-card p-[23px]">
            <header className="mb-4">
                <h1 className="text-4xl">Dena Energy</h1>
            </header>

            <NavBtn Icon={LayoutDashboard} text="Dashboard" active={true} className="" />
            <NavBtn Icon={BarChart3} text="Analytics" active={false} className="" />
            <NavBtn Icon={FilePieChart} text="Reports" active={false} className="" />
            <NavBtn Icon={Settings} text="Settings" active={false} className="" />
            <NavBtn Icon={LogOut} text="Log out" active={false} className="mt-auto text-red-400" />
        </aside>
    )
}