"use client";

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// 1. IMPORTA O CLIENTE SUPABASE (O NOVO "MOTOR")
import { supabase } from '@/lib/supabaseClient'; 
import { RegisterClientRequest } from '@/lib/interfaces';
import styles from './page.module.css';

// O FormData não muda
type FormData = Omit<RegisterClientRequest, 'role'>;

export default function RegisterClientPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      address: {},
    },
  });

  // 2. O 'onSubmit' FOI TOTALMENTE ALTERADO PARA USAR O SUPABASE
  const onSubmit = async (data: FormData) => {
    try {
      // 2a. Primeiro, cria o usuário no serviço de AUTENTICAÇÃO
      console.log('[CadastroCliente] 📞 A tentar criar usuário no Supabase Auth...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        throw authError; // Lança o erro de autenticação (ex: "User already registered")
      }

      if (!authData.user) {
        throw new Error("Registo falhou, o usuário não foi criado.");
      }

      console.log('[CadastroCliente] ✅ Usuário criado no Auth. ID:', authData.user.id);

      // 2b. Agora, guarda os dados extra na BASE DE DADOS (tabela 'profiles')
      console.log("[CadastroCliente] 📞 A guardar dados extra na tabela 'profiles'...");
      const { error: profileError } = await supabase
        .from('profiles') // <-- ASSUME QUE A TABELA SE CHAMA 'profiles'
        .insert({ 
          id: authData.user.id, // Liga o perfil ao ID de autenticação
          name: data.name,
          phone: data.phone,
          cpf_cnpj: data.cpfCnpj, // Assumindo coluna 'cpf_cnpj'
          role: 'CLIENTE',
          address: data.address as any, // Guarda o objeto de endereço como JSON
        });

      if (profileError) {
        throw profileError; // Lança o erro da base de dados
      }

      console.log('[CadastroCliente] ✅ Perfil guardado na base de dados.');

      // 3. Sucesso!
      setSuccessMessage('Cadastro realizado com sucesso! Verifique o seu e-mail para confirmar a conta.');
      
      // (O Supabase envia um email de confirmação por padrão. Lembre-se de desativar se for só para teste)
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (error: any) {
      // 4. Tratamento de Erros
      console.error('[CadastroCliente] ❌ FALHA no cadastro.', error.message);
      const errorMessage = error.message;

      if (errorMessage.includes('User already registered')) {
        setError('root', { message: 'Este e-mail já está em uso.' });
      } else if (errorMessage.includes('profile_cpf_cnpj_key')) { // Exemplo de erro do Postgres
        setError('root', { message: 'Este CPF já está em uso.' });
      } else {
        setError('root', { type: 'manual', message: errorMessage });
      }
    }
  };

  // Se o cadastro foi bem-sucedido, mostramos só a mensagem
  if (successMessage) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.formCard}>
          <h1 className={styles.title}>Sucesso!</h1>
          <p className={styles.successMessage}>{successMessage}</p>
          <Link href="/login" className={styles.submitButton} style={{ textDecoration: 'none', textAlign: 'center' }}>
            Ir para Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Cadastro de Cliente</h1>
          <p className={styles.subtitle}>
            Preencha os dados para criar sua conta.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* --- Seção 1: Dados Pessoais --- */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Dados Pessoais</h2>

            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Nome Completo *</label>
              <input
                id="name"
                type="text"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="Seu nome completo"
                {...register('name', { required: 'Nome é obrigatório' })}
              />
              {errors.name && (
                <span className={styles.errorMessage}><span>⚠</span> {errors.name.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email *</label>
              <input
                id="email"
                type="email"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="seu.email@exemplo.com"
                {...register('email', {
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido',
                  },
                })}
              />
              {errors.email && (
                <span className={styles.errorMessage}><span>⚠</span> {errors.email.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Senha *</label>
              <div className={styles.inputGroup}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter no mínimo 6 caracteres',
                    },
                  })}
                />
                <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <span className={styles.errorMessage}><span>⚠</span> {errors.password.message}</span>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label htmlFor="phone" className={styles.label}>Telefone *</label>
                <input
                  id="phone"
                  type="tel"
                  className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                  placeholder="(11) 99999-8888"
                  {...register('phone', { required: 'Telefone é obrigatório' })}
                />
                {errors.phone && (
                  <span className={styles.errorMessage}><span>⚠</span> {errors.phone.message}</span>
                )}
              </div>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label htmlFor="cpfCnpj" className={styles.label}>CPF *</label>
                <input
                  id="cpfCnpj"
                  type="text"
                  className={`${styles.input} ${errors.cpfCnpj ? styles.inputError : ''}`}
                  placeholder="123.456.789-00"
                  {...register('cpfCnpj', { required: 'CPF é obrigatório' })}
                />
                {errors.cpfCnpj && (
                  <span className={styles.errorMessage}><span>⚠</span> {errors.cpfCnpj.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* --- Seção 2: Endereço (Manual) --- */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Endereço</h2>

            <div className={styles.formGroup}>
              <label htmlFor="zipCode" className={styles.label}>CEP *</label>
              <input
                id="zipCode"
                type="text"
                className={`${styles.input} ${errors.address?.zipCode ? styles.inputError : ''}`}
                placeholder="12345-678"
                {...register('address.zipCode', { required: 'CEP é obrigatório' })}
              />
              {errors.address?.zipCode && (
                <span className={styles.errorMessage}><span>⚠</span> {errors.address.zipCode.message}</span>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ flex: 3 }}>
                <label htmlFor="street" className={styles.label}>Rua *</label>
                <input
                  id="street"
                  type="text"
                  className={`${styles.input} ${errors.address?.street ? styles.inputError : ''}`}
                  placeholder="Av. Paulista"
                  {...register('address.street', { required: 'Rua é obrigatória' })}
                />
                {errors.address?.street && (
                  <span className={styles.errorMessage}><span>⚠</span> {errors.address.street.message}</span>
                )}
              </div>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label htmlFor="number" className={styles.label}>Número *</label>
                <input
                  id="number"
                  type="text"
                  className={`${styles.input} ${errors.address?.number ? styles.inputError : ''}`}
                  placeholder="1000"
                  {...register('address.number', { required: 'Número é obrigatório' })}
                />
                {errors.address?.number && (
                  <span className={styles.errorMessage}><span>⚠</span> {errors.address.number.message}</span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="neighborhood" className={styles.label}>Bairro *</label>
              <input
                id="neighborhood"
                type="text"
                className={`${styles.input} ${errors.address?.neighborhood ? styles.inputError : ''}`}
                placeholder="Bela Vista"
                {...register('address.neighborhood', { required: 'Bairro é obrigatório' })}
              />
              {errors.address?.neighborhood && (
                <span className={styles.errorMessage}><span>⚠</span> {errors.address.neighborhood.message}</span>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ flex: 3 }}>
                <label htmlFor="city" className={styles.label}>Cidade *</label>
                <input
                  id="city"
                  type="text"
                  className={`${styles.input} ${errors.address?.city ? styles.inputError : ''}`}
                  placeholder="São Paulo"
                  {...register('address.city', { required: 'Cidade é obrigatória' })}
                />
                {errors.address?.city && (
                  <span className={styles.errorMessage}><span>⚠</span> {errors.address.city.message}</span>
                )}
              </div>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label htmlFor="state" className={styles.label}>Estado *</label>
                <input
                  id="state"
                  type="text"
                  className={`${styles.input} ${errors.address?.state ? styles.inputError : ''}`}
                  placeholder="SP"
                  maxLength={2}
                  {...register('address.state', {
                    required: 'Estado é obrigatório',
                    maxLength: { value: 2, message: 'Use 2 letras (ex: SP)' },
                  })}
                />
                {errors.address?.state && (
                  <span className={styles.errorMessage}><span>⚠</span> {errors.address.state.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* --- Erro Raiz (da API) --- */}
          {errors.root && (
            <div className={styles.errorMessageRoot} role="alert">
              <span>⚠</span> {errors.root.message}
            </div>
          )}

          {/* --- Botões --- */}
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => router.push('/login/cadastro')}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Cadastrando...' : 'Criar Conta'}
            </button>
          </div>
        </form>

        <div className={styles.footerLink}>
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