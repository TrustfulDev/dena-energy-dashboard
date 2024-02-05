import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"

export const MultiSelect = () => {
    return (
        <Command>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="EPA Sample Office">
                    <CommandItem>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Meter 1
                            </label>
                        </div>
                    </CommandItem>
                    <CommandItem>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
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
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Meter 31
                            </label>
                        </div>
                    </CommandItem>
                    <CommandItem>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Meter 22
                            </label>
                        </div>
                    </CommandItem>
                    <CommandItem>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Meter 34
                            </label>
                        </div>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </Command>
    )
}