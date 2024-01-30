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
import { link } from "fs"

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

interface MeterPropertyDatasId {
    meters: {
        meterId: string[];
    }

}
interface MeterInfoData {
    id: string;
    type: string;
    name: string;
    metered: string;
    unitOfMeasure: string;
    firstBillDate: string;
    inUse: string;
    accessLevel: string;
    audit: {
      createdBy: string;
      createdByAccountId: string;
      createdDate: string;
      lastUpdatedBy: string;
      lastUpdatedByAccountId: string;
      lastUpdatedDate: string;
    };
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
    const [energyDataId, setEnergyDataId] = useState<MeterPropertyDatasId | null>(null);
    const [waterDataId, setWaterDataId] = useState<MeterPropertyDatasId | null>(null);
    const [wasteDataId, setWasteDataId] = useState<MeterPropertyDatasId | null>(null);

    const [energyInfoData, setEnergyInfoData] = useState<MeterInfoData[] | null>(null);
    const [waterInfoData, setWaterInfoData] = useState<MeterInfoData[] | null>(null);
    const [wasteInfoData, setWasteInfoData] = useState<MeterInfoData[] | null>(null);

    //get properties ID 
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

    //total meters and properties details
    useEffect(() => {
        async function fetchMeters_Pdetails() {
            if (!selectedPropertyId) {
                return;
            }
            
            const metersPromise = fetch(`/api/energystar/meters?id=${selectedPropertyId}`).then(res => res.text());
            const detailsPromise = fetch(`/api/energystar/properties_detail?id=${selectedPropertyId}`).then(res => res.text());
    
            try {
                const [metersXml, detailsXml] = await Promise.all([metersPromise, detailsPromise]);
                const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
    
                parser.parseString(metersXml, (err: any, metersResult: any) => {
                    if (err) throw new Error('Failed to parse meters XML');
                    setLinkMeter(metersResult.response.links.link);
                });
    
                parser.parseString(detailsXml, (err: any, detailsResult: any) => {
                    if (err) throw new Error('Failed to parse properties details XML');
                    setPropertyDetail(detailsResult.property);
                });
    
            } catch (error) {
                console.error('An error occurred while fetching data:', error);
            }
        }
    
        fetchMeters_Pdetails();
    }, [selectedPropertyId]);

    //(energy data ID),, (water data ID),, (waste and materials data ID)
    useEffect(() => {
        async function fetchMetersId() {
            if (selectedPropertyId) {
                const response = await fetch(`/api/energystar/meters/property_meters_ids?id=${selectedPropertyId}`);
                const xml = await response.text();
                const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

                parser.parseString(xml, (err: any, result: any) => {
                    if (err) {
                      console.error('Could not parse XML', err);
                    } else {
                        setEnergyDataId(result.meterPropertyAssociationList.energyMeterAssociation);
                        setWaterDataId(result.meterPropertyAssociationList.waterMeterAssociation);
                        setWasteDataId(result.meterPropertyAssociationList.wasteMeterAssociation);
                    }
                });

            }
        }
        fetchMetersId();
    }, [selectedPropertyId]);

    
    //all meters info 
    useEffect(() => {
        async function fetchMeterData(meterId: any, meterName: any) {
            try {
                const response = await fetch(`/api/energystar/meters/${meterName}?id=${encodeURIComponent(meterId)}`);
                const xml = await response.text();
                const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
                const result = await new Promise<MeterInfoData>((resolve, reject) => {
                    parser.parseString(xml, (err: any, result: any) => {
                        if (err) {
                            console.error('Could not parse XML for meter ID:', meterId, err);
                            reject(err);
                        } else {
                            resolve(result.meter); // Assume result.meter matches MeterInfoData
                        }
                    });
                });
                return result;
            } catch (error) {
                console.error('Failed to fetch meter data for meter ID:', meterId, error);
                return null;
            }
        }
    
        async function processAllMeters() {
            if (!selectedPropertyId) {
                return; //return if no meter id
            }
    
            // const energyIds = energyDataId.meters.meterId;
            // const waterIds = waterDataId.meters.meterId;
            // const wasteIds = wasteDataId.meters.meterId;
            const energyIds = typeof energyDataId?.meters.meterId === 'string' ? [energyDataId.meters.meterId] : energyDataId?.meters?.meterId || [];
            const waterIds = typeof waterDataId?.meters.meterId === 'string' ? [waterDataId.meters.meterId] : waterDataId?.meters?.meterId || [];
            const wasteIds = typeof wasteDataId?.meters.meterId === 'string' ? [wasteDataId.meters.meterId] : wasteDataId?.meters?.meterId || [];

            console.log("check my id: waste" , wasteIds);
            
            var combinedMeterData1: MeterInfoData[] = [];
            var combinedMeterData2: MeterInfoData[] = [];
            var combinedMeterData3: MeterInfoData[] = [];

            //energy
            for (const meterId of energyIds) {
                const meterData = await fetchMeterData(meterId, "energy");
                if (meterData) {
                    combinedMeterData1.push(meterData);
                }
            }
            setEnergyInfoData(combinedMeterData1);

            //water
            for (const meterId2 of waterIds) {
                const meterData2 = await fetchMeterData(meterId2, "water");
                if (meterData2) {
                    combinedMeterData2.push(meterData2);
                }
            }
            setWaterInfoData(combinedMeterData2);

            //waste
            for (const meterId3 of wasteIds) {
                const meterData3 = await fetchMeterData(meterId3, "waste_materials");
                if (meterData3) {
                    combinedMeterData3.push(meterData3);
                }
            }


            setWasteInfoData(combinedMeterData3);

        }
    
        processAllMeters();
    }, [selectedPropertyId, energyDataId?.meters.meterId, waterDataId?.meters.meterId, wasteDataId?.meters.meterId]);

    
    console.log("Energy Info: ", energyInfoData);
    console.log("Water Info: ", waterInfoData);
    console.log("Waste Info: ", wasteInfoData);

    // console.log("energy id: ", energyDataId?.meters.meterId);
    // console.log("water id: ", waterDataId?.meters.meterId);
    // console.log("waste id: ", wasteDataId?.meters.meterId);

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
                    <p className="flex items-center gap-2"><Gauge className="w-5 sm:w-6" /> {linkMeter.length} Meters</p>
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