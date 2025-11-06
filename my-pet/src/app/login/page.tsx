"use client"; 

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 1. Importado para redirecionar
import styles from './page.module.css';

// 2. Importe a função de login (use 'lib' ou 'Lib' maiúsculo, conforme sua pasta)
import { loginUser } from '@/lib/api'; 
import { FaUser, FaLock } from 'react-icons/fa'; // Re-adicionando ícones (opcional)

// (Seu código usou React.FC, mantive, mas pode ser removido se preferir)
const LoginPage: React.FC = () => {
  const router = useRouter(); // Hook para navegação

  // 3. Estados de controle
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Para feedback de carregamento
  const [error, setError] = useState<string | null>(null); // Para exibir erros

  // 4. Lógica de handleSubmit atualizada
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpa erros anteriores

    // REQUISITO 1: Não avançar se campos vazios
    if (!email || !password) {
      setError("Por favor, preencha o e-mail e a senha.");
      return; // Para a execução
    }

    setLoading(true);

    try {
      // Tenta fazer o login
      const response = await loginUser({ email, password });

      // SUCESSO! (Salvar o token, etc.)
      console.log("Login bem-sucedido:", response.token);
      
      // Redireciona para a página do usuário
      router.push('/login/pagina-usuario'); 

    } catch (err: any) {
      // REQUISITO 2: Erro da API (ex: senha errada)
      console.error("Falha no login:", err);
      setError(err.message || "E-mail ou senha incorretos.");
    } finally {
      setLoading(false); // Libera o botão
    }
  };

  return (
    // Usei suas classes originais: 'loginPageContainer' e 'loginFormWrapper'
    <div className={styles.loginPageContainer}>
      
      <div className={styles.loginFormWrapper}>
        <h1 className={styles.loginTitle}>Acessar MyPetZone</h1>
        <p className={styles.loginSubtitle}>Bem-vindo de volta!</p>
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          
          {/* (Opcional) Adicionando os ícones de volta com 'inputGroup' */}
          <div className={styles.inputGroup}>
            <input 
              type="email" 
              placeholder="E-mail" 
              // 'required' é bom, mas a validação no 'handleSubmit' dá melhor feedback
              className={styles.loginInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading} // Desabilita durante o carregamento
            />
          </div>

          <div className={styles.inputGroup}>
            <input 
              type="password" 
              placeholder="Senha" 
              className={styles.loginInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading} // Desabilita durante o carregamento
            />
          </div>

          {/* 5. Exibição da Mensagem de Erro */}
          {error && (
            <p className={styles.errorMessage}>{error}</p>
          )}

          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading} // Desabilita o botão
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* 6. Container para os links */}
        <div className={styles.linksContainer}>
          
          {/* REQUISITO 3: Link "Esqueci a senha" */}
          <Link href="/login/recuperar-senha" className={styles.forgotPasswordLink}>
            Esqueci a senha
          </Link>

          <p className={styles.signupLink}>
            Não tem conta? 
            <Link href="/login/cadastro"> Cadastre-se</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;