"use client"

import { useState, useEffect } from 'react'
import { ThemeToggle } from "../theme-toggle"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs";

export const DesktopHeader = () => {
    // Used to determine which page the user is on & sets the active nav-btn.
    const pathname = usePathname();
    
    // Update the header based on the current page
    const [page, setPage] = useState("Overview")
    useEffect(() => {
        const pathMap: {[key: string]: string} = {
            "/": "Overview",
            "/analytics": "Analytics",
            "/reports": "Reports",
            "/linking": "Account Linking"
        };

        setPage(pathMap[pathname] || "Overview");
    }, [pathname]);

    return (
        <header className="hidden md:flex justify-between mb-6 min-h-[48px]">
            <h1 className="text-5xl text-indigo-500">{page}</h1>
            <div className="flex items-center gap-3">
                <ThemeToggle />
                
                <UserButton afterSignOutUrl="/" 
                    appearance={{
                        elements: {
                            avatarBox: "w-[3rem] h-[3rem]"
                        }
                    }}
                />
                
            </div>
            
        </header>



    )
}