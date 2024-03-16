import { NextResponse } from 'next/server';
import db from '../../../../utils/database';
import { auth } from "@clerk/nextjs";
import { revalidateTag } from 'next/cache';

export async function POST() {
    const { userId } = auth();
    const connection = await db.getConnection();

    try {
        if (!userId) {
            return new NextResponse("ClerkID is required", {status: 400});
        }

        const deleteQuery = 'DELETE FROM ENERGYSTAR WHERE ClerkUID = ?';
        await connection.execute(deleteQuery, [userId]);
        revalidateTag('energystar_properties');

        connection.release();
        return new NextResponse("Row successfully deleted", {status: 200});

    } catch (error) {
        console.error('Error deleting row:', error);
        connection.release();
        return new NextResponse("Internal Server Error", {status: 500});

    }

}
