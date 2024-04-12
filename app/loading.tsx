import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
    return (
        <div className="grid grid-cols-6 xl:gap-6 gap-2 h-full mb-6 lg:overflow-y-auto xl:pr-6">
            <Skeleton className="w-full col-span-6 min-h-[500px]" />
            <Skeleton className="md:col-span-3 col-span-6 min-h-[500px] h-full w-full" />
            <Skeleton className='md:col-span-3 col-span-6 min-h-[500px] h-fit sm:h-full w-full' />
            <Skeleton className='2xl:col-span-2 md:col-span-3 col-span-6 aspect-square h-full w-full' />
            <Skeleton className='2xl:col-span-2 md:col-span-3 col-span-6 aspect-square h-full w-full' />
            <Skeleton className='2xl:col-span-2 col-span-6 2xl:aspect-square xl:aspect-video aspect-square h-full w-full' />
        </div>
    )
}