"use client"; // Pode ser server component se os dados forem estáticos

import Link from 'next/link';
import Image from 'next/image'; // Usar Image do Next.js para otimização
import styles from './page.module.css';

// 1. Interface para definir a estrutura de um parceiro
interface Partner {
  id: string;
  name: string;
  logoUrl: string; // Caminho para o logo em /public/
  description: string;
  websiteUrl: string; // Link para o site do parceiro
}

export default function ParceriasPage() {

  // 2. Dados de exemplo dos parceiros
  // !! IMPORTANTE !! 
  //    - Substitua os 'logoUrl' pelos caminhos reais das imagens em /public/
  //    - Substitua os 'websiteUrl' pelos links corretos
  const partners: Partner[] = [
    {
      id: "p1",
      name: "PetShop Amigo Fiel",
      logoUrl: "/logo.png", // SUBSTITUA - Ex: /parceiros/amigo-fiel-logo.png
      description: "Tudo para o seu pet, com banho, tosa e acessórios variados.",
      websiteUrl: "#", // SUBSTITUA
    },
    {
      id: "p2",
      name: "Clínica Vet+ Saúde",
      logoUrl: "/logo.png", // SUBSTITUA - Ex: /parceiros/vet-mais-logo.png
      description: "Consultas, vacinas, exames e emergências 24h para seu animal.",
      websiteUrl: "#", // SUBSTITUA
    },
    {
      id: "p3",
      name: "Adestra Cão Feliz",
      logoUrl: "/logo.png", // SUBSTITUA - Ex: /parceiros/adestra-cao-logo.png
      description: "Adestramento comportamental positivo para cães de todas as idades.",
      websiteUrl: "#", // SUBSTITUA
    },
     {
      id: "p4",
      name: "Hotel Pet Relax",
      logoUrl: "/logo.png", // SUBSTITUA
      description: "Hospedagem segura e divertida para seu pet enquanto você viaja.",
      websiteUrl: "#", // SUBSTITUA
    },
     {
      id: "p5",
      name: "Rações NutriPet",
      logoUrl: "/logo.png", // SUBSTITUA
      description: "Alimentação balanceada e de alta qualidade para cães e gatos.",
      websiteUrl: "#", // SUBSTITUA
    },
     {
      id: "p6",
      name: "Pet Store Online",
      logoUrl: "/logo.png", // SUBSTITUA
      description: "Acessórios, brinquedos e produtos de higiene entregues em casa.",
      websiteUrl: "#", // SUBSTITUA
    },
  ];

  return (
    <div className={styles.partnersPage}>
      {/* --- Cabeçalho --- */}
      <div className={styles.header}>
        <h1 className={styles.title}>Nossos Parceiros</h1>
        <p className={styles.subtitle}>
          Conheça a rede de estabelecimentos e serviços que oferecem benefícios exclusivos para membros MyPetZone.
        </p>
      </div>

      {/* --- Grade de Parceiros --- */}
      <div className={styles.partnersGrid}>
        {partners.map((partner) => (
          <div key={partner.id} className={styles.partnerCard}>
            <div className={styles.logoWrapper}>
              <Image 
                src={partner.logoUrl} 
                alt={`Logo ${partner.name}`} 
                width={80} // Defina uma largura base
                height={80} // Defina uma altura base
                style={{ objectFit: 'contain' }} // Garante que caiba
              />
            </div>
            <h2 className={styles.partnerName}>{partner.name}</h2>
            <p className={styles.partnerDescription}>{partner.description}</p>
            
            {/* Link externo abre em nova aba */}
            <Link 
              href={partner.websiteUrl} 
              target="_blank" // Abre em nova aba
              rel="noopener noreferrer" // Segurança para links externos
              className={styles.visitButton}
            >
              Visitar Site
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}