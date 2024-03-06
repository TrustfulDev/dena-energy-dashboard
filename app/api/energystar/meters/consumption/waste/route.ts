import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../../utils/database';
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextApiRequest, res: NextApiResponse) {

  const {searchParams} = new URL(req.url||"");
  const meterId = searchParams.get("id");

  //const username = process.env.ENERGY_STAR_USERNAME;
  //const password = process.env.ENERGY_STAR_PASSWORD;

  const [rows] = await db.query<RowDataPacket[]>('SELECT username, password FROM credentials WHERE id = ?', [1]);
  if (rows.length === 0) {
    throw new Error('No credentials found');
  }

  const { username, password } = rows[0];
  const basicAuth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
  const url = `https://portfoliomanager.energystar.gov/ws/meter/${meterId}/wasteData`;

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