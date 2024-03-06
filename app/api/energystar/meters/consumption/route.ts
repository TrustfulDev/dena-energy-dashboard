import db from '../../../../utils/database';
import { RowDataPacket } from 'mysql2';
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {

  const {searchParams} = new URL(req.url||"");
  const meterId = searchParams.get("id");

  const username = process.env.ENERGY_STAR_USERNAME;
  const password = process.env.ENERGY_STAR_PASSWORD;

  //--------------------- This pack of code it's to base clerkID to find energystar username and password
  const { userId } = auth();
  const query = 'SELECT Username, Password FROM ENERGYSTAR WHERE ClerkUID = ?';
  const [rows] = await db.execute<RowDataPacket[]>(query, [userId]);

  if (rows.length > 0) {
    const { Username, Password } = rows[0];
    console.log(Username, Password);
  } else {
    return new NextResponse("Credentials not found for the given ClerkID", { status: 404 });
  }
  //-----------------------
  /*
  const [rows] = await db.query<RowDataPacket[]>('SELECT username, password FROM EnergyData.credentials WHERE id = ?', [1]);
  if (rows.length === 0) {
    throw new Error('No credentials found');
  }
  const { username, password } = rows[0];
  */

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