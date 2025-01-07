import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from "@/prisma"

export async function GET(request: NextRequest) {
    return NextResponse.json({ user: 'user' })
}

interface RequestBody {
    email: string;
    password: string;
}

export async function POST(request: NextRequest) {
    const body: RequestBody = await request.json()

    return NextResponse.json({ body })
}
