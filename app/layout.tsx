import AuthContext from "@/context/AuthContext";
import ToasterContext from "@/context/ToasterContext";
import { authOptions } from "@/libs/authOptions";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import "./globals.css";

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
          <div className="w-full h-full bg-#fff">
            <div className="max-w-110 h-full m-auto">{children}</div>
          </div>
        </AuthContext>
      </body>
    </html>
  );
}
