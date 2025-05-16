import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth.context";
import Header from "@/components/ui-components/header/header";
import ClientProvider from "./client-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Who said that?",
  description: "Who said that?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <ClientProvider>
            <div>
              <Header />
              <main>{children}</main>
            </div>
          </ClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
