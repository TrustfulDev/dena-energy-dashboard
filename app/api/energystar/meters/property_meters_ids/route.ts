import type { NextApiRequest, NextApiResponse } from 'next';
//import { useSearchParams } from 'next/navigation';

export async function GET(req: NextApiRequest, res: NextApiResponse) {

  const {searchParams} = new URL(req.url||"");
  const propertyId = searchParams.get("id");

  const username = process.env.ENERGY_STAR_USERNAME;
  const password = process.env.ENERGY_STAR_PASSWORD;

  //console.log("Checking id passing pro : ", propertyId);

  const basicAuth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
  const url = `https://portfoliomanager.energystar.gov/ws/association/property/${propertyId}/meter`;

  try {
    const apiRes = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/xml',
        //'PM-Metrics': 'score, sourceIntensity, waterIntensityTotal, totalWasteDisposedandDivertedIntensity',
        'Authorization': basicAuth,
      },
    });

    if (!apiRes.ok) {
      throw new Error(`HTTP error! status: ${apiRes.status}`);
    }

    const data = await apiRes.text();
    return new Response (data);
  } catch (error : any) {
    return new Response (error.message);
  }
}
