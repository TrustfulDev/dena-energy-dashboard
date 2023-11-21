"use client"
import Image from 'next/image'

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

import { NavBtn } from "@/components/navigation/nav-btns"
import { ThemeToggle } from "@/components/theme-toggle"
import { usePathname, useRouter } from "next/navigation"
import { useClerk } from '@clerk/nextjs';

export const MobileNav = () => {
    // Used to determine which page the user is on & sets the active nav-btn.
    const pathname = usePathname();
    const { signOut } = useClerk();
    const router = useRouter();

    return (
        <div className="h-[88px] md:hidden">
            <nav className="flex justify-between p-6 fixed w-full bg-primary-bg">
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
                            <NavBtn Icon={LayoutDashboard} text="Dashboard" link="/" active={pathname === "/"} className="" withSheetClose />
                            <NavBtn Icon={BarChart3} text="Analytics" link="/analytics" active={pathname === "/analytics"} className="" withSheetClose />
                            <NavBtn Icon={FilePieChart} text="Reports" link="/reports" active={pathname === "/reports"} className="" withSheetClose />
                            <NavBtn Icon={Settings} text="Settings" link="/settings" active={pathname === "/settings"} className="" withSheetClose />
                            <NavBtn Icon={LogOut} text="Log out" link="#" active={false} className="mt-auto text-red-400" clickHandler={() => signOut(() => router.push("/"))} withSheetClose />
                        </div>
                    </SheetContent>
                </Sheet>

                <div>
                    <ThemeToggle />
                </div>
            </nav>
        </div>
    )
}