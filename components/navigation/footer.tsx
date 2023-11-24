import { Copyright, Linkedin } from "lucide-react"

export const Footer = () => {
    return (
        <footer className="mt-auto px-4 md:px-0">
            <hr className="border-none bg-secondary-cta h-[1px]" />
            <div className="flex justify-between px-2 py-4 md:pt-6 md:pb-0">
                <p className="flex items-center"><Copyright className="mr-2" /> 2023 Dena Energy Inc.</p>
                <a href="https://www.linkedin.com/company/dena-energy/" target="_blank" rel="noopener noreferrer"><Linkedin /></a>
            </div>
        </footer>
    )
}