import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="relative flex flex-col h-full mb-6">
            <Skeleton className="w-full h-10 mb-6" />

            <div className="grid grid-cols-6 grid-rows-4 gap-6 h-full">
                <Skeleton className="col-span-3 row-span-2"/>
                <Skeleton className="col-span-3 row-span-2"/>

                <Skeleton className="col-span-2 row-span-2"/>
                <Skeleton className="col-span-2 row-span-2"/>
                <Skeleton className="col-span-2 row-span-2"/>
            </div>
        </div>
    )
}