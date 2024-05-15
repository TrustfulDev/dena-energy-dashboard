"use client"
import { useEffect, useState } from 'react';
import { AreaCharts} from "@/components/analytics/HeatMap";

async function getData() {
    // AccuEnergy meter set to 1 minute log intervals
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/accuenergy/testing`, { 
        next: { revalidate: 60, tags: ["accuenergy"] },
        method: "GET"
    });

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    const data = await res.json();
    return data;
}

interface CategorizedReadings {
    powerFactors: Reading[];
    importActiveEnergy: Reading[];
    activePowerDemand: Reading[];
    currentDemand: Reading[];
    voltageUnbalanceFactor: Reading[];
}

interface Reading {
    param: string;
    value: string[];
    timestamp: string;
}

interface DeviceData {
    device_name: string;
    device_model: string;
    timestamp: string[];
    online: boolean;
    readings: CategorizedReadings;
}

export interface Container {
    test: DeviceData;
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
function processAndStoreData(incomingData: any): Container | null {
    if (!incomingData || typeof incomingData.test !== 'string') {
        console.error('No valid data received or "test" is not a proper JSON string:', incomingData);
        return null;
    }
    // Parse the JSON string
    let parsedTest;
    try {
        parsedTest = JSON.parse(incomingData.test);
    } catch (error) {
        console.error('Error parsing JSON from "test" key:', error);
        return null;
    }
    // Initialize categorized readings and starting timestamp
    const categorizedReadings: CategorizedReadings = {
        powerFactors: [],
        importActiveEnergy: [],
        activePowerDemand: [],
        currentDemand: [],
        voltageUnbalanceFactor: []
    };

    const initialTimestamp = parseInt(parsedTest.timestamp[0]);
    let currentTimestamp = initialTimestamp;

    parsedTest.readings.forEach((reading: any) => {
        const date = new Date(currentTimestamp * 1000);
        const formattedDate = date.toISOString(); 
        reading.timestamp = formatDate(formattedDate);
        currentTimestamp++;

        if (reading.param.startsWith('PF')) {
            categorizedReadings.powerFactors.push(reading);
        } else if (reading.param.startsWith('EP')) {
            categorizedReadings.importActiveEnergy.push(reading);
        } else if (reading.param.startsWith('DMD_P')) {
            categorizedReadings.activePowerDemand.push(reading);
        } else if (reading.param.startsWith('DMD_I')) {
            categorizedReadings.currentDemand.push(reading);
        } else if (reading.param === 'Unbl_V') {
            categorizedReadings.voltageUnbalanceFactor.push(reading);
        }
    });

    const container: Container = {
        test: {
            device_name: parsedTest.device_name,
            device_model: parsedTest.device_model,
            timestamp: parsedTest.timestamp,
            online: parsedTest.online,
            readings: categorizedReadings
        }
    };
    return container;
}


export function Test() {

    const [allActiveEnergy, setAllActiveEnergy] = useState<Reading[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const jsonData = await getData();
                const processedData = processAndStoreData(jsonData);
                if (processedData && processedData.test.readings.importActiveEnergy) {
                    setAllActiveEnergy(currentEnergy => [
                        ...currentEnergy,
                        ...processedData.test.readings.importActiveEnergy
                    ]);
                }
            } catch (error) {
                console.error('Error fetching or processing data:', error);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 60000); // Fetch data every minute
        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    return (
        <div>
            <h1 className="text-4xl font-bold">TESTING ACCUENERGY</h1>
            {allActiveEnergy.length > 0 && (
                <AreaCharts importActiveEnergy={allActiveEnergy} />
            )}
        </div>
    );
}