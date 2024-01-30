import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function POST(
    req: Request,
) {
    try {
        const { userId } = auth();
        const id = await req.json();

        // Validation
        if (!userId) return new NextResponse("Unauthorized Access", { status: 401 });
        if (!id) return new NextResponse("ID is required", { status: 400 });

        if (id === 12345) {
            return new NextResponse("Found", { status: 200 });
        } else {
            return new NextResponse("Not Found", { status: 404 });
        }

    } catch(err) {
        console.log("Energy Star Linking: ", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}