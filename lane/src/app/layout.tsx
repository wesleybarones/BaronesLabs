import type { Metadata, Viewport } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";

const garamond = EB_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal"], variable: "--font-garamond" });
// itálico só baixa quando aparece na tela (poemas, frases), sem atrasar a abertura
const garamondItalico = EB_Garamond({ subsets: ["latin"], weight: ["400", "500"], style: ["italic"], variable: "--font-garamond-italico", preload: false });

export const metadata: Metadata = {
  title: "Lane",
  description: "Um lugar só nosso.",
  appleWebApp: { capable: true, title: "Lane", statusBarStyle: "default" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = { themeColor: "#fbf6ef", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${garamond.variable} ${garamondItalico.variable}`}>
      <body>{children}</body>
    </html>
  );
}
