import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import { getPool } from "@/utils/database";
import { RowDataPacket } from 'mysql2';
import action from "@/lib/revalidateUtil";

export async function POST(
    req: Request,
) {
    const connection = await getPool();

    try {
        const { userId } = await auth();
        const currUser = await currentUser();
        const firstname = currUser?.firstName;
        const lastname = currUser?.lastName;
        
        const { username, password } = await req.json();

        if (!userId) return new NextResponse("ENERGY STAR LINKING - Unauthorized Access [UserId]", { status: 401 });

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
            console.log("ENERGY STAR LINKING - Account not found!")

            return new NextResponse("ENERGY STAR LINKING - Account validation failed!", { status: 401 });
        }else {
            console.log("ENERGY STAR LINKING - Account verified!")
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
        
        action();
        return new NextResponse("ENERGY STAR LINKING - Account linked successfully!", { status: 200 });
    } catch(err: any) {
        if (err.errno === 1062) {
            return new NextResponse("ENERGY STAR LINKING - Account already linked!", { status: 409 });
        }
        return new NextResponse("ENERGY STAR LINKING - Internal Error!", { status: 500 });
    }
}

export async function GET() {

    const { userId } = await auth();
    if (!userId) return new NextResponse("ENERGY STAR LINKING - Unauthorized Access", { status: 401 });
    const connection = await getPool();

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
            return NextResponse.json({ username: null }, { status: 200 })
        }
    }catch (error: any){
        console.error('ENERGY STAR LINKING - Database query error: ', error);
        return new NextResponse("ENERGY STAR LINKING - Internal Server Error", { status: 500 });
    }
}