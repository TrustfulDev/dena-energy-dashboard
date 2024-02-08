import xml2js from 'xml2js';

interface Property {
    id: string;
    hint: string;
}

export interface PropertyDetails {
    id: string;

    address: {
        address1: string;
        city: string;
        postalCode: string;
        state: string;
        country: string;
    };

    grossFloorArea: {
        value: string;
    };

    occupancyPercentage: {
        value: string;
    };

    linkMeters: Property[]; // Changed linkMeters to use Property interface directly
}

async function fetchProperties(): Promise<Property[]> {
    const response = await fetch('/api/energystar/properties');
    const xml = await response.text();
    const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

    return new Promise((resolve, reject) => {
        parser.parseString(xml, (err: any, result: any) => {
            if (err) {
                console.error('Could not parse XML', err);
                reject(err);
            } else {
                const properties: Property[] = result.response.links.link;
                resolve(properties);
            }
        });
    });
}

async function fetchPropertyDetails(propertyId: string): Promise<PropertyDetails> {
    const metersPromise = fetch(`/api/energystar/meters?id=${propertyId}`).then(res => res.text());
    const detailsPromise = fetch(`/api/energystar/properties_detail?id=${propertyId}`).then(res => res.text());
    
    const [metersXml, detailsXml] = await Promise.all([metersPromise, detailsPromise]);

    const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

    let meters: Property[] = [];
    parser.parseString(metersXml, (err: any, metersResult: any) => {
        if (err) throw new Error('Failed to parse meters XML');
        meters = metersResult.response.links.link;
    });

    let propertyDetails: PropertyDetails = {
        id: '',
        address: {
            address1: '',
            city: '',
            postalCode: '',
            state: '',
            country: ''
        },
        grossFloorArea: {
            value: ''
        },
        occupancyPercentage: {
            value: ''
        },
        linkMeters: []
    };
    
    parser.parseString(detailsXml, (err: any, detailsResult: any) => {
        if (err) throw new Error('Failed to parse property details XML');
        propertyDetails = {...detailsResult.property, id: propertyId}; 
    });

    return {...propertyDetails, linkMeters: meters};
}

export async function fetchAllPropertyDetails(): Promise<PropertyDetails[]> {
    const properties = await fetchProperties();
    const propertyDetailsPromises = properties.map(property => fetchPropertyDetails(property.id));
    return await Promise.all(propertyDetailsPromises);
}