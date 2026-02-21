import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import ClickSparkWrapper from "@/components/ClickSparkWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RevelSeven | Moda Masculina",
  description: "Catálogo de roupas masculinas com estilo e elegância. Encontre camisetas, bermudas, calças, conjuntos e mais. Reserve pelo WhatsApp.",
  keywords: "moda masculina, roupas masculinas, camisetas, bermudas, calças, conjuntos, estilo",
  openGraph: {
    title: "RevelSeven | Moda Masculina",
    description: "Catálogo de roupas masculinas com estilo e elegância.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className} style={{ minHeight: '100vh' }}>
        <CartProvider>
          <ClickSparkWrapper>
            {children}
          </ClickSparkWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
