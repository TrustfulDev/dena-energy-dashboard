import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="relative flex flex-col h-full mb-6">
            <Skeleton className="w-full h-14 mb-6" />
            <Skeleton className="w-full h-14 mb-6" />
            <Skeleton className="w-full h-14 mb-6" />
            <Skeleton className="w-full h-14 mb-6" />
            <Skeleton className="w-full h-14 mb-6" />
        </div>
    )
}