// src/components/MapComponent/MapComponent.tsx
import React, { useState, useEffect } from 'react';
// IMPORTANTE: Em um projeto real, você precisaria importar um pacote de mapa como 'leaflet' ou 'react-google-maps'.

interface PetLocation {
    id: number;
    latitude: number;
    longitude: number;
    name: string; // Ex: Nome do Abrigo ou Pet
}

const Mapa: React.FC = () => {
    const [locations, setLocations] = useState<PetLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Função para buscar dados na API Java/Spring Boot
        const fetchMapData = async () => {
            try {
                // SUBSTITUA PELA URL REAL DA SUA API SPRING BOOT
                const response = await fetch('SUA_URL_DA_API/api/locations', {
                    headers: {
                        // Incluir o token de autorização da sua API, se necessário!
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}` 
                    }
                }); 
                
                if (!response.ok) {
                    throw new Error('Falha ao buscar dados do mapa.');
                }
                
                const data: PetLocation[] = await response.json();
                setLocations(data);

            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchMapData();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Carregando dados do mapa...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Erro ao carregar o mapa: {error}</div>;

    return (
        <div className="map-placeholder" style={{ height: '100%', width: '100%', backgroundColor: '#e6e6e6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/* Aqui ficaria a lógica para renderizar o mapa (Leaflet/Google Maps) */}
            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Mapa Interativo (Renderizado)</p>
            <p>Pontos Carregados da API ({locations.length}):</p>
            <ul>
                {locations.map(loc => (
                    <li key={loc.id}>{loc.name} - Lat: {loc.latitude}</li>
                ))}
            </ul>
        </div>
    );
};

export default Mapa;