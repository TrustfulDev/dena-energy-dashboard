import { getPool } from "@/utils/database";
import { RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {

    const {searchParams} = new URL(req.url||"");
    const reportId = searchParams.get("id");
    const userId = searchParams.get("userId");
    const connection = await getPool();

  //console.log("checkingggg," , userId);
  let username = '';
  let password = '';

  const query = `
    SELECT Username, Password
    FROM ENERGYSTAR
    WHERE ClerkUID = ?
  `
  try {
    const [rows] = await connection.execute<RowDataPacket[]>(query, [userId]);

    if ( rows.length > 0 ){
      username = rows[0].Username;
      password = rows[0].Password; 

    }else {
      return new NextResponse("Can't find aaccount", { status: 400 }) 
    }
  } catch (error){

    console.error('Database query error:', error);
    return new NextResponse("Internal Server Error", { status: 500 });

  }

  const basicAuth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
  const url = `https://portfoliomanager.energystar.gov/ws/reports/${reportId}`;

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
