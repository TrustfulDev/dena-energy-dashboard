"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { ChevronsUpDown , CheckSquare, Gauge, Users, LandPlot, MapPin } from 'lucide-react';

/* READ THIS 
* Replace all "frameworks" with property ID
* The rest of the code is based on this dummy data below (frameworks)
* Suggestion: Ctrl + F and search for "framework"
*/
const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

interface MeterAnalyticsProps {
    data: string; // CHANGE AS NEEDED
}

export const MeterAnalytics: React.FC<MeterAnalyticsProps> = ({
    data
}) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    return (
        <>
            <header className="flex items-center gap-8 mb-1">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                        >
                            {/* THE INTIAL/DEFAULT VALUE set here, we should change it to use the first possible property */}
                            {value
                                ? frameworks.find((framework) => framework.value === value)?.label
                                : "Select framework..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search framework..." className="h-9" />
                            <CommandEmpty>No framework found.</CommandEmpty>

                            <CommandGroup>
                                {frameworks.map((framework) => (
                                <CommandItem
                                    key={framework.value}
                                    value={framework.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {framework.label}
                                    <CheckSquare
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            value === framework.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>

                {/* REPLACE BELOW WITH ACTUAL DATA */}
                <h1 className="text-3xl capitalize">{ value === "" ? "Select Framework" : value}</h1>
                <p className="flex items-center gap-2"><Gauge /> 4 Meters</p>
                <p className="flex items-center gap-2"><Users /> 100% Occupancy</p>
                <p className="flex items-center"><LandPlot className="mr-2" />120,000 ft<span className="relative bottom-1 text-xs">2</span></p>
                <p className="flex items-center gap-2"><MapPin />88 Rose Street, Portland, OR 97202</p>
            </header>

            <div className="flex-grow">
                PUT DATA/GRAPHS/INFORMATION HERE
            </div>
        </>
    )
}