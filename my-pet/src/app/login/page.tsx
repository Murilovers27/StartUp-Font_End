"use client"; 

import React, { useState } from 'react';
import Link from 'next/link'; // Importe o Link para navegação

// 1. Importe o CSS Module
import styles from './page.module.css';

// 2. Renomeie as classes para usar o objeto 'styles'
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Tentativa de login:', { email, password });
    alert('Tentativa de Login efetuada. (A lógica real virá depois!)');
  };

  return (
    // 'styles.loginPageContainer' em vez de "login-page-container"
    <div className={styles.loginPageContainer}>
      
      {/* 3. Coloquei o formulário dentro de um "wrapper" (o card) */}
      <div className={styles.loginFormWrapper}>
        <h1 className={styles.loginTitle}>Acessar MyPetZone</h1>
        <p className={styles.loginSubtitle}>Bem-vindo de volta!</p>
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <input 
            type="email" 
            placeholder="E-mail" 
            required 
            className={styles.loginInput} // Classe do Module
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Senha" 
            required 
            className={styles.loginInput} // Classe do Module
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className={styles.loginButton}>
            Entrar
          </button>
        </form>

        <p className={styles.signupLink}>
          Não tem conta? 
          {/* 4. Use o <Link> do Next.js em vez de <a> */}
          <Link href="/login/cadastro"> Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;