import Link from "next/link";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export default function NoAccount({
    className
}: {
    className?: string
}) {
    return (
        <Card className={`flex flex-col justify-center items-center gap-8 w-full h-full text-center ${className}`}>
            <h2 className="text-5xl text-red-400 font-extrabold">An Error Has Occurred!</h2>
            <p className="max-w-[50ch]">It seems like you don&apos;t have any accounts linked with us! Please navigate to the Account Linking tab and link at least one account. If this problem persists, please contact an admin for further assistance.</p>
            <Button asChild variant="left"><Link href="/linking">Link an Account</Link></Button>
        </Card>
    )
}