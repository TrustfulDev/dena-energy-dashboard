"use client";
import { PropertyDetails } from "@/lib/propertiesApi";
import { MultiSelect } from "./multiSelect";
import { MeterCard } from "./MeterCard";
import { useState } from "react";

interface MeterAnalyticsProps {
    properties: PropertyDetails[],  
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
function processMeterCard(properties: PropertyDetails[],checked: string[]): Meter[]{
    const checkedMetersInfo: Meter[] = [];
    properties.forEach(property => {
        Object.values(property.meterAssociations).forEach(category => {
            category.forEach((meter: any) => {
                if (checked.includes(meter.meterId)&& !checkedMetersInfo.some(m => m.meterId === meter.meterId)) {
                    checkedMetersInfo.push(meter);
                }
            });
        });
    });
 
  return checkedMetersInfo;
}
export const MeterAnalytics: React.FC<MeterAnalyticsProps> = ({
    properties
}) => {
    const [checked, setChecked] = useState<string[]>([]);
    const checkedMetersInfo: Meter[] =  processMeterCard(properties,checked);
    

    return (
        <>
            <header className="flex gap-2 justify-between mb-2">
                <div>
                    <h1 className="text-3xl min-[1930px]:text-4xl capitalize">Select Meters To View</h1>
                    <p className="flex items-center gap-1 text-sm">
                        Meters Selected: {checked.length}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <MultiSelect properties={properties} checked={checked} setChecked={setChecked}/>
                </div>
            </header>

            <div className="flex-grow grid grid-cols-4 xl:gap-6 gap-2">
                {checkedMetersInfo.map((info, index) => (
                    <MeterCard key={index} properties={properties} meter={info}/>
                ))}
            </div>    
        </>
    )
}