import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css"; 

// 1. IMPORTE O AuthProvider
import { AuthProvider } from "@/contexts/AuthContext";

import Navbar from "../componentes/layout/navBar";
import Footer from "../componentes/layout/footer"; 

const poppins = Poppins({
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900"
  ]
})

export const metadata: Metadata = {
  title: "MyPetZone | Encontre Seu Novo Melhor Amigo",
  description: "Plataforma de adoção de pets para conectar animais e lares amorosos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={poppins.className}>
        
        {/* 2. "ABRACE" TUDO COM O AuthProvider */}
        <AuthProvider>
          <Navbar />
          
          <main>
            {children}
          </main>
          
          <Footer />
        </AuthProvider>
        
      </body>
    </html>
  );
}