import { getPool } from "@/utils/database";
import { RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const {searchParams} = new URL(req.url||"");
  const meterId = searchParams.get("id");
  const userId = searchParams.get("userId");
  const connection = getPool();

  const query = `
    SELECT AccountID
    FROM ENERGYSTAR
    WHERE ClerkUID = ?
  `
  try {
    const [rows] = await connection.execute<RowDataPacket[]>(query, [userId]);

    if ( !(rows.length > 0) ){
      return new NextResponse("Can't find aaccount", { status: 400 }) 
    }
  }catch (error: any){
    console.error('Database query error:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  const basicAuth = 'Basic ' + Buffer.from(`${process.env.ENERGY_STAR_USERNAME}:${process.env.ENERGY_STAR_PASSWORD}`).toString('base64');
  const url = `https://portfoliomanager.energystar.gov/ws/meter/${meterId}/wasteData`;

  try {
    const apiRes = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/xml',
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