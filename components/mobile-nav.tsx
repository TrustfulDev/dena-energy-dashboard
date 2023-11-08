import { 
    Menu, 
    LayoutDashboard, 
    BarChart3,
    FilePieChart,
    Settings,
    LogOut
} from "lucide-react"

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

import { NavBtn } from "@/components/nav-btns"
import { ThemeToggle } from "@/components/theme-toggle"

import Image from 'next/image'

export const MobileNav = () => {
    return (
        <nav className="flex justify-between p-6 fixed w-full md:hidden">
            <Sheet>
                <SheetTrigger><Menu /></SheetTrigger>

                <SheetContent side="left" className="w-full bg-primary-bg flex flex-col items-center">
                    <Image 
                        src="https://static1.squarespace.com/static/6317eadce6c9ad7186eda45f/t/63cc428dbaa259500f507df3/1697402676070/"
                        width={100}
                        height={100}
                        alt="Dena Energy Logo"
                        className="mt-20"
                    />
                    <h1 className="text-3xl mb-14">Dena Energy</h1>

                    <div className="flex flex-col gap-1 w-full">
                        {/* NavBtn will need to be edited to include onClick function */}
                        <NavBtn Icon={LayoutDashboard} text="Dashboard" active={true} className="" />
                        <NavBtn Icon={BarChart3} text="Analytics" active={false} className="" />
                        <NavBtn Icon={FilePieChart} text="Reports" active={false} className="" />
                        <NavBtn Icon={Settings} text="Settings" active={false} className="" />
                        <NavBtn Icon={LogOut} text="Log out" active={false} className="" />
                    </div>
                </SheetContent>
            </Sheet>

            <div>
                <ThemeToggle />
            </div>
        </nav>
    )
}