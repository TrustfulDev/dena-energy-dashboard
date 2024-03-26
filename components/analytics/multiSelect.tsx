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
import { PropertyDetails } from '@/lib/propertiesApi';


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
            <SheetContent side="left" onInteractOutside={event => event.preventDefault()}>
                <SheetHeader className="mb-4">
                    <SheetTitle>Select Meters To View</SheetTitle>
                    <SheetDescription>You can choose which meters from which buildings to view on the dashboard.</SheetDescription>
                </SheetHeader>
                <Command>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    {properties.map((property) => (
                    <CommandGroup key={property.name} heading={property.name}>
                        {Object.entries(property.meterAssociations).map(([meterType, meters]) => {
                        if (meterType === 'energyMeters') {
                            return null;
                        }
                        return (
                            <div key={meterType}>
                            <p className="font-bold">{meterType}</p>
                            {meters.map((meter: any) => (
                                <CommandItem key={meter.meterId}>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                    id={meter.meterId}
                                    checked={checked.includes(meter.meterId)}
                                    onCheckedChange={() => handleCheckboxChange(meter.meterId)}
                                    />
                                    <label htmlFor={meter.meterId} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {meter.details.name}
                                    </label>
                                </div>
                                </CommandItem>
                            ))}
                            </div>
                        );
                        })}
                    </CommandGroup>
                    ))}
                </CommandList>
                </Command>
            </SheetContent>
        </Sheet>
    )
}