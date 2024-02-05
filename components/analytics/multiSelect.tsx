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

export const MultiSelect = () => {
    return (
        <Sheet >
            <SheetTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                    <Gauge /> Select Meters
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
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
                                    <Checkbox id="terms1" />
                                    <label
                                        htmlFor="terms1"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Meter 1
                                    </label>
                                </div>
                            </CommandItem>
                            <CommandItem>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="terms2" />
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
                                    <Checkbox id="terms3" />
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
                                    <Checkbox id="terms4" />
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
                                    <Checkbox id="terms5" />
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