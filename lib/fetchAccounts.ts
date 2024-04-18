import { PropertyDetails, fetchAllPropertyDetails } from "./propertiesApi";

export async function fetchData({
    id
}: {
    id: string | undefined
}) {
    let data: PropertyDetails[] | null;
    try {
        data = await fetchAllPropertyDetails({ id });
    } catch(err) {
        data = null;
    }
    
    return data;
}