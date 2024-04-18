import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="grid grid-cols-4 gap-4 md:gap-6 h-full m-4 md:mb-6 md:mx-0 mt-0 xl:pr-6 md:flex-wrap md:overflow-y-auto">
            <Skeleton className="flex flex-col col-span-2 p-6 md:p-8 rounded-lg" />
            <Skeleton className="flex flex-col col-span-2 p-6 md:p-8 rounded-lg" />
            <Skeleton className="flex flex-col col-span-2 p-6 md:p-8 rounded-lg" />
            <Skeleton className="flex flex-col col-span-2 p-6 md:p-8 rounded-lg" />
        </div>
    )
}