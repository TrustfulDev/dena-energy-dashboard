import { PropertyDetails } from "@/lib/propertiesApi";
import { MultiSelect } from "./multiSelect";

interface MeterAnalyticsProps {
    properties: PropertyDetails[]
}

export const MeterAnalytics: React.FC<MeterAnalyticsProps> = ({
    properties
}) => {
    return (
        <>
            <header className="flex gap-2 justify-between mb-1">
                {/* Name & Address */}
                <div>
                    <h1 className="text-3xl min-[1930px]:text-4xl capitalize">Select Meters To View</h1>
                    <p className="flex items-center gap-1 text-sm">
                        Meters Selected: 0
                    </p>
                </div>

                {/* Command + Date */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <MultiSelect />
                </div>
            </header>

            <div className="flex-grow">
                Test
            </div>
        </>
    )
}