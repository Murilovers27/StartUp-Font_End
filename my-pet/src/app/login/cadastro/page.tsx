"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { createUser, UserCreateRequest } from '@/lib/api'; 
// 1. Importe os ícones de olho E o novo ícone de spinner
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';

type FormData = UserCreateRequest & {
  confirmPassword: string;
};

export default function CadastroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 2. Novos estados para a busca de CEP
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    cpfCnpj: '',
    role: 'CLIENTE',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      complement: '',
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  // 3. NOVA FUNÇÃO: Busca o CEP quando o usuário sai do campo
  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, ''); // Remove traços e pontos
    setCepError(null);
    setError(null); // Limpa erros gerais também

    if (cep.length !== 8) {
      if (cep.length > 0) setCepError("CEP inválido. Deve conter 8 números.");
      return;
    }

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error("Erro na API ViaCEP");
      
      const data = await response.json();

      if (data.erro) {
        setCepError("CEP não encontrado.");
        // Limpa os campos se o CEP estiver errado
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            street: '',
            neighborhood: '',
            city: '',
            state: '',
          }
        }));
      } else {
        // SUCESSO! Auto-preenche o estado
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
          }
        }));
      }
    } catch (err) {
      setCepError("Erro ao buscar CEP. Tente digitar manualmente.");
    } finally {
      setLoadingCep(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validação (continua a mesma, pois o estado é preenchido)
    if (!formData.name || !formData.email || !formData.phone || !formData.cpfCnpj || !formData.password || !formData.address.street || !formData.address.number || !formData.address.city || !formData.address.state || !formData.address.zipCode) {
      setError("Por favor, preencha todos os campos obrigatórios (incluindo CEP e Número).");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...apiData } = formData;
      await createUser(apiData);
      setSuccessMessage("Cadastro realizado com sucesso! Redirecionando para o login...");
      setLoading(false);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      console.error("Falha no cadastro:", err);
      setLoading(false);
      setError(err.message || "Não foi possível realizar o cadastro.");
    }
  };

  if (successMessage) {
    return (
      <div className={styles.cadastroPage}>
        <div className={styles.cadastroCard}>
          <h1 className={styles.title}>Sucesso!</h1>
          <p className={styles.successMessage}>{successMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cadastroPage}>
      <div className={styles.cadastroCard}>
        <h1 className={styles.title}>Crie sua Conta</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          
          <h2 className={styles.formSectionTitle}>Dados Pessoais</h2>
          {/* ... (campos de Dados Pessoais - sem mudança) ... */}
          <input type="text" name="name" placeholder="Nome Completo" className={styles.input} value={formData.name} onChange={handleChange} disabled={loading} />
          <input type="email" name="email" placeholder="E-mail" className={styles.input} value={formData.email} onChange={handleChange} disabled={loading} />
          <input type="tel" name="phone" placeholder="Telefone (ex: 11999998888)" className={styles.input} value={formData.phone} onChange={handleChange} disabled={loading} />
          <input type="text" name="cpfCnpj" placeholder="CPF ou CNPJ" className={styles.input} value={formData.cpfCnpj} onChange={handleChange} disabled={loading} />
          
          <h2 className={styles.formSectionTitle}>Segurança</h2>
          {/* ... (campos de Senha - sem mudança) ... */}
          <div className={styles.inputGroup}>
            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Senha" className={styles.input} value={formData.password} onChange={handleChange} disabled={loading}/>
            <button type="button" className={styles.passwordToggleIcon} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className={styles.inputGroup}>
            <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirmar Senha" className={styles.input} value={formData.confirmPassword} onChange={handleChange} disabled={loading}/>
            <button type="button" className={styles.passwordToggleIcon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* --- 4. SEÇÃO DE ENDEREÇO (MODIFICADA) --- */}
          <h2 className={styles.formSectionTitle}>Endereço</h2>
          
          <div className={styles.inputGroup}>
            <input 
              type="tel" 
              name="zipCode" 
              placeholder="CEP (digite para buscar)" 
              className={styles.input} 
              value={formData.address.zipCode} 
              onChange={handleAddressChange} 
              onBlur={handleCepBlur} // <-- AQUI A MÁGICA ACONTECE
              disabled={loading}
              maxLength={9} // CEP + hífen
            />
            {loadingCep && <FaSpinner className={styles.spinnerIcon} />}
          </div>
          {/* Alerta de erro específico para o CEP */}
          {cepError && <p className={styles.cepErrorMessage}>{cepError}</p>}
          
          {/* Campos auto-preenchidos (agora readOnly) */}
          <input type="text" name="street" placeholder="Rua / Avenida" className={styles.input} value={formData.address.street} onChange={handleAddressChange} disabled={loading} readOnly />
          <input type="text" name="neighborhood" placeholder="Bairro" className={styles.input} value={formData.address.neighborhood} onChange={handleAddressChange} disabled={loading} readOnly />
          <input type="text" name="city" placeholder="Cidade" className={styles.input} value={formData.address.city} onChange={handleAddressChange} disabled={loading} readOnly />
          <input type="text" name="state" placeholder="Estado (ex: SP)" className={styles.input} value={formData.address.state} onChange={handleAddressChange} disabled={loading} readOnly />
          
          {/* Campos que o usuário DEVE preencher */}
          <input type="text" name="number" placeholder="Número" className={styles.input} value={formData.address.number} onChange={handleAddressChange} disabled={loading} />
          <input type="text" name="complement" placeholder="Complemento (Opcional)" className={styles.input} value={formData.address.complement} onChange={handleAddressChange} disabled={loading} />


          {/* Alerta de Erro Geral */}
          {error && (
            <p className={styles.errorMessage}>{error}</p>
          )}

          <button type="submit" className={styles.submitButton} disabled={loading || loadingCep}>
            {loading ? 'Criando conta...' : (loadingCep ? 'Buscando CEP...' : 'Criar Conta')}
          </button>
        </form>

        <p className={styles.loginLink}>
          Já tem uma conta? 
          <Link href="/login"><span> Faça o login</span></Link>
        </p>

      </div>
    </div>
  );
}