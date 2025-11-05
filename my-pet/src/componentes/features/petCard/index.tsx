// src/componentes/features/petCard/index.tsx

import Image from 'next/image';
import Link from 'next/link';
// Importa o CSS com o nome correto
import styles from './page.module.css';

// 1. Define a interface de PROPS (Isso corrige o erro "IntrinsicAttributes")
interface PetCardProps {
  petId: string; // ID para o link
  name: string;
  species: string;
  age: string;
  location: string;
  photoUrl: string;
}

// 2. Aceita as props
const PetCard = ({ petId, name, species, age, location, photoUrl }: PetCardProps) => {
  
  return (
    // 3. Usa as props para preencher o card
    <Link href={`/pets/${petId}`} className={styles.petCard}>
      <div className={styles.petImageContainer}>
        <Image
          src={photoUrl}
          alt={`Foto do ${name}`}
          fill 
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className={styles.petInfo}>
        <h3 className={styles.petName}>{name}</h3>
        <p className={styles.petDetails}>{species} • {age}</p>
        <p className={styles.petLocation}>{location}</p>
      </div>
    </Link>
  );
};

export default PetCard;