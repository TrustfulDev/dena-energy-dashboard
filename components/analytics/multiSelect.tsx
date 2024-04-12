"use client";
import {
    Command,
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
  
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { PropertyDetails } from '@/lib/propertiesApi';
import { Fuel, Droplets, Trash2, Zap, Gauge, LucideIcon } from 'lucide-react';

interface MultiSelectProps {
    properties: PropertyDetails[];
    checked: string[];
    setChecked: React.Dispatch<React.SetStateAction<string[]>>;
  }

export const MultiSelect = ({ properties, checked, setChecked }: MultiSelectProps) => {
    //console.log("p",properties);
    const handleCheckboxChange = (meterId: string) => {
        setChecked((prev) => {
          const index = prev.indexOf(meterId);
          if (index !== -1) {
            return prev.filter((item) => item !== meterId);
          } else {
            return [...prev, meterId];
          }
        });
      };

    
    return (
        <Sheet modal={false}>
            <SheetTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                    <Gauge /> Select Meters
                </Button>
            </SheetTrigger>
            <SheetContent side="left" onInteractOutside={event => event.preventDefault()} className="h-svh flex flex-col">
                <SheetHeader className="mb-1">
                    <SheetTitle>Select Meters To View</SheetTitle>
                    <SheetDescription>You can choose which meters from which buildings to view on the dashboard.</SheetDescription>
                </SheetHeader>

                <Command className="h-full">
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList className="!max-h-none">
                        {properties.map((property) => (
                            <>
                                <CommandGroup key={property.name} heading={property.name}>
                                    {Object.entries(property.meterAssociations).map(([meterType, meters]) => {
                                        if (meterType === 'energyMeters') {
                                            return null;
                                    }

                                    let Icon: LucideIcon = Trash2;
                                    if (meterType === "waterMeters") Icon = Droplets;
                                    else if (meterType === "electricMeters") Icon = Zap;
                                    else if (meterType === "naturalGasMeters") Icon = Fuel

                                    return (
                                        <div key={meterType}>
                                            {meters.map((meter: any) => (
                                                <CommandItem key={meter.meterId}>
                                                    <p className="sr-only" aria-hidden>{property.name}</p>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={meter.meterId}
                                                            checked={checked.includes(meter.meterId)}
                                                            onCheckedChange={() => handleCheckboxChange(meter.meterId)}
                                                        />
                                                        <label htmlFor={meter.meterId} className="flex gap-2 items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                            <Icon className="w-[18px] h-[18px]" /> {meter.details.name}
                                                        </label>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </div>
                                    );
                                    })}
                                </CommandGroup>

                                <CommandSeparator />
                            </>
                        ))}
                </CommandList>
                </Command>
            </SheetContent>
        </Sheet>
    )
}