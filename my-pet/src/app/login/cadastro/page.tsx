"use client";

import Link from 'next/link';
import styles from './page.module.css';
import { FaUser, FaBuilding } from 'react-icons/fa'; // Ícones para cliente e empresa

export default function CadastroHubPage() {
  return (
    <div className={styles.hubPageContainer}>
      <div className={styles.hubCard}>
        <h1 className={styles.title}>Crie sua Conta</h1>
        <p className={styles.subtitle}>
          Para começar, selecione o tipo de conta que deseja criar.
        </p>

        <div className={styles.choiceContainer}>
          {/* Card de Escolha: Cliente */}
          <Link href="/login/cadastro/cliente" className={styles.choiceCard}>
            <FaUser className={styles.choiceIcon} />
            <h2 className={styles.choiceTitle}>Sou Cliente</h2>
            <p className={styles.choiceDescription}>
              Quero cadastrar meus pets, encontrar serviços e gerenciar
              carteirinhas.
            </p>
            <span className={styles.choiceButton}>Criar Conta de Cliente</span>
          </Link>

          {/* Card de Escolha: Empresa */}
          <Link href="/login/cadastro/empresa" className={styles.choiceCard}>
            <FaBuilding className={styles.choiceIcon} />
            <h2 className={styles.choiceTitle}>Sou Empresa</h2>
            <p className={styles.choiceDescription}>
              Quero cadastrar meu negócio (Pet Shop, Clínica, Hotel) e ser
              encontrado no mapa.
            </p>
            <span className={styles.choiceButton}>Criar Conta de Empresa</span>
          </Link>
        </div>

        <div className={styles.loginLink}>
          <p>
            Já tem uma conta?{' '}
            <Link href="/login">
              <span>Acesse aqui</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}