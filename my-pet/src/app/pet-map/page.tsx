"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; // Para carregar o mapa dinamicamente
import styles from './page.module.css';

// 1. Importe a API
import { getCompanies, UserResponse } from '@/lib/api'; 
// (Se sua pasta for 'Lib', use '@/Lib/api')

// 2. Importe o CSS do Leaflet (CRUCIAL!)
// Precisamos "enganar" o Next.js para importar o CSS apenas no cliente
if (typeof window !== 'undefined') {
  require('leaflet/dist/leaflet.css');
}

// 3. Carregue o Mapa dinamicamente (para evitar erros de SSR)
// Isso garante que o componente do mapa só seja carregado no navegador
const MapComponent = dynamic(
  () => import('@/componentes/features/mapa'), // Vamos criar este componente
  { 
    ssr: false, // Desabilita a renderização no servidor
    loading: () => <p className={styles.loadingText}>Carregando mapa...</p> 
  }
);

export default function PetMapPage() {
  // Estado para os dados da API
  const [locations, setLocations] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 4. Buscar os dados (parceiros) da API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // (Isso SÓ vai funcionar depois que o CORS for resolvido)
        const companies = await getCompanies();
        
        // Filtra apenas empresas que têm endereço e coordenadas
        const validLocations = companies.filter(
          comp => comp.address && comp.address.latitude && comp.address.longitude
        );
        
        setLocations(validLocations);

      } catch (err: any) {
        console.error("Erro ao buscar parceiros:", err);
        // O erro mais provável aqui será o CORS
        if (err.message.includes('Failed to fetch')) {
          setError("Erro de conexão com a API. (Verifique o CORS no back-end!)");
        } else {
          setError(err.message || "Não foi possível carregar os parceiros.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Pet Map</h1>
        <p className={styles.subtitle}>
          Encontre pet shops, clínicas e parceiros perto de você.
        </p>
      </div>

      <div className={styles.mapWrapper}>
        {loading && <p className={styles.loadingText}>Buscando parceiros...</p>}
        
        {error && <p className={styles.errorText}>{error}</p>}

        {!loading && !error && (
          // 5. Renderiza o mapa dinâmico
          <MapComponent locations={locations} />
        )}
      </div>
    </div>
  );
}