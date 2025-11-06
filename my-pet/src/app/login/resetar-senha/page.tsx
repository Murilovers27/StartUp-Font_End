"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation'; // Para ler o token da URL
import styles from './page.module.css';
import { FaLock } from 'react-icons/fa';


// 1. Importe a nova função da API
import { resetPassword } from '@/lib/api'; 
// (Se sua pasta for 'Lib' maiúsculo, use '@/Lib/api')


// O Next.js exige que 'useSearchParams' seja usado dentro de <Suspense>
// Então, criamos um componente interno para isso.
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter(); // (Opcional, se quisermos redirecionar)

  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 2. Quando a página carregar, pegue o token da URL
  useEffect(() => {
    const tokenDaUrl = searchParams.get('token');
    if (tokenDaUrl) {
      setToken(tokenDaUrl);
    } else {
      setError("Token de redefinição não encontrado ou inválido.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // 3. Validações
    if (!password || !confirmPassword) {
      setError("Por favor, preencha e confirme a nova senha.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }
    if (!token) {
      setError("Token inválido. Solicite um novo link.");
      return;
    }

    setLoading(true);

    try {
      // 4. Chame a API
      // (A API do back-end deve esperar 'novaSenha' ou 'password')
      await resetPassword({ token, novaSenha: password });
      
      // 5. SUCESSO
      setSuccessMessage("Senha redefinida com sucesso! Você já pode fazer login.");
      setLoading(false);

    } catch (err: any) {
      // 6. ERRO
      console.error("Erro ao resetar senha:", err);
      setLoading(false);
      setError(err.message || "Não foi possível redefinir a senha. O token pode ter expirado.");
    }
  };

  return (
    <div className={styles.resetCard}>
      <h1 className={styles.title}>Crie sua nova senha</h1>

      {successMessage ? (
        // Se deu certo, mostra o sucesso e o link de login
        <div>
          <p className={styles.successMessage}>{successMessage}</p>
          <Link href="/login" className={styles.backLink}>
            Ir para o Login
          </Link>
        </div>
      ) : (
        // Se ainda não, mostra o formulário
        <>
          <p className={styles.subtitle}>
            Digite e confirme sua nova senha.
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <span className={styles.inputIcon}><FaLock /></span>
              <input 
                type="password" 
                placeholder="Nova Senha" 
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className={styles.inputGroup}>
              <span className={styles.inputIcon}><FaLock /></span>
              <input 
                type="password" 
                placeholder="Confirme a Nova Senha" 
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Mostra erro do token OU erro de validação */}
            {error && <p className={styles.errorMessage}>{error}</p>}

            <button 
              type="submit" 
              className={styles.submitButton} 
              disabled={loading || !token} // Desabilita se estiver carregando OU se não houver token
            >
              {loading ? 'Salvando...' : 'Salvar Nova Senha'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}


// Componente principal (Wrapper)
export default function ResetarSenhaPage() {
  return (
    <div className={styles.resetPage}>
      {/* O Suspense é obrigatório pelo Next.js para usar useSearchParams */}
      <Suspense fallback={<div>Carregando...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}