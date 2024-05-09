import { getPool } from "@/utils/database";
import { RowDataPacket } from 'mysql2';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const {searchParams} = new URL(req.url||"");
  const reportId = searchParams.get("id");
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
  } catch (error){
    console.error('Database query error:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  const basicAuth = 'Basic ' + Buffer.from(`${process.env.ENERGY_STAR_USERNAME}:${process.env.ENERGY_STAR_PASSWORD}`).toString('base64');
  const url = `https://portfoliomanager.energystar.gov/ws/reports/${reportId}/download?type=EXCEL`;

  try {
    const apiRes = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': basicAuth,
      },
    });

    if (!apiRes.ok) {
      throw new Error(`HTTP error! status: ${apiRes.status}`);
    }

    const blob = await apiRes.blob();
    const headers = new Headers({
        'Content-Disposition': `attachment; filename="report-${reportId}.xlsx"`,
    });

    // Stream the Excel file back to the client
    return new Response(blob.stream(), { headers });
  } catch (error : any) {
    return new Response (error.message);
  }
}