import { NextResponse } from 'next/server';
import { getPool } from "@/utils/database";
import { auth } from "@clerk/nextjs";
import action from '@/lib/revalidateUtil';

export async function POST() {
    const { userId } = await auth();
    const connection = await getPool();

    try {
        if (!userId) {
            return new NextResponse("ClerkID is required", {status: 400});
        }

        const deleteQuery = 'DELETE FROM ENERGYSTAR WHERE ClerkUID = ?';
        await connection.execute(deleteQuery, [userId]);
        
        action();
        return new NextResponse("Row successfully deleted", {status: 200});
    } catch (error) {
        console.error('Error deleting row:', error);
        return new NextResponse("Internal Server Error", {status: 500});

    }

}
