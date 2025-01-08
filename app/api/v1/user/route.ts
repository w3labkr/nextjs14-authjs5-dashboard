import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from "@/prisma"

export async function GET(req: NextRequest) {
    return NextResponse.json({ user: 'user' })
}

interface RequestBody {
    email: string;
    password: string;
}

export async function POST(req: NextRequest) {
    const body: RequestBody = await req.json()

    return NextResponse.json({ body })
}
