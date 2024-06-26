import { initializePool } from '@/utils/database';
import xml2js from 'xml2js';

interface EnergyStarAccount {
    id: string;
}
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
    electricMeters: Meter[];
    naturalGasMeters: Meter[];
}

interface EnergyConsumption {
    id: string;
    usage: string;
    startDate: string;
    endDate: string;
    cost: string;
}
//testing for socres
interface Test {

}

interface Metric {
    name: string;
    dataType: string;
    value: any; 
    uom?: string;
}

interface MetricScore {
    name: string;
    dataType: string;
    value: string | number | null;
    uom?: string | null;
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

    //metricScores: MetricScore[];
    metricScores: MetricScore[];


}

async function fetchEnergyStarAccount(id: string): Promise<EnergyStarAccount> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/energystar/account?id=${id}`);
    const data = await response.json();

    return new Promise((resolve, reject) => {
        if (!response) {
            console.error("propertiesApi.ts ERROR: fetchEnergyStarAccount");
            reject("Failed to fetch account");
        } else {
            console.log("ENERGY STAR ACCOUNT: " + response);
            const res: EnergyStarAccount = {id: data.username};
            resolve(res);
        }
    });
}

async function fetchProperties(account: string, id: string): Promise<Property[]> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/energystar/properties?id=${id}&account=${account}`, { next: { tags: ['energystar_properties'] } });
    const xml = await response.text();
    const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

    return new Promise((resolve, reject) => {
        parser.parseString(xml, (err: any, result: any) => {
            if (err) {
                console.error("propertiesApi.ts ERROR: fetchProperties");
                reject(err);
            } else {
                const properties: Property[] = result.response.links.link;
                resolve(properties);
            }
        });
    });
}

//testing
async function fetchScores(propertyId: string, id: string): Promise<Test[]> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/energystar/meters/scores?id=${propertyId}&userId=${id}`, { next: { tags: ['energystar_properties'] } });
    const xml = await response.text();
    const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

    /*
    return new Promise((resolve, reject) => {
        parser.parseString(xml, (err: any, result: any) => {
            if (err) {
                console.error("fetchProperties FAILED... No account?");
                reject(err);
            } else {
                const test: Test[] = result.propertyMetrics.metric;

                console.log("gerereer", test);

                resolve(test);
            }
        });
    });
    */
    return new Promise((resolve, reject) => {
        parser.parseString(xml, (err, result) => {
            if (err) {
                console.error("Failed to fetch scores for property ID:", propertyId, err);
                reject(err);
            } else {
                const metrics = result.propertyMetrics.metric.map((metric: Metric) => {
                    //handle value considering 'xsi:nil'
                    let metricValue = metric.value;
                    if (typeof metricValue === 'object' && metricValue['xsi:nil'] === 'true') {
                        metricValue = null;
                    }

                    return {
                        name: metric.name,
                        dataType: metric.dataType,
                        value: metricValue,
                        uom: metric.uom || null //dollar checking
                    };
                });

                resolve(metrics);
            }
        });
    });
}

async function fetchPropertyDetails(propertyId: string, id: string): Promise<PropertyDetails> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const metersPromise = await fetch(`${baseUrl}/api/energystar/meters?id=${propertyId}&userId=${id}`, { next: { tags: ['energystar_properties'] } }).then(res => res.text());
    const detailsPromise = await fetch(`${baseUrl}/api/energystar/properties_detail?id=${propertyId}&userId=${id}`, { next: { tags: ['energystar_properties'] } }).then(res => res.text());
    const associationPromise = await fetch(`${baseUrl}/api/energystar/meters/property_meters_ids?id=${propertyId}&userId=${id}`, { next: { tags: ['energystar_properties'] } }).then(res => res.text());
    //const scorePromise = await fetch(`${baseUrl}/api/energystar/meters/scores?id=${propertyId}&userId=${id}`, { next: { tags: ['energystar_properties'] } }).then(res => res.text());

    const [metersXml, detailsXml, associationsXml] = await Promise.all([metersPromise, detailsPromise, associationPromise]);
    const metricScores = await fetchScores(propertyId, id);

    const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

    const linkMeters: Property[] = await new Promise((resolve, reject) => {
        parser.parseString(metersXml, (err: any, result: any) => {
            if (err) {
                console.error('fetchPropertyDetails FAILED...', err);
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
                console.error('fetchPropertyDetails: Failed to parse meterAssociations XML', err);
                reject(err);
            } else {
                const associations: MeterAssociation = {
                    energyMeters: [],
                    waterMeters: [],
                    wasteMeters: [],
                    electricMeters: [],
                    naturalGasMeters: [],
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

        //split the gas and electric
        await Promise.all(meterAssociations.energyMeters.map(async (meter) => {
            const meterDetailResponse = await fetch(`${baseUrl}/api/energystar/meters/meter?id=${meter.meterId}&userId=${id}`, { next: { tags: ['energystar_properties'] } });
            const meterDetailXml = await meterDetailResponse.text();
        
            return new Promise<void>((resolve, reject) => {
                parser.parseString(meterDetailXml, (err: any, result: any) => {
                    if (err) {
                        console.error(`fetchPropertyDetails: Failed to parse meter detail XML for meter ${meter.meterId}`, err);
                        reject(err);
                    } else {
                        const meterType = result.meter.type;
                        if (meterType === 'Electric') {
                            meterAssociations.electricMeters.push(meter);
                        } else if (meterType === 'Natural Gas') {
                            meterAssociations.naturalGasMeters.push(meter);
                        }
                        resolve();
                    }
                });
            });
        }));

    //fetch EnergyConsumption data for each energy meter
    for (let meter of meterAssociations.energyMeters) {
        const consumptionResponse = await fetch(`${baseUrl}/api/energystar/meters/consumption?id=${meter.meterId}&userId=${id}`, { next: { tags: ['energystar_properties'] } });
        const consumptionXml = await consumptionResponse.text();

        const meterdetailResponse = await fetch(`${baseUrl}/api/energystar/meters/meter?id=${meter.meterId}&userId=${id}`, { next: { tags: ['energystar_properties'] } });
        const meterdetailXml = await meterdetailResponse.text();

        await new Promise<void>((resolve, reject) => {
            parser.parseString(consumptionXml, (err: any, result: any) => {
                if (err) {
                    console.error(`fetchPropertyDetails: Failed to parse consumption XML for meter ${meter.meterId}`, err);
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
                    console.error(`fetchPropertyDetails: Failed to parse consumption XML for meter ${meter.meterId}`, err);
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
        const consumptionResponse = await fetch(`${baseUrl}/api/energystar/meters/consumption?id=${meter.meterId}&userId=${id}`, { next: { tags: ['energystar_properties'] } });
        const consumptionXml = await consumptionResponse.text();

        const meterdetailResponse = await fetch(`${baseUrl}/api/energystar/meters/meter?id=${meter.meterId}&userId=${id}`, { next: { tags: ['energystar_properties'] } });
        const meterdetailXml = await meterdetailResponse.text();

        await new Promise<void>((resolve, reject) => {
            parser.parseString(consumptionXml, (err: any, result: any) => {
                if (err) {
                    console.error(`fetchPropertyDetails: Failed to parse consumption XML for meter ${meter.meterId}`, err);
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
                    console.error(`fetchPropertyDetails: Failed to parse consumption XML for meter ${meter.meterId}`, err);
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
        const consumptionResponse = await fetch(`${baseUrl}/api/energystar/meters/consumption/waste?id=${meter.meterId}&userId=${id}`, { next: { tags: ['energystar_properties'] } });
        const consumptionXml = await consumptionResponse.text();

        const meterdetailResponse = await fetch(`${baseUrl}/api/energystar/meters/meter?id=${meter.meterId}&userId=${id}`, { next: { tags: ['energystar_properties'] } });
        const meterdetailXml = await meterdetailResponse.text();

        await new Promise<void>((resolve, reject) => {
            parser.parseString(consumptionXml, (err: any, result: any) => {
                if (err) {
                    console.error(`fetchPropertyDetails: Failed to parse consumption XML for meter ${meter.meterId}`, err);
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
                    console.error(`fetchPropertyDetails: Failed to parse consumption XML for meter ${meter.meterId}`, err);
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
                console.error('fetchPropertyDetails: Failed to parse property details XML', err);
                reject(err);
            } else {
                resolve({
                    ...result.property,
                    id: propertyId,
                    linkMeters: linkMeters,
                    meterAssociations: meterAssociations,
                    //test: test,
                    metricScores: metricScores,

                    
                });
            }
        });
    });

    //console.log(propertyDetails);
    return propertyDetails;


}

export async function fetchAllPropertyDetails({
    id
} : {
    id: string | undefined
}): Promise<PropertyDetails[]> {
    await initializePool();
    
    const energystaraccount = await fetchEnergyStarAccount(id || "");
    //const scoresData = await fetchScores("31452836", userId || "");
    //console.log("what",scoresData);

    const properties = await fetchProperties(energystaraccount.id, id || "");

    const propertyDetailsPromises = properties.map(property => fetchPropertyDetails(property.id, id || ""));
    return await Promise.all(propertyDetailsPromises);
}