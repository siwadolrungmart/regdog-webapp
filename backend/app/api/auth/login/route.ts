import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, badRequest, serverError } from '@/lib/http'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const { email, password } = json

    if (!email || !password) {
      return badRequest('Email and password are required')
    }

    // หา user ที่มี email ตรงกัน
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return badRequest('Invalid email or password')
    }

    // เช็ครหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      return badRequest('Invalid email or password')
    }

    // ส่งข้อมูล user กลับไป (ไม่ส่ง passwordHash)
    return ok({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  } catch (err: any) {
    return serverError(err)
  }
}
