"use client"

// React & Packages
import { useState, useEffect } from "react"
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react"

// Components
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
  
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MultiSelect } from "./multiSelect";

export const MeterAnalytics = ({}) => {
    // Used for Pop-Over components (dropdown selection)
    const [date, setDate] = useState<Date>();                           // Stores date

    // GET a list of all properties & Initialize Date
    useEffect(() => {
        setDate(new Date()); // Set current date as initial value
    }, []);

    return (
        <>
            <header className="flex gap-2 justify-between mb-1">
                {/* Name & Address */}
                <div>
                    <h1 className="text-3xl min-[1930px]:text-4xl capitalize">Select Meters To View</h1>
                    <p className="flex items-center gap-1 text-sm">
                        Meters Selected: 0
                    </p>
                </div>

                {/* Command + Date */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <MultiSelect />

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </header>

            <div className="flex-grow">
                Test
            </div>
        </>
    )
}