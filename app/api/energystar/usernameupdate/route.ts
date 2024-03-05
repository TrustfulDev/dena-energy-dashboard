import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import db from '../../../utils/database';
import { auth } from "@clerk/nextjs";


export async function POST(req: NextApiRequest) {

    const { userId } = auth();

    try {
        if (!userId) {
            return new NextResponse("ClerkID is required", {status: 400});
        }


    } catch (error) {
        console.error('Error deleting row:', error);
        
        return new NextResponse("Internal Server Error", {status: 500});

    }

}
