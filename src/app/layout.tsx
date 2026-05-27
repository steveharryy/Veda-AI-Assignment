import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VedaAI — Modern Education & Assignment Dashboard",
  description: "A pixel-perfect, premium AI-powered education dashboard for creating, organizing, and evaluating academic assessments.",
  keywords: ["education dashboard", "AI grading", "assignment creator", "SaaS education", "A4 question paper generator"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="antialiased text-[#141414] bg-[#F5F5F5] min-h-screen">
        {children}
      </body>
    </html>
  );
}
