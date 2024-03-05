import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import db from '../../../utils/database';
import { auth } from "@clerk/nextjs";


export async function POST(req: Request) {
    try {
        const password = req.json();

        console.log("Received password: ", password);

        return new NextResponse("password update", {status: 200});
    } catch (error) {
        console.error('Error updating password:', error);

        return new NextResponse("Internal Server Error", {status: 500});
    }


}
