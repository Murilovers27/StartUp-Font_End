import type { Metadata } from "next";
import { Poppins } from "next/font/google";


// 1. CORREÇÃO: O nome do arquivo na sua árvore é 'globals.css'
import "./globals.css"; 

// 2. Imports dos componentes (Seus caminhos estão corretos)
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
        <Navbar />
        
        {/* 3. CORREÇÃO: Adicionada a tag <main>
            Isso é essencial para o CSS do "sticky footer" funcionar. 
        */}
        <main>
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}