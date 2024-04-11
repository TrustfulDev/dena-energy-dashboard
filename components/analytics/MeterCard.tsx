"use client";

import { useState, useEffect } from "react";
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
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
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
    const [totalUsage, setTotalUsage] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [monthlyMeterUsage, setMonthlyMeterUsage] = useState(0);
    const [monthlyMeterCost, setMonthlyMeterCost] = useState(0);
    
    useEffect(() => {
        let tempTotalUsage = 0;
        let tempTotalCost = 0;
        for (let i = 0; i < meter?.energyConsumption.length; i++) {
            let quantityOrUsage = meter?.details.unitOfMeasure === "pounds" 
                                  ? parseFloat(meter?.energyConsumption[i].quantity)
                                  : parseFloat(meter?.energyConsumption[i].usage);                   
            let cost = parseFloat(meter?.energyConsumption[i].cost);
            if (!isNaN(quantityOrUsage)) {
                tempTotalUsage += quantityOrUsage;
            }
            if (!isNaN(cost)) {
                tempTotalCost += cost;
            }
        }
        setTotalUsage(tempTotalUsage);
        setTotalCost(tempTotalCost);
    }, [meter]); 
    
    
    useEffect(() => {
        if(value){
            for(let i = 0; i < meter?.energyConsumption.length; i++){
                const selectedDate = meter?.energyConsumption[i].startDate + " - " + meter?.energyConsumption[i].endDate;
                if(selectedDate === value){
                    let quantityOrUsage = meter?.details.unitOfMeasure === "pounds" 
                                  ? parseFloat(meter?.energyConsumption[i].quantity)
                                  : parseFloat(meter?.energyConsumption[i].usage);
                    setMonthlyMeterUsage(isNaN( quantityOrUsage) ? 0 :  quantityOrUsage);
                    let cost = parseFloat(meter?.energyConsumption[i].cost);
                    setMonthlyMeterCost(isNaN(cost) ? 0 : cost);  
                    break;  
                }
            }
        }   
    },[value])

    function formatDate(inputDate: string): string {
        
        // Split the input date string into year, month, and day parts
        const [year, month, day] = inputDate.split('-').map(Number);
        const date = new Date(year, month - 1, day); // month is zero-based in JavaScript Date
    
        // Create a formatter with the desired format
        const formatter = new Intl.DateTimeFormat('en-US', {
            month: 'short', // Short month name
            day: '2-digit', // Two-digit day
            year: 'numeric' // Full year
        });
    
        return formatter.format(date);
    }
    function formatDateString(dateRange:string) {
        if (!dateRange) { return " "; }

        // Split the range into start and end dates
        const [startDate, endDate] = dateRange.split(' - ');

        function createDate(dateStr:string) {
        const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));
            return new Date(year, month - 1, day);
        }

        const start = createDate(startDate);
        const end = createDate(endDate);
        const options = { year: 'numeric', month: 'short', day: '2-digit' };

        // Format the dates
        const formattedStart = start.toLocaleDateString('en-US', options as any);
        const formattedEnd = end.toLocaleDateString('en-US', options as any);

        // Combine the formatted dates
        return `${formattedStart} - ${formattedEnd}`;
      }
   
    function findProperty(meterid : string){
        let propertyName = "";
        properties.forEach(property => {
            Object.values(property.meterAssociations).forEach(category => {
                category.forEach((meter: any) => {
                    if (meter.meterId === meterid) {
                        propertyName = property.name;    
                    }
                });
            });
        });
        return propertyName;
    }
      
    return (
      
        <Card className="col-span-2">
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <h1 className="text-3xl">{meter?.details.name}</h1>
                    <p className="flex items-center gap-1 text-sm">{meter?.meterId}</p>
                    <p className="flex items-center gap-1 text-sm">{findProperty(meter?.meterId)}</p>
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
                            <Command className="max-h-[300px]">
                                <CommandInput placeholder="Search bills..." className="h-9" />
                                <CommandEmpty>No properties found.</CommandEmpty>

                                <CommandGroup className="overflow-y-auto">
                                    {meter?.energyConsumption.map((entry:any) => (
                                    <CommandItem
                                        key={entry.meterId}
                                        value={entry.startDate + " - " + entry.endDate}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        {formatDate(entry.startDate) + " - " + formatDate(entry.endDate)}
                                        <CheckSquare
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === entry.startDate + " - " + entry.endDate  ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
            </CardHeader>

            <CardContent className="mb-4">
                <div className="flex gap-4 w-full">
                    <Card className="w-full">
                        <CardContent className="flex flex-col justify-center items-center px-6 py-4">
                            <p className="text-xl font-bold">ALL-TIME COST</p>
                            <p>${(Math.round(totalCost * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}  </p>
                        </CardContent>
                    </Card>

                    <Card className="w-full">
                        <CardContent className="flex flex-col justify-center items-center px-6 py-4">
                            <p className="text-xl font-bold">ALL-TIME USAGE</p>
                            <p>{(Math.round(totalUsage * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {meter?.details.unitOfMeasure} </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="w-full mt-4">
                    <CardHeader>
                        <p className="text-xl font-bold">BILL INFORMATION: <span className="text-lg font-normal">{formatDateString(value)}</span></p>
                    </CardHeader>
                    <CardContent>
                        <p>Usage: {monthlyMeterUsage.toLocaleString()} {meter?.details.unitOfMeasure}</p>
                        <p>Cost: ${monthlyMeterCost.toLocaleString()}</p>
                    </CardContent>
                </Card>

                <p className="text-sm text-accent-faded w-full text-center mt-2">{meter?.details.type}  </p>
            </CardContent>
        </Card>
    )
}