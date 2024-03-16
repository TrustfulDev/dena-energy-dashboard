import { PropertyDetails, fetchAllPropertyDetails } from "./propertiesApi";

export async function fetchData() {
    let data: PropertyDetails[] | null;
    try {
        data = await fetchAllPropertyDetails();
    } catch(err) {
        data = null;
    }
    
    return data;
}