// app/api/auth/login/route.ts
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.formData()
    const email = body.get("email") as string;
    const password = body.get("password") as string;
    if (!email || !password) {
      return NextResponse.json(
        { status: 'failed', message: 'Email and password required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json(
        { status: 'failed', message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json(
        { status: 'failed', message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = signToken({ id: user.id, email: user.email })

    const res = NextResponse.json(
      {
        status: 'success',
        message: 'Login successful',
        // token,
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 200 }
    )
   const secure = process.env.NEXT_PUBLIC_SECURE_ATTR === 'secure'

  res.cookies.set('access_token', token, {
    path: '/',
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 day or set as needed
  })

  res.cookies.set('id', user.id, {
    path: '/',
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
  })

  res.cookies.set('name', user.name, {
    path: '/',
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
  })

  res.cookies.set('email', user.email, {
    path: '/',
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
  })

  return res

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { status: 'failed', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
