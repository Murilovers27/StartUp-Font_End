"use client";

import { useState } from 'react'; // 1. Importe useState
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import {
  FaArrowLeft, FaIdCard, FaEnvelope, FaMapMarkerAlt, FaPhone,
  FaBirthdayCake, FaPaw, FaKey, FaPencilAlt, FaEye, FaChevronDown, FaChevronUp // 2. Adicione FaChevronUp
} from 'react-icons/fa';

// 3. (Exemplo) Interface e dados dos pets do usuário
interface UserPet {
  id: string; // ID único para a URL
  name: string;
  // Outros dados do pet podem vir aqui no futuro
}

export default function ProfilePage() {
  // 4. Estado para controlar o dropdown de pets
  const [isPetDropdownOpen, setIsPetDropdownOpen] = useState(false);

  // Dados do usuário (mantidos)
  const userData = {
    name: "Seu Nome",
    cpf: "123.456.789-00",
    email: "email@example.com",
    endereco: "Rua das Flores, 123",
    telefone: "(11) 98765-4321",
    nascimento: "01/01/1990",
  };

  // 5. Dados de exemplo dos pets do usuário
  const userPets: UserPet[] = [
    { id: "1", name: "Rex (Cachorro)" },
    { id: "2", name: "Mimi (Gato)" },
  ];

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>
        
        {/* --- Cabeçalho (igual) --- */}
        <div className={styles.header}>
          <Link href="/" className={styles.backButton}>
            <FaArrowLeft />
          </Link>
          <div className={styles.avatarWrapper}>
            <Image src="/logo.png" alt="Foto do Perfil" width={120} height={120} />
          </div>
          <h1 className={styles.userName}>{userData.name}</h1>
        </div>

        {/* --- Lista de Campos --- */}
        <div className={styles.fieldList}>
          {/* ... (Campos CPF, Email, Endereço, Telefone, Nascimento - ficam iguais) ... */}
          <div className={`${styles.fieldItem} ${styles.highlighted}`}>...CPF...</div>
          <div className={styles.fieldItem}>...EMAIL...</div>
          <div className={styles.fieldItem}>...ENDEREÇO...</div>
          <div className={styles.fieldItem}>...TELEFONE...</div>
          <div className={styles.fieldItem}>...DATA DE NASCIMENTO...</div>


          {/* --- MEUS PETS (AGORA COM onClick E DROPDOWN) --- */}
          <div 
            className={`${styles.fieldItem} ${styles.clickable}`} // Adiciona cursor pointer
            onClick={() => setIsPetDropdownOpen(!isPetDropdownOpen)} // 6. Alterna o estado
          >
            <span className={styles.fieldIcon}><FaPaw /></span>
            <span className={styles.fieldLabel}>Meus pets</span>
            {/* 7. Muda o ícone da seta baseado no estado */}
            <span className={styles.actionIcon}>
              {isPetDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>

          {/* 8. Renderização Condicional do Dropdown */}
          {isPetDropdownOpen && (
            <div className={styles.petDropdown}>
              <ul>
                {userPets.length > 0 ? (
                  userPets.map(pet => (
                    <li key={pet.id}>
                      {/* 9. Link para o perfil do pet (rota dinâmica) */}
                      <Link href={`/pets/${pet.id}`} className={styles.dropdownItem}>
                        {pet.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className={styles.noPetsMessage}>Nenhum pet cadastrado.</li>
                )}
                {/* Você pode adicionar um link "+ Adicionar Pet" aqui */}
              </ul>
            </div>
          )}
          {/* --- FIM DO DROPDOWN --- */}

          {/* EDITAR SENHA (igual) */}
          <div className={styles.fieldItem}>
            <span className={styles.fieldIcon}><FaKey /></span>
            <span className={styles.fieldLabel}>Editar senha</span>
            <span className={styles.actionIcon}><FaEye /></span>
          </div>

        </div>
      </div>
    </div>
  );
}