import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/utils/database";
import { RowDataPacket } from 'mysql2';
import { revalidateTag } from "next/cache";
import xml2js from 'xml2js';

export async function POST(
    req: Request,
) {
    const connection = getPool();

    try {
        const { accountID, firstname, lastname, userId } = await req.json();

        if (!userId) return new NextResponse("ENERGY STAR LINKING - Unauthorized Access [UserId]", { status: 401 });

        //--------------
        //fetch check account valid in energystar environment first
        const basicAuth = 'Basic ' + Buffer.from(`${process.env.ENERGY_STAR_USERNAME}:${process.env.ENERGY_STAR_PASSWORD}`).toString('base64');
        const url = `https://portfoliomanager.energystar.gov/ws/account/${accountID}/property/list`;

        const energyStarResponse = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': basicAuth,
            },
        });

        if (!energyStarResponse.ok) {
            console.log("ENERGY STAR LINKING - Account not found!")

            return new NextResponse("ENERGY STAR LINKING - Account validation failed!", { status: 401 });
        } else {
            const xml = await energyStarResponse.text();
            const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

            parser.parseString(xml, (err: any, result: any) => {
                if (err) {
                    console.error("propertiesApi.ts ERROR: fetchProperties");
                } else {
                    const properties = result.response.links.link;
                    if (properties.length < 1) return new NextResponse("ENERGY STAR LINKING - Account validation failed!", { status: 401 });
                }
            });

            console.log("ENERGY STAR LINKING - Account verified!")
        }

        //need to put this code somewhere so it could auto check exist account or add account
        //only check and add clerk user into USER table database
        const userInsertQuery = `
            INSERT IGNORE INTO USERS (ClerkUID, FirstName, LastName)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE FirstName = VALUES(FirstName), LastName = VALUES(LastName);
        `;
        await connection.execute(userInsertQuery, [userId, firstname, lastname]);
        
        //check account already exist in energystar
        const energyStarInsertQuery = `
            INSERT INTO ENERGYSTAR (AccountID, ClerkUID)
            VALUES (?, ?);
        `;
        await connection.execute(energyStarInsertQuery, [accountID, userId]);
        
        revalidateTag('energystar_properties');
        return new NextResponse("ENERGY STAR LINKING - Account linked successfully!", { status: 200 });
    } catch(err: any) {
        if (err.errno === 1062) {
            return new NextResponse("ENERGY STAR LINKING - Account already linked!", { status: 409 });
        }
        return new NextResponse("ENERGY STAR LINKING - Internal Error!", { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url || "");
    const userId = searchParams.get("id");

    if (!userId) return new NextResponse("ENERGY STAR LINKING - Unauthorized Access", { status: 401 });
    const connection = getPool();

    const query = `
        SELECT AccountID
        FROM ENERGYSTAR
        WHERE ClerkUID = ?
    `;
    
    try {
        const [rows] = await connection.execute<RowDataPacket[]>(query, [userId]);

        if (rows.length > 0) {
            const { AccountID } = rows[0];

            return NextResponse.json({ username: AccountID }, { status: 200 })

        } else {
            return NextResponse.json({ username: null }, { status: 200 })
        }
    }catch (error: any){
        console.error('ENERGY STAR LINKING - Database query error: ', error);
        return new NextResponse("ENERGY STAR LINKING - Internal Server Error", { status: 500 });
    }
}