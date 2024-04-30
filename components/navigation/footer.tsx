import { Copyright, Linkedin } from "lucide-react"
import Link from 'next/link';



export const Footer = () => {
    return (
        <footer className="mt-auto px-0">
            <hr className="border-none bg-primary h-[2px] rounded-lg" />
            <div className="flex justify-between px-2 py-4 lg:pb-0">
                <p className="flex items-center"><Copyright className="mr-2" /> 2024 Dena Energy Inc.</p>
                <Link href="/privacy"> Privacy Policy </Link>
                <a href="https://www.linkedin.com/company/dena-energy/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin /></a>               
            </div>
        </footer>
    )
}