"use client"

import { useState, useEffect } from "react"
import xml2js from "xml2js"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
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
    ChevronsUpDown, 
    CheckSquare, 
    Gauge, 
    Users, 
    LandPlot, 
    MapPin 
} from 'lucide-react';

interface SingleLink {
    id: string;
    hint: string;
    // Include other properties that each link object has
}

interface LinkMeters {
    hint: string;
}

interface PropertiesDetails {
    address: {
        address1: string;
        city: string;
        postalCode: string;
        state: string;
        country: string;
    }

    grossFloorArea: {
        value: string;
    }

    occupancyPercentage: {
        value: string;
    }
}
interface MeterAnalyticsProps {
    data: string; // CHANGE AS NEEDED
    //link: SingleLink[];
}

export const MeterAnalytics: React.FC<MeterAnalyticsProps> = ({
    data
}) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [linksData, setLinksData] = useState<SingleLink[]>([]); // State to hold the array of links
    const [linkMeter, setLinkMeter] = useState<LinkMeters[]>([]); 
    const [propertyDetail, setPropertyDetail] = useState<PropertiesDetails | null>(null);
    const [selectedPropertyId, setSelectedPropertyId] = useState("");
    const [date, setDate] = useState<Date>()

    useEffect(() => {
        async function fetchProperties() {
          const response = await fetch('/api/energystar/properties');
          const xml = await response.text();
          const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
    
          parser.parseString(xml, (err: any, result: any) => {
            if (err) {
              console.error('Could not parse XML', err);
            } else {
                setLinksData(result.response.links.link);
            }
          });
        }
    
        fetchProperties().catch(console.error);
        setDate(new Date());
    }, []);

    useEffect(() => {
        async function fetchMeters() {
            if (selectedPropertyId) {
                const response = await fetch(`/api/energystar/meters?id=${selectedPropertyId}`);
                const xml = await response.text();
                const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

                parser.parseString(xml, (err: any, result: any) => {
                    if (err) {
                      console.error('Could not parse XML', err);
                    } else {
                        setLinkMeter(result.response.links.link);
                    }
                });

            }
        }

        async function fetchProperties_detail() {
            if (selectedPropertyId) {
                const response = await fetch(`/api/energystar/properties_detail?id=${selectedPropertyId}`);
                const xml = await response.text();
                const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

                parser.parseString(xml, (err: any, result: any) => {
                    if (err) {
                      console.error('Could not parse XML', err);
                    } else {
                        setPropertyDetail(result.property);
                    }
                });

            }
        }

        if (selectedPropertyId) {
            fetchMeters();
            fetchProperties_detail();
        }
    }, [selectedPropertyId]);

    return (
        <>
            <header className="flex flex-wrap gap-2 justify-between mb-1">
                {/* Name & Address */}
                <div>
                    <h1 className="text-3xl min-[1930px]:text-4xl capitalize">{ value === "" ? "Select property" : value}</h1>
                    <p className="flex items-center gap-1 text-sm">
                        <MapPin className="w-4" />
                        {propertyDetail ? `${propertyDetail.address.address1}, 
                        ${propertyDetail.address.city}, 
                        ${propertyDetail.address.state}, 
                        ${propertyDetail.address.postalCode}, 
                        ${propertyDetail.address.country}` : 'Loading...'}
                    </p>
                </div>

                {/* Size, Meters, Occupancy */}
                <div className="flex gap-4 mb-1">
                    <p className="flex items-center">
                        <LandPlot className="mr-2" />
                        {propertyDetail ? `${parseInt(propertyDetail.grossFloorArea.value).toLocaleString()} ft` : 'Loading...'}
                        <span className="relative bottom-1 text-xs">2</span>
                    </p>
                    <p className="flex items-center gap-2"><Gauge /> {linkMeter.length} Meters</p>
                    <p className="flex items-center gap-2"><Users /> {propertyDetail ? `${propertyDetail.occupancyPercentage}% Occupancy` : 'Loading...'}</p>
                </div>

                {/* Command + Date */}
                <div className="flex items-center gap-4">
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
                                    ? linksData.find((properties) => properties.hint.toLowerCase() === value)?.hint
                                    : "Select properties..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[280px] p-0">
                            <Command>
                                <CommandInput placeholder="Search properties..." className="h-9" />
                                <CommandEmpty>No properties found.</CommandEmpty>

                                <CommandGroup>
                                    {linksData.map((properties) => (
                                    <CommandItem
                                        key={properties.hint}
                                        value={properties.hint}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue)
                                            setSelectedPropertyId(properties.id) // Update the selectedPropertyId state
                                            setOpen(false)
                                        }}
                                    >
                                        {properties.hint}
                                        <CheckSquare
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === properties.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>

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
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </header>

            <div className="flex-grow">
                PUT DATA/GRAPHS/INFORMATION HERE
            </div>
        </>
    )
}