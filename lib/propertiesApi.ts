'use server';
import xml2js from 'xml2js';

interface Property {
    id: string;
    hint: string;
}

interface Meter {
    meterId: string;
    energyConsumption?: EnergyConsumption;
    details?: MeterDetails;
}

interface MeterDetails {
    type: string;
    name: string;
    unitOfMeasure: string;
}

interface MeterAssociation {
    energyMeters: Meter[];
    waterMeters: Meter[];
    wasteMeters: Meter[];
}

interface EnergyConsumption {
    id: string;
    usage: string;
    startDate: string;
    endDate: string;
    cost: string;
}

export interface PropertyDetails {
    id: string;
    name: string;
    numberOfBuildings: string;

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

    occupancyPercentage: string;

    linkMeters: Property[]; // Changed linkMeters to use Property interface directly

    meterAssociations: MeterAssociation;

    energyConsumption: EnergyConsumption[];

}

async function fetchProperties(): Promise<Property[]> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/energystar/properties`);
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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const metersPromise = fetch(`${baseUrl}/api/energystar/meters?id=${propertyId}`).then(res => res.text());
    const detailsPromise = fetch(`${baseUrl}/api/energystar/properties_detail?id=${propertyId}`).then(res => res.text());
    const associationPromise = fetch(`${baseUrl}/api/energystar/meters/property_meters_ids?id=${propertyId}`).then(res => res.text());

    const [metersXml, detailsXml, associationsXml] = await Promise.all([metersPromise, detailsPromise, associationPromise]);

    const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

    const linkMeters: Property[] = await new Promise((resolve, reject) => {
        parser.parseString(metersXml, (err: any, result: any) => {
            if (err) {
                console.error('Failed to parse meters XML', err);
                reject(err);
            } else {
                resolve(result.response.links.link);
            }
        });
    });

    //meter Associations for organize
    const meterAssociations: MeterAssociation = await new Promise((resolve, reject) => {
        parser.parseString(associationsXml, (err: any, result: any) => {
            if (err) {
                console.error('Failed to parse associations XML', err);
                reject(err);
            } else {
                const associations: MeterAssociation = {
                    energyMeters: [],
                    waterMeters: [],
                    wasteMeters: []
                };

                if (result.meterPropertyAssociationList.energyMeterAssociation?.meters?.meterId) {
                    const energyMeterIds = result.meterPropertyAssociationList.energyMeterAssociation.meters.meterId;
                    associations.energyMeters = Array.isArray(energyMeterIds) ? energyMeterIds.map(id => ({ meterId: id })) : [{ meterId: energyMeterIds }];
                }

                if (result.meterPropertyAssociationList.waterMeterAssociation?.meters?.meterId) {
                    const waterMeterIds = result.meterPropertyAssociationList.waterMeterAssociation.meters.meterId;
                    associations.waterMeters = Array.isArray(waterMeterIds) ? waterMeterIds.map(id => ({ meterId: id })) : [{ meterId: waterMeterIds }];
                }

                if (result.meterPropertyAssociationList.wasteMeterAssociation?.meters?.meterId) {
                    const wasteMeterIds = result.meterPropertyAssociationList.wasteMeterAssociation.meters.meterId;
                    associations.wasteMeters = Array.isArray(wasteMeterIds) ? wasteMeterIds.map(id => ({ meterId: id })) : [{ meterId: wasteMeterIds }];
                }

                resolve(associations);
            }
        });
    });

    //fetch EnergyConsumption data for each energy meter
    for (let meter of meterAssociations.energyMeters) {
        const consumptionResponse = await fetch(`${baseUrl}/api/energystar/meters/consumption?id=${meter.meterId}`);
        const consumptionXml = await consumptionResponse.text();

        const meterdetailResponse = await fetch(`${baseUrl}/api/energystar/meters/meter?id=${meter.meterId}`);
        const meterdetailXml = await meterdetailResponse.text();

        await new Promise<void>((resolve, reject) => {
            parser.parseString(consumptionXml, (err: any, result: any) => {
                if (err) {
                    console.error(`Failed to parse consumption XML for meter ${meter.meterId}`, err);
                    reject(err);
                } else {
                    meter.energyConsumption = result.meterData.meterConsumption;
                    resolve();
                }
            });
        });

        await new Promise<void>((resolve, reject) => {
            parser.parseString(meterdetailXml, (err: any, result: any) => {
                if (err) {
                    console.error(`Failed to parse consumption XML for meter ${meter.meterId}`, err);
                    reject(err);
                } else {
                    meter.details = result.meter;
                    resolve();
                }
            });
        });
    }

    //fetch EnergyConsumption data for each water meter
    for (let meter of meterAssociations.waterMeters) {
        const consumptionResponse = await fetch(`${baseUrl}/api/energystar/meters/consumption?id=${meter.meterId}`);
        const consumptionXml = await consumptionResponse.text();

        const meterdetailResponse = await fetch(`${baseUrl}/api/energystar/meters/meter?id=${meter.meterId}`);
        const meterdetailXml = await meterdetailResponse.text();

        await new Promise<void>((resolve, reject) => {
            parser.parseString(consumptionXml, (err: any, result: any) => {
                if (err) {
                    console.error(`Failed to parse consumption XML for meter ${meter.meterId}`, err);
                    reject(err);
                } else {
                    meter.energyConsumption = result.meterData.meterConsumption;
                    resolve();
                }
            });
        });

        await new Promise<void>((resolve, reject) => {
            parser.parseString(meterdetailXml, (err: any, result: any) => {
                if (err) {
                    console.error(`Failed to parse consumption XML for meter ${meter.meterId}`, err);
                    reject(err);
                } else {
                    meter.details = result.meter;
                    resolve();
                }
            });
        });
    }

    //fetch EnergyConsumption data for each waste meter
    for (let meter of meterAssociations.wasteMeters) {
        const consumptionResponse = await fetch(`${baseUrl}/api/energystar/meters/consumption/waste?id=${meter.meterId}`);
        const consumptionXml = await consumptionResponse.text();

        const meterdetailResponse = await fetch(`${baseUrl}/api/energystar/meters/meter?id=${meter.meterId}`);
        const meterdetailXml = await meterdetailResponse.text();

        await new Promise<void>((resolve, reject) => {
            parser.parseString(consumptionXml, (err: any, result: any) => {
                if (err) {
                    console.error(`Failed to parse consumption XML for meter ${meter.meterId}`, err);
                    reject(err);
                } else {
                    meter.energyConsumption = result.wasteDataList.wasteData;
                    resolve();
                }
            });
        });

        await new Promise<void>((resolve, reject) => {
            parser.parseString(meterdetailXml, (err: any, result: any) => {
                if (err) {
                    console.error(`Failed to parse consumption XML for meter ${meter.meterId}`, err);
                    reject(err);
                } else {
                    meter.details = result.wasteMeter;
                    resolve();
                }
            });
        });
    }

    const propertyDetails: PropertyDetails = await new Promise((resolve, reject) => {
        parser.parseString(detailsXml, (err: any, result: any) => {
            if (err) {
                console.error('Failed to parse property details XML', err);
                reject(err);
            } else {
                resolve({
                    ...result.property,
                    id: propertyId,
                    linkMeters: linkMeters,
                    meterAssociations: meterAssociations,
                    
                });
            }
        });
    });

    return propertyDetails;
}


export async function fetchAllPropertyDetails(): Promise<PropertyDetails[]> {
    const properties = await fetchProperties();
    const propertyDetailsPromises = properties.map(property => fetchPropertyDetails(property.id));
    return await Promise.all(propertyDetailsPromises);
}