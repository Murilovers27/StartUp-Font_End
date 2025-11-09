"use client";

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'; // <-- Importa do Next.js
import Link from 'next/link';
import { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

import { useAuth } from '@/contexts/AuthContext'; // <-- O "Cofre"
import { LoginRequest } from '@/lib/interfaces'; // <-- A "Interface"
import styles from './page.module.css';

// O tipo de dados do nosso formulário
type FormData = LoginRequest;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // <-- Pega a função 'login' do cofre
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError, // <-- Para definir erros vindos da API
  } = useForm<FormData>({
    mode: 'onBlur', // Valida quando o usuário sai do campo
  });

  // Esta função é chamada pelo react-hook-form
  const onSubmit = async (data: FormData) => {
    try {
      // 1. Chama a função login do AuthContext
      await login(data);
      
      // 2. Se o login deu certo (não deu 'throw'), redireciona
      // (O redirecionamento também pode estar no seu AuthContext,
      // mas podemos forçá-lo aqui)
      router.push('/login/pagina-usuario'); 

    } catch (error) {
      // 3. Se o login falhou, o AuthContext lança um erro
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao realizar login';
      
      // Define um erro global no formulário
      setError('root', {
        type: 'manual',
        message: errorMessage,
      });
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>Acesse sua conta MyPetZone</p>

        {/* O 'handleSubmit' do react-hook-form chama o 'onSubmit' */}
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          
          <div className={styles.inputGroup}>
            <FaUser className={styles.icon} />
            <input
              id="email"
              type="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="E-mail"
              autoComplete="email"
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Endereço de e-mail inválido',
                },
              })}
            />
          </div>
          {errors.email && (
            <span className={styles.errorMessage}>{errors.email.message}</span>
          )}

          <div className={styles.inputGroup}>
            <FaLock className={styles.icon} />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              placeholder="Senha"
              autoComplete="current-password"
              {...register('password', {
                required: 'Senha é obrigatória',
              })}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <span className={styles.errorMessage}>{errors.password.message}</span>
          )}

          {/* Exibe o erro da API (ex: "Email ou senha incorretos") */}
          {errors.root && (
            <div className={styles.errorMessageRoot} role="alert">
              {errors.root.message}
            </div>
          )}

          <div className={styles.links}>
            <Link href="/login/recuperar-senha" className={styles.forgotPassword}>
              Esqueceu a senha?
            </Link>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className={styles.registerLink}>
          Não tem uma conta?{' '}
          <Link href="/login/cadastro">
            <span>Cadastre-se</span>
          </Link>
        </p>
      </div>
    </div>
  );
}