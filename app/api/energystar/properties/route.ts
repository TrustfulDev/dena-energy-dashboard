import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const username = process.env.ENERGY_STAR_USERNAME;
  const password = process.env.ENERGY_STAR_PASSWORD;
  const basicAuth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
  const url = 'https://portfoliomanager.energystar.gov/ws/account/329275/property/list';

  const {searchParams} = new URL(req.url||"");
  const userId = searchParams.get("id");

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
