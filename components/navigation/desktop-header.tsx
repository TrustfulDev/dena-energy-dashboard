"use client"

import { useState, useEffect } from 'react'
import { ThemeToggle } from "../theme-toggle"
import { usePathname } from "next/navigation"

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
            "/settings": "Settings"
        };

        setPage(pathMap[pathname] || "Overview");
    }, [pathname]);

    return (
        <header className="hidden md:flex justify-between mb-8">
            <h1 className="text-4xl">{page}</h1>
            <ThemeToggle />
        </header>
    )
}