import { NextRequest } from 'next/server'
import { verifyToken } from './auth'

export async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.cookies.get("access_token")?.value
  const bearerToken = req.headers.get('authorization')
  if (authHeader) {
    const user = verifyToken(authHeader)
    return user

  }
  else if (bearerToken && bearerToken.startsWith('Bearer ')) {
    const token = bearerToken.split(' ')[1]
    const user = verifyToken(bearerToken)
    return user
  }
  else return null
}
