"use client"; 

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import styles from './page.module.css';
import { loginUser } from '@/lib/api'; 
// 1. NOVO: Importe os ícones de olho
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; 

const LoginPage: React.FC = () => {
  const router = useRouter(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  // 2. NOVO: Estado para controlar a visibilidade da senha
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 

    if (!email || !password) {
      setError("Por favor, preencha o e-mail e a senha.");
      return; 
    }

    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      console.log("Login bem-sucedido:", response.token);
      router.push('/login/pagina-usuario'); 

    } catch (err: any) {
      console.error("Falha no login:", err);
      setError(err.message || "E-mail ou senha incorretos.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.loginFormWrapper}>
        <h1 className={styles.loginTitle}>Acessar MyPetZone</h1>
        <p className={styles.loginSubtitle}>Bem-vindo de volta!</p>
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}><FaUser /></span>
            <input 
              type="email" 
              placeholder="E-mail" 
              className={styles.loginInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading} 
            />
          </div>

          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}><FaLock /></span>
            <input 
              // 3. NOVO: O 'type' agora é dinâmico
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha" 
              className={styles.loginInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {/* 4. NOVO: Botão que alterna o estado */}
            <button
              type="button" 
              className={styles.passwordToggleIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && (
            <p className={styles.errorMessage}>{error}</p>
          )}

          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className={styles.linksContainer}>
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