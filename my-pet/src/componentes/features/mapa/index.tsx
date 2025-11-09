// src/componentes/features/mapa/index.tsx

import 'leaflet/dist/leaflet.css'; // Importa o CSS aqui
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Company } from '@/lib/interfaces'; // <-- 1. Usa a nova interface 'Company'
import { Icon } from 'leaflet';
import styles from './mapa.module.css'; // (Presumo que este CSS exista)

// Posição inicial do mapa (ex: centro de São Paulo)
const initialPosition: [number, number] = [-23.5505, -46.6333];
const initialZoom = 12;

// Ícone customizado (sem alteração)
const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// 2. Interface de Props atualizada
interface MapProps {
  locations: Company[];
}

const Map = ({ locations }: MapProps) => {
  return (
    <MapContainer 
      center={initialPosition} 
      zoom={initialZoom} 
      scrollWheelZoom={true} 
      className={styles.leafletContainer}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* 3. Mapeia os locais */}
      {locations.map(location => (
        // Garante que a localização tenha os dados necessários
        (location.address && location.address.latitude && location.address.longitude) && (
          <Marker 
            key={location.id}
            position={[location.address.latitude, location.address.longitude]}
            icon={customIcon}
          >
            <Popup>
              {/* Usa o CSS da página principal ou o seu próprio */}
              <div className={styles.popupContent}> 
                {/* Usa 'tradeName' (Nome Fantasia) que vem da API */}
                <h3>{location.tradeName || location.companyName || location.name}</h3>
                <p>{location.address.street}, {location.address.number}</p>
              </div>
            </Popup>
          </Marker>
        )
      ))}

    </MapContainer>
  );
};

export default Map;