import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeterAnalytics } from "./components/MeterAnalytics";
import { CarbonFootprint } from "./components/CarbonFootprint";
import { ScrollArea, ScrollBar  } from "@/components/ui/scroll-area"

export default function Analytics() {
    return (
        <div className="flex h-full mb-6 md:overflow-y-auto">
            <Tabs defaultValue="meter" className="flex flex-col w-full">
                <TabsList className="w-full grid grid-cols-4">
                    <TabsTrigger value="meter" className="">Meter Analytics</TabsTrigger>
                    <TabsTrigger value="carbon">Carbon Footprint</TabsTrigger>
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                    <TabsTrigger value="energystar">Energy Star Score</TabsTrigger>
                </TabsList>

                <TabsContent 
                    value="meter" 
                    className="data-[state=active]:h-full data-[state=active]:flex data-[state=active]:flex-col data-[state=active]: px-4"
                >
                    <MeterAnalytics data="TEMPORARY VALUE. Need to adjust code for this page to take in the proper data."/>
                </TabsContent>

                <TabsContent 
                    value="carbon" 
                    className="data-[state=active]:h-full data-[state=active]:flex data-[state=active]:flex-col"
                >
                    <CarbonFootprint data1="TEMPORARY VALUE. Need to adjust code for this page to take in the proper data."/>
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
  