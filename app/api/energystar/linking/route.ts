import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import db from '../../../utils/database';
import { RowDataPacket } from 'mysql2';


export async function POST(
    req: Request,
) {
    try {
        const { userId } = auth();
        const username = await currentUser();

        //const id = await req.json();
        const { id, id2 } = await req.json();

        const firstname = username?.firstName;
        const lastname = username?.lastName;

        if (!userId) return new NextResponse("Unauthorized Access", { status: 401 });
        //if (!id || !id2) return new NextResponse("ID and Password are required", { status: 400 });

        //need to put this code somewhere so it could auto check exist account
        const userInsertQuery = `
            INSERT IGNORE INTO Dashboard.USERS (ClerkUID, FirstName, LastName)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE FirstName = VALUES(FirstName), LastName = VALUES(LastName);
        `;
        await db.execute(userInsertQuery, [userId, firstname, lastname]);
        
        //check account already exist in energystar
        const energyStarInsertQuery = `
            INSERT INTO Dashboard.ENERGYSTAR (Username, Password, ClerkUID)
            VALUES (?, ?, ?);
        `;
        await db.execute(energyStarInsertQuery, [id, id2, userId]);

        return new NextResponse("Account linked successfully", { status: 200 });


    } catch(errno) {

        if (errno === 1062) {
            return new NextResponse("Account already linked", { status: 409 });
        }
        console.error("Error in Energy Star Linking:", errno);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


