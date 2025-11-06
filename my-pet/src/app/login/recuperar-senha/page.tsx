"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 1. Importe o useRouter
import styles from './page.module.css';
import { FaEnvelope } from 'react-icons/fa';

// 2. Não precisamos mais da API real por enquanto
// import { requestPasswordReset } from '@/lib/api'; 

export default function RecuperarSenhaPage() {
  const router = useRouter(); // 3. Inicialize o router
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 4. Não precisamos mais da mensagem de sucesso (vamos redirecionar)
  // const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => { // 5. Removido 'async'
    e.preventDefault();
    setError(null);

    // Validação simples (continua igual)
    if (!email) {
      setError("Por favor, insira seu e-mail.");
      return;
    }

    setLoading(true);

    // --- INÍCIO DA SIMULAÇÃO ---
    // Em vez de chamar a API no 'try/catch'
    
    console.log("SIMULAÇÃO: Solicitando reset para:", email);
    
    // 6. Crie um token falso
    const fakeToken = "SIMULATED_TOKEN_12345_TESTE";
    
    // 7. Simule um pequeno atraso (para o "Loading..." aparecer)
    setTimeout(() => {
      // 8. Redirecione para a próxima página com o token falso
      router.push(`/login/resetar-senha?token=${fakeToken}`);
      
      // Não precisamos do setLoading(false) pois a página mudará
    }, 1500); // Atraso de 1.5 segundos
    
    // --- FIM DA SIMULAÇÃO ---
  };

  return (
    <div className={styles.recoveryPage}>
      <div className={styles.recoveryCard}>
        <h1 className={styles.title}>Recuperar Senha</h1>
        <p className={styles.subtitle}>
          Insira seu e-mail para receber o link de recuperação.
        </p>

        {/* 9. O formulário agora está sempre visível (removemos a lógica de sucesso) */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}><FaEnvelope /></span>
            <input 
              type="email" 
              placeholder="Seu e-mail" 
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar link'}
          </button>
        </form>
        
        <Link href="/login" className={styles.backLink}>
          Voltar para o Login
        </Link>
      </div>
    </div>
  );
}