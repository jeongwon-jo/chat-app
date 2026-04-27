import AuthContext from "@/context/AuthContext";
import ToasterContext from "@/context/ToasterContext";
import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOptions";

export const metadata: Metadata = {
  title: "Hi Chat",
  description: "Hi Chat — 실시간 채팅 서비스",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ko" className="h-full antialiased">
      <body className="h-full">
        <AuthContext session={session}>
          <ToasterContext />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
