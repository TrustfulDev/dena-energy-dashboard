"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { Button } from '../ui/button';

import { cn } from "@/lib/utils"
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
import { CheckSquare, ChevronsUpDown } from "lucide-react";

const dummyData = [
    {
        test: "hello",
        test2: "world"
    },
    {
        test: "goodbye",
        test2: "to you"
    },
    {
        test: "lorem",
        test2: "ipsum"
    },
]

export const MeterCard = () => {
    // Used for Pop-Over components (dropdown selection)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");   // Stores name

    return (
        <Card className="col-span-2">
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <h1 className="text-3xl">Meter Name</h1>
                    <p className="flex items-center gap-1 text-sm">Meter ID</p>
                </div>
                <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[280px] justify-between"
                            >
                                {value === "" ? "Set Default Value" : value}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[280px] p-0">
                            <Command>
                                <CommandInput placeholder="Search bills..." className="h-9" />
                                <CommandEmpty>No properties found.</CommandEmpty>

                                <CommandGroup>
                                    {dummyData?.map((entry) => (
                                    <CommandItem
                                        key={entry.test2}
                                        value={entry.test2}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        {entry.test2}
                                        <CheckSquare
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === entry.test2 ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
            </CardHeader>

            <CardContent>
                <p>Just print out all the data first</p>
                <p>energyConsumption: usage, cost</p>
                <p>details: type, name, unitOfMeasure</p>
            </CardContent>
        </Card>
    )
}