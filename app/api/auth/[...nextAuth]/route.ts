import NextAuth from "next-auth"
import { authOptions } from "@/libs/authOptions";

export { authOptions };

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
