"use client";

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// 1. IMPORTA O CLIENTE SUPABASE
import { supabase } from '@/lib/supabaseClient';
import { RegisterCompanyRequest } from '@/lib/interfaces';
import styles from './page.module.css'; // (O CSS é o mesmo, não muda)

// A lista de Tipos de Empresa (não muda)
const COMPANY_TYPES = [
  { value: 'RESTAURANTE', label: 'Restaurante' },
  { value: 'PET_SHOP', label: 'Pet Shop' },
  { value: 'HOTEL', label: 'Hotel' },
  { value: 'POUSADA', label: 'Pousada' },
  { value: 'CAFE', label: 'Café' },
  { value: 'LANCHONETE', label: 'Lanchonete' },
  { value: 'COMERCIO', label: 'Comércio' },
  { value: 'SERVICOS', label: 'Serviços' },
  { value: 'CLINICA_VETERINARIA', label: 'Clínica Veterinária' },
  { value: 'SUPERMERCADO', label: 'Supermercado' },
  { value: 'FARMACIA', label: 'Farmácia' },
  { value: 'ESCRITORIO', label: 'Escritório' },
  { value: 'INDUSTRIA', label: 'Indústria' },
  { value: 'ACADEMIA', label: 'Academia' },
  { value: 'SALAO_BELEZA', label: 'Salão de Beleza' },
  { value: 'CONSULTORIO', label: 'Consultório' },
  { value: 'ESCOLA', label: 'Escola' },
  { value: 'TRANSPORTADORA', label: 'Transportadora' },
  { value: 'CONSTRUTORA', label: 'Construtora' },
  { value: 'OUTROS', label: 'Outros' },
];

export default function RegisterCompanyPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterCompanyRequest>({
    mode: 'onBlur',
    defaultValues: {
      role: 'EMPRESA',
      acceptsPets: false,
      address: {},
    },
  });

  // 2. O 'onSubmit' FOI TOTALMENTE ALTERADO PARA USAR O SUPABASE
  const onSubmit = async (data: RegisterCompanyRequest) => {
    try {
      // 2a. Primeiro, cria o usuário no serviço de AUTENTICAÇÃO
      console.log('[CadastroEmpresa] 📞 A tentar criar usuário no Supabase Auth...');
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

      console.log('[CadastroEmpresa] ✅ Usuário criado no Auth. ID:', authData.user.id);

      // 2b. Agora, guarda os dados extra na BASE DE DADOS (tabela 'profiles')
      console.log("[CadastroEmpresa] 📞 A guardar dados extra na tabela 'profiles'...");
      
      // Mapeia os nomes do formulário (camelCase) para os nomes da tabela (snake_case)
      const profileData = {
        id: authData.user.id,
        name: data.name,
        phone: data.phone,
        cpf_cnpj: data.cpfCnpj, // Assumindo que a coluna é 'cpf_cnpj'
        role: 'EMPRESA',
        address: data.address as any,
        // Dados específicos da Empresa
        company_name: data.companyName,
        trade_name: data.tradeName,
        contact_person: data.contactPerson,
        accepts_pets: data.acceptsPets,
        company_type: data.companyType,
      };
      
      const { error: profileError } = await supabase
        .from('profiles') // <-- ASSUME QUE A TABELA SE CHAMA 'profiles'
        .insert(profileData); 

      if (profileError) {
        throw profileError; // Lança o erro da base de dados
      }

      console.log('[CadastroEmpresa] ✅ Perfil de Empresa guardado na base de dados.');

      // 3. Sucesso!
      setSuccessMessage('Empresa cadastrada com sucesso! Verifique o seu e-mail para confirmar a conta.');
      
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (error: any) {
      // 4. Tratamento de Erros
      console.error('[CadastroEmpresa] ❌ FALHA no cadastro.', error.message);
      const errorMessage = error.message;

      if (errorMessage.includes('User already registered')) {
        setError('root', { message: 'Este e-mail já está em uso.' });
      } else if (errorMessage.includes('profile_cpf_cnpj_key')) {
        setError('root', { message: 'Este CNPJ já está em uso.' });
      } else {
        setError('root', { type: 'manual', message: errorMessage });
      }
    }
  };

  // O resto da página (o 'return' com o JSX) não muda
  
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
        {/* ... (O seu JSX de <header> e <form> continua aqui) ... */}
        {/* O 'handleSubmit(onSubmit)' vai agora chamar a nossa nova função Supabase */}
        
        <div className={styles.header}>
          <h1 className={styles.title}>Cadastro de Empresa</h1>
          <p className={styles.subtitle}>
            Crie sua conta de parceiro MyPetZone.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* --- Seção 1: Dados Pessoais --- */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Dados do Responsável</h2>

            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Nome Responsável *</label>
              <input
                id="name"
                type="text"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="Ex: Maria Santos"
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
                placeholder="contato@suaempresa.com"
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
                  placeholder="(11) 3000-0000"
                  {...register('phone', { required: 'Telefone é obrigatório' })}
                />
                {errors.phone && (
                  <span className={styles.errorMessage}><span>⚠</span> {errors.phone.message}</span>
                )}
              </div>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label htmlFor="cpfCnpj" className={styles.label}>CNPJ *</label>
                <input
                  id="cpfCnpj"
                  type="text"
                  className={`${styles.input} ${errors.cpfCnpj ? styles.inputError : ''}`}
                  placeholder="12.345.678/0001-00"
                  {...register('cpfCnpj', { required: 'CNPJ é obrigatório' })}
                />
                {errors.cpfCnpj && (
                  <span className={styles.errorMessage}><span>⚠</span> {errors.cpfCnpj.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* --- Seção 2: Dados da Empresa --- */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Dados da Empresa</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label htmlFor="companyName" className={styles.label}>Nome da Empresa (Razão Social) *</label>
                <input
                  id="companyName"
                  type="text"
                  className={`${styles.input} ${errors.companyName ? styles.inputError : ''}`}
                  placeholder="Empresa Exemplo LTDA"
                  {...register('companyName', { required: 'Nome da empresa é obrigatório' })}
                />
                {errors.companyName && (
                  <span className={styles.errorMessage}><span>⚠</span> {errors.companyName.message}</span>
                )}
              </div>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label htmlFor="tradeName" className={styles.label}>Nome Fantasia *</label>
                <input
                  id="tradeName"
                  type="text"
                  className={`${styles.input} ${errors.tradeName ? styles.inputError : ''}`}
                  placeholder="Pet Shop Amigo Fiel"
                  {...register('tradeName', { required: 'Nome fantasia é obrigatório' })}
                />
                {errors.tradeName && (
                  <span className={styles.errorMessage}><span>⚠</span> {errors.tradeName.message}</span>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label htmlFor="contactPerson" className={styles.label}>Pessoa de Contato *</label>
                <input
                  id="contactPerson"
                  type="text"
                  className={`${styles.input} ${errors.contactPerson ? styles.inputError : ''}`}
                  placeholder="Maria Santos"
                  {...register('contactPerson', { required: 'Pessoa de contato é obrigatória' })}
                />
                {errors.contactPerson && (
                  <span className={styles.errorMessage}><span>⚠</span> {errors.contactPerson.message}</span>
                )}
              </div>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label htmlFor="companyType" className={styles.label}>Tipo de Empresa *</label>
                <select
                  id="companyType"
                  className={`${styles.select} ${errors.companyType ? styles.inputError : ''}`}
                  {...register('companyType', { required: 'Tipo de empresa é obrigatório' })}
                >
                  <option value="">Selecione um tipo</option>
                  {COMPANY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.companyType && (
                  <span className={styles.errorMessage}><span>⚠</span> {errors.companyType.message}</span>
                )}
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  {...register('acceptsPets')}
                />
                <span>Meu estabelecimento aceita pets (Pet Friendly)</span>
              </label>
            </div>
          </div>
          
          {/* --- Seção 3: Endereço (Manual) --- */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Endereço da Empresa</h2>
            
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
              Voltar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar Empresa'}
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