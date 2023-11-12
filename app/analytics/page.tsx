"use client"

import React from 'react';
import xml2js from 'xml2js';

async function getMeterData(meterId:number) {
  //simulate a delay to mimic network request time
  await new Promise(resolve => setTimeout(resolve, 1000));

  //simulated response
  return `
    <meter>
      <id>${meterId}</id>
      <type>Electric</type>
      <name>Electric Main Meter</name>
      <unitOfMeasure>kBtu (thousand Btu)</unitOfMeasure>
      <metered>true</metered>
      <firstBillDate>2010-01-01</firstBillDate>
      <inUse>true</inUse>
      <accessLevel>Read</accessLevel>
      <audit>
        <createdBy>DUNAYT</createdBy>
        <createdByAccountId>-14</createdByAccountId>
        <createdDate>2012-08-16T17:04:57-04:00</createdDate>
        <lastUpdatedBy>DUNAYT</lastUpdatedBy>
        <lastUpdatedByAccountId>-14</lastUpdatedByAccountId>
        <lastUpdatedDate>2012-08-16T17:09:35-04:00</lastUpdatedDate>
      </audit>
    </meter>
  `;
}

// export default async function AnalyticsPage() {
//   let data;
//   try {
//     data = await getMeterData(543); // Replace this with the actual API call when ready
//   } catch (error) {
//     console.error('Failed to fetch meter data:', error);
//     return <div>Error loading meter data.</div>;
//   }

//   return (
//     <div className="bg-[#242529]">
//       <h1>Analytics</h1>
//       {/* Render the data */}
//       <pre>{data}</pre>
//     </div>
//   );
// }

interface MeterData {
  id: string;
  type: string;
  name: string;
  unitOfMeasure: string;
  metered: string;
  firstBillDate: string;
  accessLevel: string;
  //more..
}

//xml to json
async function parseXMLData(xmlData:string) {
  const parser = new xml2js.Parser({ explicitArray: false });
  const result = await parser.parseStringPromise(xmlData);
  return result.meter;
}

export default function AnalyticsPage() {
  const [meterData, setMeterData] = React.useState<MeterData | null>(null);

  React.useEffect(() => {
    getMeterData(543).then(xmlData => {

      parseXMLData(xmlData).then(parsedData => {

        setMeterData(parsedData);

      }).catch(error => {
        console.error('Error parsing XML data:', error);
      });
    }).catch(error => {
      console.error('Failed to fetch meter data:', error);
    });
  }, []);

  return (
    <div className="bg-[#242529]">
      {/* <h1>Analytics</h1> */}
      {meterData ? (
        <div>
          <p>ID: {meterData.id}</p>
          <p>Type: {meterData.type}</p>
          <p>Name: {meterData.name}</p>
          <p>Unit of Measure: {meterData.unitOfMeasure}</p>
          <p>Metered: {meterData.metered}</p>
          <p>FirstBillDate: {meterData.firstBillDate}</p>
          <p>AccessLevel: {meterData.accessLevel}</p>

          {/* more need implment */}
          <p></p>
        </div>
      ) : (
        //legacy when fetching
        <p>Loading......</p>
      )}
    </div>
  );
}