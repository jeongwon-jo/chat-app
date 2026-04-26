import AuthContext from "@/context/AuthContext";
import ToasterContext from "@/context/ToasterContext";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hi Chat",
  description: "Hi Chat — 실시간 채팅 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="h-full">
        <AuthContext>
          <ToasterContext />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
