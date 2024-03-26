"use client"

// React & Packages
import { useState } from "react"
import { Fuel, Droplets, Footprints, Trash2, Zap } from 'lucide-react';
import { 
    ChevronsUpDown, 
    CheckSquare, 
    Gauge, 
    Users, 
    LandPlot, 
    MapPin 
} from 'lucide-react';

// Components
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
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {  Cell, PieChart, LabelList, Pie, Sector, LineChart, Line, BarChart, Bar,XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

 

// data units
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const { name, value, type } = payload[0].payload;
      const unit = type === 'Electricity' ? ' kWh' : type === 'Waste' ? ' pounds' : type === 'Water' ? ' gallons' : type === 'Natrual Gas' ? 'therm' : type === 'Cost' ? ' $' : '';
      return (
        <div className="custom-tooltip backdrop-blur-md text-neutral-200 p-4 font-bold rounded-sm">
          <p className="drop-shadow text-lg">{`${name}: ${value} ${unit}`}</p>
        </div>
      );
    }
    return null;
};

import { PropertyDetails } from "@/lib/propertiesApi";
// Interfaces
interface ConsumptionData {
    month: string;
    name: string;
    value: number;
    type: string;
    fill: string;
}
// selected property recent data process
function processSelectedProperty(selected: PropertyDetails): { consumption_data: ConsumptionData[],cost_data: ConsumptionData[],highestConsumer_data: ConsumptionData[]} {
    let consumption_data: ConsumptionData[] = [];
    let cost_data: ConsumptionData[] = [];
    let highestConsumer_data: ConsumptionData[] = [];
    let totalEnergyUsage = 0;
    let totalWaterUsage = 0;
    let totalWasteUsage = 0;
    let totalEnergyCost = 0;
    let totalWaterCost = 0;
    let totalWasteCost = 0;
    let totalNaturalGasCost = 0;
    let totalNaturalGasUsage = 0;
    const Usage = selected.meterAssociations;
    const energyUsageData = (Usage as any).electricMeters;
    const waterUsageData = (Usage as any).waterMeters;
    const wasteUsageData = (Usage as any).wasteMeters;
    const natrualGasUsageData = (Usage as any).naturalGasMeters;
    // grap recent bill cycle for energy usage with corresponding cost
    natrualGasUsageData.forEach((meter: {
        details: any;
        name: string; energyConsumption: {
        startDate: any; usage: string | number; cost: string | number; }[]; }) => {
            const sorted = meter.energyConsumption.sort((a, b) => new Date((b as any).startDate).getTime() - new Date((a as any).startDate).getTime());
            const recentDate = sorted[0].startDate;
            for (let i = 0; i < meter.energyConsumption.length; i++) {
                if((meter.energyConsumption[i].startDate as any) === recentDate){
                    let quantity = parseFloat(meter.energyConsumption[i]?.usage as string);
                    let cost = parseFloat(meter.energyConsumption[i]?.cost as string);
                    const newItem: ConsumptionData = {
                        month: "Recent",
                        name: meter.details.name,
                        value: isNaN(cost) ? 0 : cost,
                        type: "Cost",
                        fill: '#CECE00',
                      };
                    highestConsumer_data.push(newItem);
                    totalNaturalGasCost += isNaN(cost) ? 0 : cost;
                    totalNaturalGasUsage += isNaN(quantity) ? 0 : quantity;
                }
        }
    });
    energyUsageData.forEach((meter: {
        details: any;
        name: string; energyConsumption: {
        startDate: any; usage: string | number; cost: string | number; }[]; }) => {
            const sorted = meter.energyConsumption.sort((a, b) => new Date((b as any).startDate).getTime() - new Date((a as any).startDate).getTime());
            const recentDate = sorted[0].startDate;
            for (let i = 0; i < meter.energyConsumption.length; i++) {
                if((meter.energyConsumption[i].startDate as any) === recentDate){
                    let quantity = parseFloat(meter.energyConsumption[i]?.usage as string);
                    let cost = parseFloat(meter.energyConsumption[i]?.cost as string);
                    const newItem: ConsumptionData = {
                        month: "Recent",
                        name: meter.details.name,
                        value: isNaN(cost) ? 0 : cost,
                        type: "Cost",
                        fill: '#8884d8',
                      };
                    highestConsumer_data.push(newItem);
                    totalEnergyCost += isNaN(cost) ? 0 : cost;
                    totalEnergyUsage += isNaN(quantity) ? 0 : quantity;
                }
        }
    });
    // grap recent bill cycle for water usage with corresponding cost
    waterUsageData.forEach((meter: {
        details: any;
        name: string; energyConsumption: {
        startDate: any; usage: string | number; cost: string | number; }[];  }) => {
            const sorted = meter.energyConsumption.sort((a, b) => new Date((b as any).startDate).getTime() - new Date((a as any).startDate).getTime());
            const recentDate = sorted[0].startDate;
            for (let i = 0; i < meter.energyConsumption.length; i++) {
                if((meter.energyConsumption[i].startDate as any) ===  recentDate){
                    let quantity = parseFloat(meter.energyConsumption[i]?.usage as string);
                    let cost = parseFloat(meter.energyConsumption[i]?.cost as string);
                    const newItem: ConsumptionData = {
                        month: "Recent",
                        name: meter.details.name,
                        value: isNaN(cost) ? 0 : cost,
                        type: "Cost",
                        fill: '#82ca9d',
                      };
                    highestConsumer_data.push(newItem);
                    totalWaterCost += isNaN(cost) ? 0 : cost;
                    totalWaterUsage += isNaN(quantity) ? 0 : quantity;
                }
            }
        });
    // grap recent bill cycle for waste usage with corresponding cost
    wasteUsageData.forEach((meter: {
        details: any;
        name: string; energyConsumption: {
        startDate: any; quantity: string; cost: string | number; }[]; }) => {
            const sorted = meter.energyConsumption.sort((a, b) => new Date((b as any).startDate).getTime() - new Date((a as any).startDate).getTime());
            const recentDate = sorted[0].startDate;
            for (let i = 0; i < meter.energyConsumption.length; i++) {
                if((meter.energyConsumption[i].startDate as any) ===  recentDate){
                    let quantity = parseFloat(meter.energyConsumption[i]?.quantity as string);
                    let cost = parseFloat(meter.energyConsumption[i]?.cost as string);
                    const newItem: ConsumptionData = {
                        month: "Recent",
                        name: meter.details.name,
                        value: isNaN(cost) ? 0 : cost,
                        type: "Cost",
                        fill: '#FF8042',
                      };
                    highestConsumer_data.push(newItem);
                    totalWasteCost += isNaN(cost) ? 0 : cost;
                    totalWasteUsage += isNaN(quantity) ? 0 : quantity;
                }
            }
    });
    // Populate consumption data
    consumption_data = [
      { month: 'Recent', name:'Electricity', value: totalEnergyUsage, type: 'Electricity', fill: '#8884d8' },
      { month: 'Recent', name:'Gas', value : totalNaturalGasUsage, type :'Natrual Gas', fill: '#CECE00'},
      { month: 'Recent', name: 'Water', value: totalWaterUsage, type: 'Water', fill: '#82ca9d' },
      { month: 'Recent', name: 'Waste', value: totalWasteUsage, type: 'Waste', fill: '#FF8042' },
    ];
        
    // round cost to 2 decimal number
    totalEnergyCost = Math.round((totalEnergyCost+ Number.EPSILON) * 100) / 100;
    totalWaterCost =  Math.round((totalWaterCost+ Number.EPSILON) * 100) / 100;
    totalWasteCost =  Math.round(( totalWasteCost+ Number.EPSILON) * 100) / 100;
    cost_data = [
        {month: 'Recent',name: 'Electricity', value : totalEnergyCost, type : 'Cost',fill: '#8884d8'},
        {month: 'Recent',name:'Natrual Gas', value : totalNaturalGasCost, type :'Cost', fill: '#CECE00'},
        {month: 'Recent',name:'Water', value : totalWaterCost, type :'Cost', fill: '#82ca9d'},
        {month: 'Recent',name:'Waste',value : totalWasteCost, type : 'Cost', fill: '#FF8042'}
      ];
    highestConsumer_data = highestConsumer_data.sort((a, b) => b.value - a.value);
    highestConsumer_data = highestConsumer_data.slice(0, 5);    
    return {consumption_data,cost_data,highestConsumer_data};
}

interface PropertiesAnalyticsProps {
    properties: PropertyDetails[]
}

export const PropertiesAnalytics: React.FC<PropertiesAnalyticsProps> = ({
    properties
}) => {
    // Properties & Their Details: Will be an array of property details (CHECK context/index.ts)
    const [selected, setSelected] = useState<PropertyDetails | null>(properties ? properties[0] : null);
    let consumption_data: ConsumptionData[] = [];
    let cost_data: ConsumptionData[] = [];
    let highestConsumer_data: ConsumptionData[] = [];

    // default property 
    if(!selected && properties){setSelected(properties[0])}
    // use seleted property
    if(selected){
        const processedData = processSelectedProperty(selected);
        consumption_data = processedData.consumption_data;
        cost_data = processedData.cost_data;
        highestConsumer_data = processedData.highestConsumer_data;
    }
    // Used for Pop-Over components (dropdown selection)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(properties ? properties[0].name : "");   // Stores name

    return (
        <>
            <header className="flex flex-wrap gap-2 justify-between mb-2">
                {/* Name & Address */}
                <div>
                    <h1 className="text-3xl min-[1930px]:text-4xl capitalize">{ value === "" ? "Select property" : value}</h1>
                    <p className="flex items-center gap-1 text-sm">
                        <MapPin className="w-4" />
                        {selected ? `${selected.address.address1}, 
                        ${selected.address.city}, 
                        ${selected.address.state}, 
                        ${selected.address.postalCode}, 
                        ${selected.address.country}` : 'Loading...'}
                    </p>
                </div>
                
                {/* Size, Meters, Occupancy */}
                <div className="flex gap-4 mb-1 text-xs sm:text-base">
                    <p className="flex items-center">
                        <LandPlot className="mr-2 w-5 sm:w-6" />
                        {selected ? `${parseInt(selected.grossFloorArea.value).toLocaleString()} ft` : 'Loading...'}
                        <span className="relative bottom-1 text-xs">2</span>
                    </p>
                    <p className="flex items-center gap-2"><Gauge className="w-5 sm:w-6" /> {selected ? `${selected.linkMeters.length} Meters` : 'Loading...'}</p>
                    <p className="flex items-center gap-2"><Users className="w-5 sm:w-6" /> {selected ? `${selected.occupancyPercentage}% Occupancy` : 'Loading...'}</p>
                </div>

                {/* Command + Date */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[280px] justify-between"
                            >
                                {/* THE INTIAL/DEFAULT VALUE set here, we should change it to use the first possible property */}
                                {value
                                    ? properties?.find((properties) => properties.name.toLowerCase() === value.toLowerCase())?.name
                                    : properties?.[0]?.name ?? "Select properties..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[280px] p-0">
                            <Command>
                                <CommandInput placeholder="Search properties..." className="h-9" />
                                <CommandEmpty>No properties found.</CommandEmpty>

                                <CommandGroup>
                                    {properties?.map((property) => (
                                    <CommandItem
                                        key={property.name}
                                        value={property.name}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue)
                                            setSelected(property)
                                            setOpen(false)
                                        }}
                                    >
                                        {property.name}
                                        <CheckSquare
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === property.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </header>

            <div className="grid grid-cols-6 gap-6 ">
                <Card className='w-full flex flex-col col-span-6 2xl:col-span-4 min-h-[500px]'>
                    <CardHeader>
                        <CardTitle className="">
                            Monthly Usage
                        </CardTitle>
                        <CardDescription>Electricity, Natrual Gas, Water, and Waste</CardDescription>
                    </CardHeader>
                    <CardContent className='flex-grow'>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={consumption_data}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 20,
                                    bottom: 10,
                                }}
                            >
                                <CartesianGrid  opacity={0.15} />
                                <XAxis dataKey="name" stroke="#FFF"/>
                                <YAxis stroke="#FFF"/>
                                <Tooltip content={<CustomTooltip />} contentStyle={{ backgroundColor: "#fff"}} cursor={{fill: '#000', opacity: '20%'}} />
                                <Bar dataKey="value" name="Recent Month Consumption"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <div className="col-span-6 2xl:col-span-2 flex flex-col xl:flex-row 2xl:flex-col gap-6">
                    <Card className='relative w-full flex flex-col h-[116px] xl:h-full'>
                        <CardHeader className="p-0 absolute inset-0 flex justify-center items-center z-[-1] opacity-5">
                            <CardTitle className="text-xl 2xl:text-6xl font-bold">
                                METERS
                            </CardTitle>
                        </CardHeader>

                        <CardContent className='flex justify-between items-center h-full py-4 !px-16 z-[1]'>
                            <div className="text-center">
                                <Zap className="w-12 h-auto text-yellow-500 mb-2" />
                                <p className="text-xl">{selected?.meterAssociations.electricMeters.length}</p>
                            </div>

                            <div className="text-center">
                                <Droplets className="w-12 h-auto text-sky-500 mb-2" />
                                <p className="text-xl">{selected?.meterAssociations.waterMeters.length}</p>
                            </div>

                            <div className="text-center">
                                <Fuel className="w-12 h-auto text-violet-500 mb-2" />
                                <p className="text-xl">{selected?.meterAssociations.naturalGasMeters.length}</p>
                            </div>

                            <div className="text-center">
                                <Trash2 className="w-12 h-auto text-amber-600 mb-2" />
                                <p className="text-xl">{selected?.meterAssociations.wasteMeters.length}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='relative w-full flex flex-col h-[116px] xl:h-full'>
                        <CardHeader className="p-0 absolute inset-0 flex justify-center items-center z-[-1] opacity-5">
                            <CardTitle className="text-xl 2xl:text-6xl font-bold">
                                EXPENSE
                            </CardTitle>
                        </CardHeader>

                        <CardContent className='flex gap-4 justify-center items-center h-full py-4 px-4 2xl:!px-12 z-[1]'>
                            <p className="text-4xl text-red-500">-${(cost_data[0].value + cost_data[1].value + cost_data[2].value).toLocaleString()}</p>
                        </CardContent>
                    </Card>
                    
                    <Card className='relative w-full flex flex-col h-[116px] xl:h-full'>
                        <CardHeader className="p-0 absolute inset-0 flex justify-center items-center z-[-1] opacity-5">
                            <CardTitle className="text-xl 2xl:text-6xl font-bold">
                                FOOTPRINT
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='flex gap-4 justify-center items-center h-full py-4 px-4 2xl:!px-12 z-[1]'>
                            <Footprints className="w-12 h-auto" /> 
                            <p className="text-xl">40,000 CO<span className="text-xs">2</span></p>
                        </CardContent>
                    </Card>
                </div>

                <Card className='w-full flex flex-col col-span-6 xl:col-span-4 min-h-[500px]'>
                    <CardHeader>
                        <CardTitle className="">
                            Highest Consumers
                        </CardTitle>
                        <CardDescription>Find Which Meter Is Consuming The Highest</CardDescription>
                    </CardHeader>
                    <CardContent className='flex-grow'>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                data={highestConsumer_data}
                                layout="vertical"
                                margin={{
                                    top: 10,
                                    right: 55,
                                    left: 15,
                                    bottom: 10,
                                }}
                            >
                                <CartesianGrid opacity={0.15} />
                                <XAxis type="number" opacity={0.75} stroke="#FFF" /> 
                                <YAxis dataKey="name" type="category" width={80} stroke="#FFF" /> 
                                <Tooltip content={<CustomTooltip />} contentStyle={{ backgroundColor: "#000"}} cursor={{fill: '#000', opacity: '20%'}} />
                                <Legend />
                                <Bar dataKey="value" name="Recent Month Highest Cost Meter">
                                    <LabelList dataKey="value" position="right"  /> 
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className='w-full flex flex-col col-span-6 xl:col-span-2 min-h-[500px]'>
                    <CardHeader>
                        <CardTitle className="">
                            Utility Costs
                        </CardTitle>
                        <CardDescription>Total Costs Of All Utilities</CardDescription>
                    </CardHeader>
                    <CardContent className='flex-grow'>
                    <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                data={cost_data}
                                margin={{
                                    top: 10,
                                    right: 5,
                                    left: 15,
                                    bottom: 10,
                                }}
                            >
                                <CartesianGrid opacity={0.15} />
                                <XAxis dataKey="name"  tick={{ fontSize: 10 }} angle={-25} textAnchor="end" interval={0} stroke="#FFF"/>
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} contentStyle={{ backgroundColor: "#000"}} cursor={{fill: '#000', opacity: '20%'}} />
                                <Legend /> 
                                <Bar dataKey="value" name="Recent Month Cost">
                                    <LabelList dataKey="value" position="top" /> 
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}


