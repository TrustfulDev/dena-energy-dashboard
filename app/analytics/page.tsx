import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeterAnalytics } from "@/components/analytics/MeterAnalytics";
import { CarbonFootprint } from "@/components/analytics/CarbonFootprint";
import { PropertiesAnalytics } from "@/components/analytics/PropertiesAnalytics";

import { fetchData } from "@/lib/fetchAccounts";
import NoAccount from "@/components/noAccount";

export default async function Analytics() {
    const data = await fetchData();

    return (
        <div className="flex flex-grow h-full mb-6 md:overflow-y-auto">
            { data ?
                <Tabs defaultValue="property" className="flex flex-col w-full">
                    <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="property" className="">Properties</TabsTrigger>
                        <TabsTrigger value="meter" className="">Meters</TabsTrigger>
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
                </Tabs>
                :
                <NoAccount />
            }
        </div>
    )
}
  