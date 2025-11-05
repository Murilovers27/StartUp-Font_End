"use client"; 

import Link from 'next/link';
// 1. IMPORTA O CSS (Passo crucial que pode ter faltado)
import styles from './page.module.css'; 
import { FaMapMarkedAlt, FaStar, FaUser } from 'react-icons/fa';

// 2. IMPORTA O PETCARD (com o caminho 'componentes' minúsculo)
import PetCard from '@/componentes/features/petCard';

// Interface para definir o formato dos nossos dados mockados
interface PetData {
  id: string; 
  name: string;
  species: string;
  age: string;
  location: string;
  photoUrl: string;
}

// Componente da Home Page
export default function HomePage() {
  
  // 3. DADOS MOCKADOS 
  // (Verifique se essas imagens existem na sua pasta /public)
  const pets: PetData[] = [
    { id: "1", name: "Rex", species: "Cachorro", age: "2 anos", location: "São Paulo, SP", photoUrl: "/rex.png" },
    { id: "2", name: "Mimi", species: "Gato", age: "1 ano", location: "Rio de Janeiro, RJ", photoUrl: "/mimi.png" },
    { id: "3", name: "Charlie", species: "Cachorro", age: "6 meses", location: "Curitiba, PR", photoUrl: "/charlie.png" },
    { id: "4", name: "Pablito", species: "Gato", age: "8 meses", location: "Belo Horizonte, MG", photoUrl: "/pablito.png" },
  ];

  // 4. ESTRUTURA TSX (Usando {styles.nomeDaClasse})
  return (
    <div className={styles.pageContainer}>
      
      {/* --- 1. Seção Hero --- */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>MyPetZone</h1>
          <p className={styles.heroSubtitle}>
            Tudo o que seu melhor amigo precisa em um só lugar.
          </p>
        </div>
      </section>

      {/* --- 2. Banner de 3 Cards Clicáveis --- */}
      <section className={styles.featureBanner}>
        <div className={styles.bannerGrid}>
          
          <Link href="/pet-map" className={styles.bannerCardLink}>
            <FaMapMarkedAlt className={styles.bannerIcon} />
            <div className={styles.bannerCardContent}>
              <h3>Pet map</h3>
              <p>Encontre o melhor lugar para seu pet</p>
            </div>
          </Link>
          
          <Link href="/planos" className={styles.bannerCardLink}>
            <FaStar className={styles.bannerIcon} />
            <div className={styles.bannerCardContent}>
              <h3>Pet Star</h3>
              <p>Se torne um pet star e obtenha benefícios</p>
            </div>
          </Link>
          
          <Link href="/login/pagina-usuario" className={styles.bannerCardLink}>
            <FaUser className={styles.bannerIcon} />
            <div className={styles.bannerCardContent}>
              <h3>Pet zone</h3>
              <p>Consulte as informações da sua conta</p>
            </div>
          </Link>

        </div>
      </section>

      {/* --- 3. Seção "Sobre" --- */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutCard}>
          <h2>Sobre</h2>
          <p>
            Cansado de usar vários aplicativos para gerenciar a vida do seu pet? O MyPetZone nasceu para resolver exatamente essa dificuldade, atuando como uma plataforma digital que centraliza, organiza e simplifica o acesso a serviços e informações para tutores de animais deestimação.
          </p>
        </div>
      </section>

      {/* --- 4. Seção "Destaques da Semana" (PetCards) --- */}
      <section className={styles.petListingsSection}>
        <h2 className={styles.sectionTitle}>Destaques da Semana</h2>
        
        <div className={styles.petGrid}>
          {/* Mapeando os dados mockados para o componente PetCard */}
          {pets.map((pet) => (
            <PetCard 
              key={pet.id} 
              petId={pet.id} 
              name={pet.name}
              species={pet.species}
              age={pet.age}
              location={pet.location}
              photoUrl={pet.photoUrl} 
            />
          ))}
        </div>
      </section>
      
    </div>
  );
};