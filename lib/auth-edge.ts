
import { NextRequest } from "next/server"

export function authEdge(handler: (req: NextRequest & { auth?: any }) => any) {
  return (req: NextRequest) => {
    const token = req.cookies.get("next-auth.session-token")?.value || req.cookies.get("__Secure-next-auth.session-token")?.value
    let payload = null
    if (token) {
      try {
        const base64 = token.split(".")[1]
        payload = JSON.parse(Buffer.from(base64, "base64").toString())
      } catch {}
    }
    // Attach decoded payload as req.auth
    return handler(Object.assign(req, { auth: payload ? { user: payload } : undefined }))
  }
}
