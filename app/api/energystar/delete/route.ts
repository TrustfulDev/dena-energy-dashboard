import { NextRequest, NextResponse } from 'next/server';
import { getPool } from "@/utils/database";
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
    const { id } = await req.json();
    const connection = await getPool();

    try {
        if (!id) {
            return new NextResponse("ClerkID is required", {status: 400});
        }

        const deleteQuery = 'DELETE FROM ENERGYSTAR WHERE ClerkUID = ?';
        await connection.execute(deleteQuery, [id]);
        
        revalidateTag('energystar_properties');
        return new NextResponse("Row successfully deleted", {status: 200});
    } catch (error) {
        console.error('Error deleting row:', error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}
