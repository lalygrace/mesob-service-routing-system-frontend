import type { Metadata } from "next";
import { Noto_Sans_Ethiopic } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

const notoEthiopic = Noto_Sans_Ethiopic({
  variable: "--font-ethiopic",
  subsets: ["ethiopic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mesob Navigator — Government Service Assistant",
  description:
    "AI-powered navigation system for Mesob Center. Find the right government service instantly — by voice, text, or browsing.",
  keywords: [
    "Mesob Center",
    "Ethiopia",
    "government services",
    "AI assistant",
    "service navigation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${notoEthiopic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
