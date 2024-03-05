import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import db from '../../../utils/database';
import { auth, currentUser } from "@clerk/nextjs";


export async function POST(req: NextApiRequest) {
    //const check = req.json();

    const { userId } = auth();

    try {
        if (!userId) {
            return new NextResponse("ClerkID is required", {status: 400});
        }

        const deleteQuery = 'DELETE FROM Dashboard.ENERGYSTAR WHERE ClerkUID = ?';
        await db.execute(deleteQuery, [userId]);

        return new NextResponse("Row successfully deleted", {status: 200});

    } catch (error) {
        console.error('Error deleting row:', error);
        
        return new NextResponse("Internal Server Error", {status: 500});

    }

}
