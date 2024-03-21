"use client";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Gauge } from 'lucide-react';
  
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useState } from "react";

export const MultiSelect = () => {
    const [checked, setChecked] = useState<string[]>([]);

    return (
        <Sheet modal={false}>
            <SheetTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                    <Gauge /> Select Meters
                </Button>
            </SheetTrigger>
            <SheetContent side="left" onInteractOutside={event => event.preventDefault()}>
                <SheetHeader className="mb-4">
                    <SheetTitle>Select Meters To View</SheetTitle>
                    <SheetDescription>You can choose which meters from which buildings to view on the dashboard.</SheetDescription>
                </SheetHeader>
                <Command>
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="EPA Sample Office">
                            <CommandItem>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="terms1" 
                                        checked={checked.includes("terms1")}
                                        onCheckedChange={() => { 
                                            setChecked(prev => {
                                                const index = prev.indexOf("terms1");
                                                if (index !== -1) {
                                                    return prev.filter(item => item !== "terms1");
                                                } else {
                                                    return [...prev, "terms1"]
                                                }
                                            })
                                        }}
                                    />

                                    <label
                                        htmlFor="terms1"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Meter 1
                                    </label>
                                </div>

                                {/* Pass in the property name here so that the search bar can also search for properties */}
                                <p className="sr-only" aria-hidden>EPA Sample Office</p>
                            </CommandItem>
                            <CommandItem>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="terms2" 
                                        checked={checked.includes("terms2")}
                                        onCheckedChange={() => { 
                                            setChecked(prev => {
                                                const index = prev.indexOf("terms2");
                                                if (index !== -1) {
                                                    return prev.filter(item => item !== "terms2");
                                                } else {
                                                    return [...prev, "terms2"]
                                                }
                                            })
                                        }}
                                    />
                                    <label
                                        htmlFor="terms2"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Meter 21
                                    </label>
                                </div>
                            </CommandItem>
                        </CommandGroup>

                        <CommandSeparator />

                        <CommandGroup heading="EPA Sample Laboratory">
                            <CommandItem>
                            <   div className="flex items-center space-x-2">
                                    <Checkbox id="terms3" 
                                        checked={checked.includes("terms3")}
                                        onCheckedChange={() => { 
                                            setChecked(prev => {
                                                const index = prev.indexOf("terms3");
                                                if (index !== -1) {
                                                    return prev.filter(item => item !== "terms3");
                                                } else {
                                                    return [...prev, "terms3"]
                                                }
                                            })
                                        }}
                                    />
                                    <label
                                        htmlFor="terms3"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Meter 31
                                    </label>
                                </div>
                            </CommandItem>
                            <CommandItem>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="terms4" 
                                        checked={checked.includes("terms4")}
                                        onCheckedChange={() => { 
                                            setChecked(prev => {
                                                const index = prev.indexOf("terms4");
                                                if (index !== -1) {
                                                    return prev.filter(item => item !== "terms4");
                                                } else {
                                                    return [...prev, "terms4"]
                                                }
                                            })
                                        }}
                                    />
                                    <label
                                        htmlFor="terms4"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Meter 22
                                    </label>
                                </div>
                            </CommandItem>
                            <CommandItem>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="terms5" 
                                        checked={checked.includes("terms5")}
                                        onCheckedChange={() => { 
                                            setChecked(prev => {
                                                const index = prev.indexOf("terms5");
                                                if (index !== -1) {
                                                    return prev.filter(item => item !== "terms5");
                                                } else {
                                                    return [...prev, "terms5"]
                                                }
                                            })
                                        }}
                                    />
                                    <label
                                        htmlFor="terms5"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Meter 34
                                    </label>
                                </div>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </SheetContent>
        </Sheet>
    )
}