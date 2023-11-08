import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

interface NavBtnProps {
    Icon: LucideIcon,
    text: String,
    active: Boolean
    className: String,
}

export const NavBtn: React.FC<NavBtnProps> = ({
    Icon,
    text,
    active,
    className
}) => {
    return (
        <Button variant="left" className={`hover:bg-primary-card hover:text-primary-text text-base py-7 ${active ? "text-primary-text bg-primary-card" : "text-faded-text"} ${className}`} >
            <Icon className="mr-3 h-5 w-5" /> {text}
        </Button>
    )
}