import type { Metadata } from "next";
import "./globals.css";
import AuthContext from "@/context/AuthContext";
import ToasterContext from "@/context/ToasterContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Hi Chat",
  description: "Chatting App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="h-full">
        <ThemeProvider>
          <AuthContext>
            <ToasterContext />
            {children}
          </AuthContext>
        </ThemeProvider>
      </body>
    </html>
  );
}
