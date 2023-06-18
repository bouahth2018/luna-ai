import "./globals.css";
import Providers from "./providers";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";

// const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: "Luna AI | Astrant",
  description:
    "A friendly and knowledgeable AI designed to assist and interact with humans.",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full">
      {/* <body className={cn(inter.className, "h-full dark:bg-[#111]")}> */}
      <body className="h-full dark:bg-[#111] antialiased">
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
