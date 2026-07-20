import type { Metadata } from "next";
import { Bebas_Neue, Barlow } from "next/font/google";
import { ThemeProvider } from "@/shared/layout/ThemeProvider";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const barlow = Barlow({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DomCore Web — Gestão de Academia",
  description: "Demonstração DomCore Gym - PR: gestão de academia, catraca e gamificação.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${bebas.variable} ${barlow.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
