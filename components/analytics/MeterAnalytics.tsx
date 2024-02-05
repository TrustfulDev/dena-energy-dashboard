"use client"

// React & Packages
import { useState, useEffect } from "react"
import { format } from "date-fns";
import xml2js from "xml2js"
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
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
  
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MultiSelect } from "./multiSelect";

// Interfaces
interface PropertyListProps {
    id: string;
    hint: string; // name - energy star calls it hint
}

interface PropertiesDetails {
    address: {
        address1: string;
        city: string;
        postalCode: string;
        state: string;
        country: string;
    };

    grossFloorArea: {
        value: string;
    };

    occupancyPercentage: {
        value: string;
    };

    linkMeters: {
        id: string,
        hint: string; // name - energy star calls it hint
    }[];
}

export const MeterAnalytics = ({}) => {
    // Used for Pop-Over components (dropdown selection)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");                             // Stores name
    const [selectedPropertyId, setSelectedPropertyId] = useState("");   // Stores ID
    const [date, setDate] = useState<Date>();                           // Stores date

    // Properties & Their Details
    const [propertyList, setpropertyList] = useState<PropertyListProps[]>([]);
    const [propertyDetail, setPropertyDetail] = useState<PropertiesDetails | null>(null);

    // GET a list of all properties & Initialize Date
    useEffect(() => {
        async function fetchProperties() {
          const response = await fetch('/api/energystar/properties');
          const xml = await response.text();
          const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
    
          parser.parseString(xml, (err: any, result: any) => {
            if (err) {
                console.error('Could not parse XML', err);
            } else {
                setpropertyList(result.response.links.link);
            }
          });
        }
    
        fetchProperties().catch(console.error);
        setDate(new Date()); // Set current date as initial value
    }, []);

    // GET all the details of the selected property 
    useEffect(() => {
        
        async function fetchMeters_Pdetails() {
            // Check to make sure a property is selected
            if (!selectedPropertyId) {
                return;
            }
            
            // API URIs for METERS and DETAILS
            const metersPromise = fetch(`/api/energystar/meters?id=${selectedPropertyId}`).then(res => res.text());
            const detailsPromise = fetch(`/api/energystar/properties_detail?id=${selectedPropertyId}`).then(res => res.text());
    
            try {
                const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

                // Fetch Meter Data
                const [metersXml, detailsXml] = await Promise.all([metersPromise, detailsPromise]);
                let meters: { id: string, hint: string }[];
                parser.parseString(metersXml, (err: any, metersResult: any) => {
                    if (err) throw new Error('Failed to parse meters XML');
                    meters = metersResult.response.links.link;
                    console.log(meters);
                });

                // Fetch Property Details
                parser.parseString(detailsXml, (err: any, detailsResult: any) => {
                    if (err) throw new Error('Failed to parse properties details XML');
                    setPropertyDetail({...detailsResult.property, linkMeters: meters}); // Sets both the details & meter data
                });
    
            } catch (error) {
                console.error('An error occurred while fetching data:', error);
            }
        }
        
        fetchMeters_Pdetails();
    }, [selectedPropertyId]);

    // GET meter data
    // useEffect(() => {
    //     async function fetchMeters() {
    //         // Check to make sure there are details
    //         if (!propertyDetail) {
    //             return;
    //         }

    //         try {
    //             const response = fetch(`/api/energystar/meters/meter?id=${propertyDetail?.linkMeters[0].id}`).then(res => res.text());
    //             const xml = await response;
    //             const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
                
    //             parser.parseString(xml, (err: any, result: any) => {
    //                 if (err) {
    //                     console.error('Could not parse XML', err);
    //                 } else {
    //                     console.log(result);
    //                 }
    //             })

    //         } catch (error) {
    //             console.error('An error occurred while fetching data:', error);
    //         }
    //     }

    //     fetchMeters();
    // }, [propertyDetail])

    useEffect(() => {
        async function fetchMeters() {
            // Check to make sure there are details
            if (!propertyDetail) {
                return;
            }

            try {
                const response = fetch(`/api/energystar/meters/consumption?id=${propertyDetail?.linkMeters[1].id}`).then(res => res.text());
                const xml = await response;
                console.log(xml);
                const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
                
                parser.parseString(xml, (err: any, result: any) => {
                    if (err) {
                        console.error('Could not parse XML', err);
                    } else {
                        console.log(result);
                    }
                })

            } catch (error) {
                console.error('An error occurred while fetching data:', error);
            }
        }

        fetchMeters();
    }, [propertyDetail])

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
                <div className="flex gap-4 mb-1 sm:text-base text-sm">
                    <p className="flex items-center">
                        <LandPlot className="mr-2 w-5 sm:w-6" />
                        {propertyDetail ? `${parseInt(propertyDetail.grossFloorArea.value).toLocaleString()} ft` : 'Loading...'}
                        <span className="relative bottom-1 text-xs">2</span>
                    </p>
                    <p className="flex items-center gap-2"><Gauge className="w-5 sm:w-6" /> {propertyDetail ? propertyDetail.linkMeters.length : 'Loading...'} Meters</p>
                    <p className="flex items-center gap-2"><Users className="w-5 sm:w-6" /> {propertyDetail ? `${propertyDetail.occupancyPercentage}% Occupancy` : 'Loading...'}</p>
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
                                    ? propertyList.find((properties) => properties.hint.toLowerCase() === value)?.hint
                                    : "Select properties..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[280px] p-0">
                            <Command>
                                <CommandInput placeholder="Search properties..." className="h-9" />
                                <CommandEmpty>No properties found.</CommandEmpty>

                                <CommandGroup>
                                    {propertyList.map((properties) => (
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
                <MultiSelect />
            </div>
        </>
    )
}