"use client"

// React & Packages
import { useState } from "react"
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react"
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
import { Calendar } from "@/components/ui/calendar"
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
import {  Cell, PieChart, Rectangle, Pie, Sector, LineChart, Line, BarChart, Bar,XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// utility consumption bar chart 
const consumption_data = [
    {month: 'Jan',name: 'Electricity', value : 4000, type : 'Electricity',fill: '#8884d8'},
    {month: 'Jan',name:'Water', value : 2400, type :'Water', fill: '#82ca9d'},
    {month: 'Jan',name:'Waste',value : 2400, type : 'Waste', fill: '#FF8042'}
  ];
  const cost_data = [
    {month: 'Jan',name: 'Electricity', value : 400, type : 'Cost',fill: '#8884d8'},
    {month: 'Jan',name:'Water', value : 240, type :'Cost', fill: '#82ca9d'},
    {month: 'Jan',name:'Waste',value : 240, type : 'Cost', fill: '#FF8042'}
  ];
  const highestConsumer_data = [
    {month: 'Jan',name: 'Electricity', value : 400, type : 'Electricity',fill: '#8884d8'},
    {month: 'Jan',name:'Water', value : 220, type :'Water', fill: '#82ca9d'},
    {month: 'Jan',name:'Waste',value : 240, type : 'Waste', fill: '#FF8042'},
    {month: 'Jan',name:'Gas',value : 280, type : 'Gas', fill: '#FF8042'}
  ];
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const { name, value, type } = payload[0].payload;
      const unit = type === 'Electricity' ? ' kWh' : type === 'Waste' ? ' pounds' : type === 'Water' ? ' gallons' : type === 'Gas' ? 'therm' : type === 'Cost' ? ' $' : '';
      return (
        <div className="custom-tooltip">
          <p>{`${name}: ${value} ${unit}`}</p>
        </div>
      );
    }
  
    return null;
  };

// Interfaces
import { useDataContext } from "@/context";
import { PropertyDetails } from "@/lib/propertiesApi";

export const PropertiesAnalytics = ({}) => {
    // Properties & Their Details: Will be an array of property details (CHECK context/index.ts)
    const { properties } = useDataContext();
    const [selected, setSelected] = useState<PropertyDetails | null>(properties ? properties[0] : null);

    // Used for Pop-Over components (dropdown selection)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(properties ? properties[0].name : "");   // Stores name
    const [date, setDate] = useState<Date>(); // Stores date

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
                <div className="flex gap-4 mb-1 sm:text-base text-sm">
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
                                    : "Select properties..."}
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

                    {/* Date Popover */}
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

            <div className="grid grid-cols-6 gap-6 h-full">
                <Card className='w-full flex flex-col col-span-4 min-h-[500px]'>
                    <CardHeader>
                        <CardTitle className="">
                            Monthly Usage
                        </CardTitle>

                        <CardDescription>Electricity, Water, and Waste</CardDescription>
                    </CardHeader>

                    <CardContent className='flex-grow'>
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={consumption_data}
                            margin={{
                                top: 10,
                                right: 10,
                                left: -15,
                                bottom: 10,
                            }}
                            >
                            <CartesianGrid opacity={0.15} />
                            <XAxis dataKey="name" />
                            <YAxis />

                            <Tooltip content={<CustomTooltip />} contentStyle={{ backgroundColor: "#000"}} />
                            <Legend />
                            <Bar dataKey="value" name="Monthly Consumption"/>
                            
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <div className="col-span-2 flex flex-col gap-6">
                    <Card className='w-full flex flex-col h-full'>
                        <CardHeader>
                            <CardTitle className="">
                                
                            </CardTitle>
                        </CardHeader>

                        <CardContent className='flex-grow'>
                            
                        </CardContent>
                    </Card>

                    <Card className='w-full flex flex-col h-full'>
                        <CardHeader>
                            <CardTitle className="">
                                
                            </CardTitle>
                        </CardHeader>

                        <CardContent className='flex-grow'>
                            
                            
                        </CardContent>
                    </Card>
                    
                    <Card className='w-full flex flex-col h-full'>
                        <CardHeader>
                            <CardTitle className="">
                                Carbon Footprint
                            </CardTitle>
                        </CardHeader>

                        <CardContent className='flex-grow' style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#8884d8' }} >
                         Total 4000 Co2
                        </CardContent>
                    </Card>
                </div>

                <Card className='w-full flex flex-col col-span-3 min-h-[500px]'>
                    <CardHeader>
                        <CardTitle className="">
                            Utility Costs
                        </CardTitle>

                        <CardDescription>Total Costs Of All Utilities</CardDescription>
                    </CardHeader>

                    <CardContent className='flex-grow'>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={cost_data}
                            margin={{
                                top: 10,
                                right: 10,
                                left: -15,
                                bottom: 10,
                            }}
                            >
                            <CartesianGrid opacity={0.15} />
                            <XAxis dataKey="name" />
                            <YAxis />

                            <Tooltip content={<CustomTooltip />} contentStyle={{ backgroundColor: "#000"}} />
                            <Legend />
                            <Bar dataKey="value" name="Monthly Cost"/>
                            
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className='w-full flex flex-col col-span-3 min-h-[500px]'>
                    <CardHeader>
                        <CardTitle className="">
                            Highest Consumers
                        </CardTitle>

                        <CardDescription>Find Which Meter Is Consuming The Highest</CardDescription>
                    </CardHeader>

                    <CardContent className='flex-grow'>
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={highestConsumer_data}
                            margin={{
                                top: 10,
                                right: 10,
                                left: -15,
                                bottom: 10,
                            }}
                            >
                            <CartesianGrid opacity={0.15} />
                            <XAxis dataKey="name" />
                            <YAxis />

                            <Tooltip content={<CustomTooltip />} contentStyle={{ backgroundColor: "#000"}} />
                            <Legend />
                            <Bar dataKey="value" name="Highest Consumption"/>         
                            </BarChart>
                        </ResponsiveContainer>
                    
                    </CardContent>
                </Card>
            </div>
        </>
    )
}