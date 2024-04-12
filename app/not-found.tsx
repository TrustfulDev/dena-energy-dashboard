import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="relative flex flex-col justify-center items-center gap-4 w-full h-full flex-grow text-center">
            <p className="relative leading-none sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 text-[45vw] sm:text-[30vw] font-extrabold opacity-5 sm:z-[-1]">404</p>
            <p className="text-2xl font-medium">Seems like you got lost!</p>
            <Button asChild variant="left"><Link href="/" className="font-medium">Return Home</Link></Button>
        </div>
    )
}