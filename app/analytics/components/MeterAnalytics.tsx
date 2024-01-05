"use client"

import { useState, useEffect } from "react"
import xml2js from "xml2js"
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

import { ChevronsUpDown , CheckSquare, Gauge, Users, LandPlot, MapPin } from 'lucide-react';

/* READ THIS 
* Replace all "frameworks" with property ID
* The rest of the code is based on this dummy data below (frameworks)
* Suggestion: Ctrl + F and search for "framework"
*/
const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]
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
    //const [propertyData, setPropertyData] = useState<MeterAnalyticsProps | null>(null);
    const [linksData, setLinksData] = useState<SingleLink[]>([]); // State to hold the array of links
    const [linkMeter, setLinkMeter] = useState<LinkMeters[]>([]); 
    const [propertyDetail, setPropertyDetail] = useState<PropertiesDetails | null>(null);

    const [selectedPropertyId, setSelectedPropertyId] = useState("");

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
      }, []);
    
    //console.log("checking ", linksData[0].id);

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

        if (selectedPropertyId) {
            fetchMeters();
        }

    }, [selectedPropertyId]);

    useEffect(() => {
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
            fetchProperties_detail();
        }

    }, [selectedPropertyId]);

    //console.log("checked it: ", linkMeter.length);

    return (
        <>
            <header className="flex items-center gap-8 mb-1">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[400px] justify-between"
                        >
                            {/* THE INTIAL/DEFAULT VALUE set here, we should change it to use the first possible property */}
                            {value
                                ? linksData.find((properties) => properties.id === value)?.hint
                                : "Select properties..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-[400px] p-0">
                        <Command>
                            <CommandInput placeholder="Search properties..." className="h-9" />
                            <CommandEmpty>No framework found.</CommandEmpty>

                            <CommandGroup>
                                {linksData.map((properties) => (
                                <CommandItem
                                    key={properties.id}
                                    value={properties.id}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
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

                {/* REPLACE BELOW WITH ACTUAL DATA */}
                <h1 className="text-3xl capitalize">{ value === "" ? "Select properties" : value}</h1>
                <p className="flex items-center gap-2"><Gauge /> {linkMeter.length} Meters</p>
                <p className="flex items-center gap-2"><Users /> {propertyDetail ? `${propertyDetail.occupancyPercentage}% Occupancy` : 'Loading...'}</p>
                <p className="flex items-center"><LandPlot className="mr-2" />{propertyDetail ? `${propertyDetail.grossFloorArea.value} ft` : 'Loading...'}<span className="relative bottom-1 text-xs">2</span></p>
                <p className="flex items-center gap-2">
                    <MapPin />
                    {propertyDetail ? `${propertyDetail.address.address1}, 
                    ${propertyDetail.address.city}, 
                    ${propertyDetail.address.state}, 
                    ${propertyDetail.address.postalCode}, 
                    ${propertyDetail.address.country}` : 'Loading...'}
                </p>
            </header>

            <div className="flex-grow">
                PUT DATA/GRAPHS/INFORMATION HERE
            </div>
        </>
    )
}