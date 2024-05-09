import { getPool } from "@/utils/database";
import { RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';
import xml2js from 'xml2js';

export async function GET(req: NextRequest) {
  const {searchParams} = new URL(req.url||"");
  const userId = searchParams.get("id");
  const connection = await getPool();

  let AccountID = '';

  const query = `
    SELECT AccountID
    FROM ENERGYSTAR
    WHERE ClerkUID = ?
  `
  try {
    const [rows] = await connection.execute<RowDataPacket[]>(query, [userId]);

    if ( rows.length > 0 ){
      AccountID = rows[0].AccountID;

    }else {
      return new NextResponse("Can't find aaccount", { status: 400 }) 
    }
  } catch (error){

    console.error('Database query error:', error);
    return new NextResponse("Internal Server Error", { status: 500 });

  }

  const basicAuth = 'Basic ' + Buffer.from(`${process.env.ENERGY_STAR_USERNAME}:${process.env.ENERGY_STAR_PASSWORD}`).toString('base64');
  const url = `https://portfoliomanager.energystar.gov/ws/account/${AccountID}/property/list`;

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
    const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

    parser.parseString(data, (err: any, result: any) => {
        if (err) {
            console.error("propertiesApi.ts ERROR: fetchProperties");
        } else {
            const properties = result.response.links.link;
            if (properties.length < 1) return new NextResponse("ENERGY STAR ACCOUNT - Account validation failed!", { status: 401 });
        }
    });

    return NextResponse.json({ username: AccountID }, { status: 200 })
  } catch (error : any) {
    return new Response (error.message);
  }
}
