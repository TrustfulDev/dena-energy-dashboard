"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { PropertyDetails, fetchAllPropertyDetails } from "@/lib/propertiesApi";

// Combine all data
interface Data {
    properties: PropertyDetails[] | null,
}

// Create the Context and pass in default values
const DataContext = createContext<Data>({
    properties: null,
    
});

export function ContextWrapper({ children } : {
    children: React.ReactNode;
}) {
    // Data (MUST MATCH type Data)
    const [properties, setProperties] = useState<PropertyDetails[] | null>(null);

    // Fetching
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const propertyData = await fetchAllPropertyDetails();
                setProperties(propertyData);  
            } catch (err) {
                console.error("Failed to fetch property details: ", err)
            }
        }

        fetchProperties();
    }, [])

    console.log("check here: ", properties);

    // Pass the data into the context
    return (
        <DataContext.Provider value={{ properties }}>
            {children}
        </DataContext.Provider>
    )
}

export function useDataContext() {
    return useContext(DataContext);
}