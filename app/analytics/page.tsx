import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeterAnalytics } from "@/components/analytics/MeterAnalytics";
import { CarbonFootprint } from "@/components/analytics/CarbonFootprint";
import { PropertiesAnalytics } from "@/components/analytics/PropertiesAnalytics";

import { PropertyDetails, fetchAllPropertyDetails } from "@/lib/propertiesApi";

export default async function Analytics() {
    const data: PropertyDetails[] = await fetchAllPropertyDetails();

    return (
        <div className="flex h-full mb-6 md:overflow-y-auto">
            <Tabs defaultValue="property" className="flex flex-col w-full">
                <TabsList className="w-full grid grid-cols-5">
                    <TabsTrigger value="property" className="">Properties</TabsTrigger>
                    <TabsTrigger value="meter" className="">Meters</TabsTrigger>
                    <TabsTrigger value="carbon">Carbon Footprint</TabsTrigger>
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                    <TabsTrigger value="energystar">Energy Star Score</TabsTrigger>
                </TabsList>

                <TabsContent 
                    value="property" 
                    className="data-[state=active]:h-full data-[state=active]:flex data-[state=active]:flex-col data-[state=active]: px-4"
                >
                    <PropertiesAnalytics properties={data} />
                </TabsContent>

                <TabsContent 
                    value="meter" 
                    className="data-[state=active]:h-full data-[state=active]:flex data-[state=active]:flex-col data-[state=active]: px-4"
                >
                    <MeterAnalytics properties={data} />
                </TabsContent>

                <TabsContent 
                    value="carbon" 
                    className="data-[state=active]:h-full data-[state=active]:flex data-[state=active]:flex-col"
                >
                    <CarbonFootprint />
                </TabsContent>

                <TabsContent 
                    value="expenses" 
                    className="data-[state=active]:h-full data-[state=active]:flex data-[state=active]:flex-col"
                >
                    Get expenses/costs on selected meters/buildigs. (Need to create a page for this. Ask Steven for help if needed.)
                </TabsContent>

                <TabsContent 
                    value="energystar" 
                    className="data-[state=active]:h-full data-[state=active]:flex data-[state=active]:flex-col"
                >
                    Get an Energy Star Score for your energy consumption. (Need to create a page for this. Ask Steven for help if needed.)
                </TabsContent>
            </Tabs>
        </div>
    )
}
  