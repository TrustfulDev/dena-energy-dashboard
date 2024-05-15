import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeterAnalytics } from "@/components/analytics/MeterAnalytics";
import { PropertiesAnalytics } from "@/components/analytics/PropertiesAnalytics";
import { AreaCharts } from "@/components/analytics/HeatMap";
import { RangeArea } from "@/components/analytics/RangeArea";
import { fetchData } from "@/lib/fetchAccounts";
import NoAccount from "@/components/noAccount";
import { currentUser } from "@clerk/nextjs";
import {  Test } from "@/app/test/page";

export default async function Analytics() {
    const currUser = await currentUser();
    const data = await fetchData({ id: currUser?.id });

    return (
        <div className="flex flex-grow h-full mb-6 md:overflow-y-auto">
            { data ?
                <Tabs defaultValue="property" className="flex flex-col w-full">
                    <TabsList className="w-full grid grid-cols-4">
                        <TabsTrigger value="property" className="">Properties</TabsTrigger>
                        <TabsTrigger value="meter" className="">Meters</TabsTrigger>
                        <TabsTrigger value="heatmap" className="">AreaChart</TabsTrigger>
                        <TabsTrigger value="rangearea" className="">RangeArea</TabsTrigger>
                    </TabsList>

                    <TabsContent 
                        value="property" 
                        className="data-[state=active]:h-full data-[state=active]:flex data-[state=active]:flex-col data-[state=active]:px-4"
                    >
                        <PropertiesAnalytics properties={data} />
                    </TabsContent>

                    <TabsContent 
                        value="meter" 
                        className="data-[state=active]:h-full data-[state=active]:flex data-[state=active]:flex-col data-[state=active]:px-4"
                    >
                        <MeterAnalytics properties={data} />
                    </TabsContent>

                    <TabsContent 
                        value="heatmap" 
                        className="data-[state=active]:h-full data-[state=active]:flex data-[state=active]:flex-col data-[state=active]:px-4"
                    >
                        <Test />
                    </TabsContent>

                    <TabsContent 
                        value="rangearea" 
                        className="data-[state=active]:h-full data-[state=active]:flex data-[state=active]:flex-col data-[state=active]:px-4"
                    >
                        <RangeArea> </RangeArea>
                    </TabsContent>
                </Tabs>
                :
                <NoAccount />
            }
        </div>
    )
}