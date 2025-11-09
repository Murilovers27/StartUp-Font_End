"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; // Para carregar o mapa dinamicamente
import styles from './page.module.css';

// 1. Importa o NOVO companyService e a interface
import { companyService } from '@/lib/companyService';
import { Company } from '@/lib/interfaces'; 
// (A linha 'import { MapContainer... }' foi REMOVIDA daqui)

// (O 'getCompanies' e 'UserResponse' do 'api.ts' antigo são removidos)

// 2. Carrega o CSS do Leaflet (isto está no componente do mapa, mas pode ficar aqui também por segurança)
// (Já removemos o 'if (typeof window...)' que dava erro)


// 3. Carrega o Mapa dinamicamente (sem alteração)
const MapComponent = dynamic(
  () => import('@/componentes/features/mapa'), 
  { 
    ssr: false,
    loading: () => <p className={styles.loadingText}>A carregar mapa...</p> 
  }
);

export default function PetMapPage() {
  // 4. O estado agora usa a nova interface 'Company'
  const [locations, setLocations] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 5. O useEffect foi ATUALIZADO para usar o 'companyService'
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // CHAMA O NOVO SERVIÇO
        const companies = await companyService.getCompanies();
        
        // Filtra apenas empresas que têm endereço e coordenadas
        const validLocations = companies.filter(
          comp => comp.address && comp.address.latitude && comp.address.longitude
        );
        
        setLocations(validLocations);

      } catch (err: any) {
        console.error("Erro ao procurar parceiros:", err);
        // O 'companyService' já lança uma mensagem de erro tratada
        setError(err.message || "Não foi possível carregar os parceiros.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []); // O 'useEffect' corre uma vez no carregamento

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Pet Map</h1>
        <p className={styles.subtitle}>
          Encontre pet shops, clínicas e parceiros perto de si.
        </p>
      </div>

      <div className={styles.mapWrapper}>
        {loading && <p className={styles.loadingText}>A procurar parceiros...</p>}
        
        {error && <p className={styles.errorText}>{error}</p>}

        {!loading && !error && (
          // 6. O MapComponent precisa de receber a nova interface 'Company'
          // Vamos atualizar o componente do mapa a seguir
          <MapComponent locations={locations} />
        )}
      </div>
    </div>
  );
}