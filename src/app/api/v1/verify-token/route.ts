import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { status: 'failed', message: 'Unauthorized: No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)

    return NextResponse.json(
      { status: 'success', message: 'Token is valid', user: decoded },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { status: 'failed', message: 'Invalid or expired token', error: error.message },
      { status: 401 }
    )
  }
}
