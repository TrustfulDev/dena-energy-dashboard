import { getPool } from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest) {
  const {searchParams} = new URL(req.url||"");
  const userId = searchParams.get("id");
  const accountId = searchParams.get("account");
  const connection = await getPool();

  //console.log("asdadwdadawdad", accountId);
  //const username = process.env.ENERGY_STAR_USERNAME;
  //const password = process.env.ENERGY_STAR_PASSWORD;
  // const username = "process.env.ENERGY_STAR_USERNAME";
  // const password = "process.sss.ENERGY_STAR_PASSWORD";

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
  const url = `https://portfoliomanager.energystar.gov/ws/account/${accountId}/property/list`;

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
