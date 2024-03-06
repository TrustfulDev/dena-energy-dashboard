import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import db from '../../../utils/database';
import { RowDataPacket } from 'mysql2';

export async function POST(
    req: Request,
) {
    try {
        const { userId } = auth();
        const currUser = await currentUser();

        const { username, password } = await req.json();

        const firstname = currUser?.firstName;
        const lastname = currUser?.lastName;

        if (!userId) return new NextResponse("Unauthorized Access", { status: 401 });

        //need to put this code somewhere so it could auto check exist account
        const userInsertQuery = `
            INSERT IGNORE INTO USERS (ClerkUID, FirstName, LastName)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE FirstName = VALUES(FirstName), LastName = VALUES(LastName);
        `;
        await db.execute(userInsertQuery, [userId, firstname, lastname]);
        
        //check account already exist in energystar
        const energyStarInsertQuery = `
            INSERT INTO ENERGYSTAR (Username, Password, ClerkUID)
            VALUES (?, ?, ?);
        `;
        await db.execute(energyStarInsertQuery, [username, password, userId]);

        return new NextResponse("Account linked successfully", { status: 200 });


    } catch(err: any) {
        if (err.errno === 1062) {
            return new NextResponse("Account already linked", { status: 409 });
        }
        
        return new NextResponse("Internal Error", { status: 500 });
    }
}