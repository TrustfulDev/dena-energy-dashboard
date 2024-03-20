import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import db from '../../../../utils/database';
import { RowDataPacket } from 'mysql2';
import { revalidateTag } from "next/cache";

export async function POST(
    req: Request,
) {
    const connection = await db.getConnection();

    try {
        const { userId } = auth();
        const currUser = await currentUser();

        const { username, password } = await req.json();

        const firstname = currUser?.firstName;
        const lastname = currUser?.lastName;

        if (!userId) return new NextResponse("Unauthorized Access", { status: 401 });

        //--------------
        //fetch check account valid in energystar environment first
        const basicAuth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
        const url = `https://portfoliomanager.energystar.gov/ws/account`;

        const energyStarResponse = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': basicAuth,
            },
        });

        if (!energyStarResponse.ok) {
            console.log("account NOTTTT found!!!!!!")

            return new NextResponse("EnergyStar account validation failed", { status: 401 });
        }else {

            console.log("account found!!!!!!")
        }
        //----------------------


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
            INSERT INTO ENERGYSTAR (Username, Password, ClerkUID)
            VALUES (?, ?, ?);
        `;
        await connection.execute(energyStarInsertQuery, [username, password, userId]);
        
        connection.release();
        revalidateTag('energystar_properties');
        return new NextResponse("Account linked successfully", { status: 200 });
    } catch(err: any) {
        if (err.errno === 1062) {
            connection.release();
            return new NextResponse("Account already linked", { status: 409 });
        }
        connection.release();
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET() {

    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized Access", { status: 401 });
    const connection = await db.getConnection();

    //return NextResponse.json({ username: null }, { status: 200 })
    const query = `
        SELECT Username
        FROM ENERGYSTAR
        WHERE ClerkUID = ?
    `;
    
    try {
        const [rows] = await connection.execute<RowDataPacket[]>(query, [userId]);

        if (rows.length > 0) {
            const { Username } = rows[0];
            
            //return new NextResponse("Account already linked", { status: 200 });
            return NextResponse.json({ username: Username }, { status: 200 })

        } else {
            return NextResponse.json({ username: null }, { status: 400 })
        }
    }catch (error: any){
        console.error('Database query error:', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }finally {
        connection.release();
    }
}