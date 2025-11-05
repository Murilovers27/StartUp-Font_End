"use client"; // Pode precisar de interação no futuro

import Link from 'next/link'; // Para o botão
import styles from './page.module.css';
import { FaCheckCircle } from 'react-icons/fa'; // Ícone para features

// 1. Interface para definir a estrutura de um plano
interface Plan {
  id: string;
  name: string;
  price: string;
  frequency: string; // ex: "/mês"
  features: string[];
  isFeatured?: boolean; // Para o destaque
}

export default function PlanosPage() {

  // 2. Dados de exemplo dos planos
  const plans: Plan[] = [
    {
      id: "bronze",
      name: "Pet Star Bronze",
      price: "R$ 19,90",
      frequency: "/mês",
      features: [
        "Descontos básicos em parceiros",
        "Acesso ao PetMap",
        "Lembretes de vacinação",
      ],
    },
    {
      id: "prata",
      name: "Pet Star Prata",
      price: "R$ 39,90",
      frequency: "/mês",
      features: [
        "Descontos médios em parceiros",
        "Acesso ao PetMap",
        "Lembretes de vacinação e vermifugação",
        "Suporte prioritário",
        "Distintivo 'Pet Star Prata' no perfil",
      ],
      isFeatured: true, // Marcar como destaque
    },
    {
      id: "ouro",
      name: "Pet Star Ouro",
      price: "R$ 69,90",
      frequency: "/mês",
      features: [
        "Descontos premium em parceiros",
        "Acesso ao PetMap + filtros avançados",
        "Histórico completo na Carteirinha Digital",
        "Teleconsulta veterinária (1/mês)",
        "Distintivo 'Pet Star Ouro' no perfil",
      ],
    },
  ];

  return (
    <div className={styles.plansPage}>
      {/* --- Cabeçalho --- */}
      <div className={styles.header}>
        <h1 className={styles.title}>Seja um Pet Star!</h1>
        <p className={styles.subtitle}>
          Escolha o plano ideal para você e seu pet e aproveite benefícios exclusivos em nossa rede de parceiros.
        </p>
      </div>

      {/* --- Grade de Planos --- */}
      <div className={styles.plansGrid}>
        {plans.map((plan) => (
          // Aplica a classe 'featuredCard' se 'isFeatured' for true
          <div 
            key={plan.id} 
            className={`${styles.planCard} ${plan.isFeatured ? styles.featuredCard : ''}`}
          >
            <h2 className={styles.planName}>{plan.name}</h2>
            <p className={styles.planPrice}>
              {plan.price} <span>{plan.frequency}</span>
            </p>
            
            <ul className={styles.planFeatures}>
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <span className={styles.featureIcon}><FaCheckCircle /></span> 
                  {feature}
                </li>
              ))}
            </ul>

            {/* O botão pode levar para o cadastro ou checkout */}
            <Link href="/login/cadastro" passHref> 
              <button className={styles.selectButton}>
                Assinar Agora
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}