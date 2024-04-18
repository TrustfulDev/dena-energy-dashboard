import { NextResponse } from 'next/server';
import { getPool } from "@/utils/database";
import { currentUser } from "@clerk/nextjs";
import { revalidateTag } from 'next/cache';

export async function POST() {
    const currUser = await currentUser();
    const userId = currUser?.id;
    const connection = await getPool();

    try {
        if (!userId) {
            return new NextResponse("ClerkID is required", {status: 400});
        }

        const deleteQuery = 'DELETE FROM ENERGYSTAR WHERE ClerkUID = ?';
        await connection.execute(deleteQuery, [userId]);
        
        revalidateTag('energystar_properties');
        return new NextResponse("Row successfully deleted", {status: 200});
    } catch (error) {
        console.error('Error deleting row:', error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}
