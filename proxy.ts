import { withAuth } from "next-auth/middleware"

export const proxy = withAuth({
  pages: {
    signIn: "/",
  },
})

export const config = {
  matcher: [
    "/conversations/:path*",
    "/users/:path*",
  ],
}