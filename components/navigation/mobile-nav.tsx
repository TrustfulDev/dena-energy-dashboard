"use client"
import { 
    Menu, 
    LayoutDashboard, 
    BarChart3,
    FilePieChart,
    UserCog,
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
import { useClerk, useUser } from '@clerk/nextjs';

export const MobileNav = () => {
    // Used to determine which page the user is on & sets the active nav-btn.
    const pathname = usePathname();
    const { signOut } = useClerk();
    const router = useRouter();
    const { user } = useUser();

    return (
        <div className="h-[88px] lg:hidden z-10">
            <nav className="flex justify-between p-6 fixed w-full bg-background">
                <Sheet>
                    <SheetTrigger><Menu /></SheetTrigger>

                    <SheetContent side="left" className="w-full bg-background flex flex-col items-center">
                        <header className="mb-4 w-full pt-8">
                            <h2>Welcome Back</h2>
                            <h1 className="text-5xl">{user?.fullName || "Valued User"}</h1>
                        </header>

                        <div className="flex flex-col gap-2 w-full h-full">
                            <NavBtn Icon={LayoutDashboard} text="Dashboard" link="/" active={pathname === "/"} className="" withSheetClose />
                            <NavBtn Icon={BarChart3} text="Analytics" link="/analytics" active={pathname === "/analytics"} className="" withSheetClose />
                            <NavBtn Icon={FilePieChart} text="Reports" link="/reports" active={pathname === "/reports"} className="" withSheetClose />
                            <NavBtn Icon={UserCog} text="Account Linking" link="/linking" active={pathname === "/linking"} className="" withSheetClose />
                            
                            {/* Overwrite text color and hover effects. Destructive Button */}
                            <NavBtn Icon={LogOut} text="Log out" link="#" active={false} className="mt-auto text-red-400 hover:border-red-400 hover:bg-red-400 hover:bg-opacity-10 hover:text-red-400" clickHandler={() => signOut(() => router.push("/"))} />
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