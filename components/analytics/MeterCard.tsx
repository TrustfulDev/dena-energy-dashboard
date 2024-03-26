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
import { PropertyDetails } from "@/lib/propertiesApi";

interface MeterCardProps {
    properties: PropertyDetails[];
    meter: any;
}
interface Meter {
    meterId: string;
    energyConsumption?: EnergyConsumption;
    details?: MeterDetails;
}

interface MeterDetails {
    type: string;
    name: string;
    unitOfMeasure: string;
}
interface EnergyConsumption {
    id: string;
    usage: string;
    startDate: string;
    endDate: string;
    cost: string;
}
  


export const MeterCard = ({ properties, meter}: MeterCardProps) => {
    // Used for Pop-Over components (dropdown selection)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");   // Stores name
    
    let totalUsage = 0;
    let totalCost = 0;
    let monthlyMeterUsage = 0;
    let monthlyMeterCost = 0;
  
    for(let i = 0; i < meter?.energyConsumption.length; i++){
        let totalU = parseFloat(meter?.energyConsumption[i].usage);
        totalUsage += isNaN(totalU) ? 0 : totalU;
        let totalC = parseFloat(meter?.energyConsumption[i].cost);
        totalCost += isNaN(totalC) ? 0 : totalC;
    }
    if(value){
        for(let i = 0; i < meter?.energyConsumption.length; i++){
            const selectedDate = meter?.energyConsumption[i].startDate + " - " + meter?.energyConsumption[i].endDate;
            if(selectedDate === value){
                let usage = parseFloat(meter?.energyConsumption[i].usage);
                monthlyMeterUsage = isNaN(usage) ? 0 : usage;
                let cost = parseFloat(meter?.energyConsumption[i].cost);
                monthlyMeterCost = isNaN(cost) ? 0 : cost;    
            }
        }

    }
       
    return (
      
        <Card className="col-span-2">
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <h1 className="text-3xl">{meter?.details.name}</h1>
                    <p className="flex items-center gap-1 text-sm">{meter?.meterId}</p>
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
                                    {meter?.energyConsumption.map((entry:any) => (
                                    <CommandItem
                                        key={entry.meterId}
                                        value={entry.startDate + " - " + entry.endDate}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        {entry.startDate + " - " + entry.endDate}
                                        <CheckSquare
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === entry.startDate + " - " + entry.endDate ? "opacity-100" : "opacity-0"
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
                <p>Meter overall Information</p>
                <p>Usage:{totalUsage} </p>
                <p>Cost:{totalCost}  </p>
                <p>type:{meter?.details.type}  </p>
                <p>name:{meter?.details.name} </p>
                <p> unitOfMeasure:{meter?.details.unitOfMeasure} </p>

                <p>Bill selected Information: {value}</p>
                <p>Monthly Usage: {monthlyMeterUsage}</p>
                <p>Monthly Cost: {monthlyMeterCost}</p>
                
            </CardContent>
        </Card>
    )
}