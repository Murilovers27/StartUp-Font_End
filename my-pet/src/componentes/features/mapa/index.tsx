// src/componentes/features/mapa/index.tsx

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { UserResponse } from '@/lib/api'; // Importa a interface
import { Icon } from 'leaflet'; // Para o ícone customizado
import styles from './mapa.module.css'; // Usaremos o CSS da página principal

// Posição inicial do mapa (ex: centro de São Paulo)
const initialPosition: [number, number] = [-23.5505, -46.6333];
const initialZoom = 12;

// Define um ícone customizado (o padrão do Leaflet é feio)
const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Interface para as props que este componente recebe
interface MapProps {
  locations: UserResponse[];
}

const Map = ({ locations }: MapProps) => {
  return (
    <MapContainer 
      center={initialPosition} 
      zoom={initialZoom} 
      scrollWheelZoom={true} 
      className={styles.leafletContainer} // Usa a classe do CSS da página
    >
      {/* Camada de "fundo" do mapa (OpenStreetMap é gratuito) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Mapeia os locais da API para "Pinos" (Markers) no mapa */}
      {locations.map(location => (
        <Marker 
          key={location.id}
          // @ts-ignore (Garante que o TS aceite lat/long, que podem ser string ou num)
          position={[location.address.latitude, location.address.longitude]}
          icon={customIcon}
        >
          <Popup>
            <div className={styles.popupContent}>
              <h3>{location.tradeName || location.name}</h3>
              <p>{location.address.street}, {location.address.number}</p>
            </div>
          </Popup>
        </Marker>
      ))}

    </MapContainer>
  );
};

export default Map;