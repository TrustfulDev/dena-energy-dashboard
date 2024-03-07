import db from '../../../../../utils/database';
import { RowDataPacket } from 'mysql2';
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest } from 'next';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: NextApiRequest) {

  const {searchParams} = new URL(req.url||"");
  const meterId = searchParams.get("id");
  const userId = searchParams.get("userId");
  
  const username = process.env.ENERGY_STAR_USERNAME;
  const password = process.env.ENERGY_STAR_PASSWORD;

  const basicAuth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
  const url = `https://portfoliomanager.energystar.gov/ws/meter/${meterId}/consumptionData`;

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