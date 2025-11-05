"use client"; // Pode ser server component se os dados forem estáticos

import Link from 'next/link';
import Image from 'next/image'; // Para avatares
import styles from './page.module.css';
import { FaLinkedin, FaInstagram, FaEnvelope, FaUser, FaBriefcase } from 'react-icons/fa'; // Ícones (adicionei Briefcase para Portfolio)

// 1. Interface para definir a estrutura de um membro da equipe
interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string; // Caminho para foto em /public/ (opcional)
  linkedinUrl: string;
  instagramUrl: string;
  contactLink: string; // Pode ser mailto: email@example.com ou link de portfolio
  contactText?: string; // Texto do botão de contato (ex: "Email", "Portfolio")
  contactIcon?: React.ElementType; 
  avatarIcon?: string;// Ícone customizado para o botão de contato
}

export default function ContatosPage() {

  // 2. Dados de exemplo da equipe (SUBSTITUA PELOS DADOS REAIS)
  const teamMembers: TeamMember[] = [
    {
      id: "m1",
      name: "Giovane Ferrari",
      role: "Scrum Master",
      // avatarUrl: "/equipe/scrum.jpg", // Exemplo
      linkedinUrl: "https://www.linkedin.com/in/seu-usuario/",
      instagramUrl: "https://www.instagram.com/seu-usuario/",
      contactLink: "mailto:scrum@example.com",
      contactText: "Email",
      avatarIcon: "..//../../../public/equipe/scrum.jpg",
      contactIcon: FaEnvelope
    },
    {
      id: "m2",
      name: "Murilo Cruz",
      role: "Desenvolvedor Front-End",
      linkedinUrl: "https://www.linkedin.com/in/muril0pires",
      instagramUrl: "",
      contactLink: "mailto:murilopiresandradecruz27@gmail.com",
      contactText: "Email",
      contactIcon: FaEnvelope
    },
    {
      id: "m3",
      name: "João Iauch", // Ou outra função
      role: "QA",
      linkedinUrl: "https://www.linkedin.com/in/seu-usuario/",
      instagramUrl: "https://www.instagram.com/seu-usuario/",
      contactLink: "mailto:frontend2@example.com",
      contactText: "Email",
      contactIcon: FaEnvelope
    },
     {
      id: "m4",
      name: "Vinicius Pantoja",
      role: "Desenvolvedor Back-End",
      linkedinUrl: "https://www.linkedin.com/in/seu-usuario/",
      instagramUrl: "https://www.instagram.com/seu-usuario/",
      contactLink: "mailto:backend@example.com",
      contactText: "Email",
      contactIcon: FaEnvelope
    },
     {
      id: "m5",
      name: "Luiz Fernando",
      role: "DevOps",
      linkedinUrl: "https://www.linkedin.com/in/seu-usuario/",
      instagramUrl: "https://www.instagram.com/seu-usuario/",
      contactLink: "mailto:devops@example.com",
      contactText: "Email",
      contactIcon: FaEnvelope
    },
     {
      id: "m6",
      name: "Enzo Willian",
      role: "UI/UX Designer",
      linkedinUrl: "https://www.linkedin.com/in/seu-usuario/",
      instagramUrl: "https://www.instagram.com/seu-usuario/",
      contactLink: "https://behance.net/seu-usuario", // Exemplo de Portfolio
      contactText: "Portfolio", // Texto ajustado
      contactIcon: FaBriefcase // Ícone ajustado
    },
  ];

  return (
    <div className={styles.teamPage}>
      {/* --- Cabeçalho --- */}
      <div className={styles.header}>
        <h1 className={styles.title}>Nossa Equipe</h1>
        <p className={styles.subtitle}>
          Conheça as pessoas que fazem o MyPetZone acontecer. Estamos aqui para ajudar!
        </p>
      </div>

      {/* --- Grade da Equipe --- */}
      <div className={styles.teamGrid}>
        {teamMembers.map((member) => {
          // Define o ícone de contato padrão ou o customizado
          const ContactIcon = member.contactIcon || FaEnvelope; 
          return (
            <div key={member.id} className={styles.memberCard}>
              
              {/* Avatar */}
              <div className={styles.avatar}>
                {member.avatarUrl ? (
                  <Image src={member.avatarUrl} alt={`Foto de ${member.name}`} width={100} height={100} />
                ) : (
                  // Placeholder se não houver foto
                  <FaUser style={{ fontSize: '3rem', color: 'var(--text-light)' }} /> 
                )}
              </div>

              {/* Nome e Função */}
              <h2 className={styles.memberName}>{member.name}</h2>
              <p className={styles.memberRole}>{member.role}</p>

              {/* Links */}
              <div className={styles.memberLinks}>
                {/* LinkedIn */}
                <Link href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className={`${styles.linkButton} ${styles.linkedin}`}>
                  <FaLinkedin className={styles.linkIcon} /> LinkedIn
                </Link>

                {/* Instagram */}
                <Link href={member.instagramUrl} target="_blank" rel="noopener noreferrer" className={`${styles.linkButton} ${styles.instagram}`}>
                  <FaInstagram className={styles.linkIcon} /> Instagram
                </Link>

                {/* Contato Profissional */}
                <Link href={member.contactLink} target="_blank" rel="noopener noreferrer" className={`${styles.linkButton} ${styles.contact}`}>
                  <ContactIcon className={styles.linkIcon} /> 
                  {member.contactText || "Contato"} 
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}