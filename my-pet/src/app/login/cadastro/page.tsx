"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css'; // Assume que o CSS está nesta pasta
import { FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaHashtag, FaCity, FaGlobeAmericas, FaMapPin, FaPhone, FaIdCard } from 'react-icons/fa'; // Adicionei mais ícones para endereço
import { createUser, UserCreateRequest } from '@/lib/api'; // 1. Importe a função e a interface da API
import { useRouter } from 'next/navigation'; // Para redirecionar após cadastro

export default function SignupPage() {
  // Estados para os campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState(''); // CPF ou CNPJ

  // Estados para os campos de endereço
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Estados para controle da UI
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => { // 2. Marque como async
    e.preventDefault();
    setError(null);

    // Validação simples de senha
    if (password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }
    if (password.length < 6) { // Exemplo de validação mínima
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    // 3. Monte o objeto de dados conforme a interface UserCreateRequest
    const userData: UserCreateRequest = {
      name,
      email,
      phone,
      cpfCnpj,
      role: 'CLIENTE', // Define o tipo de usuário como CLIENTE
      // Inclua a senha aqui se a API esperar (IMPORTANTE: Verifique com o backend!)
      // password: password, // <-- DESCOMENTE SE NECESSÁRIO E SE A API ACEITAR SENHA DIRETO
      address: {
        street,
        number,
        neighborhood,
        city,
        state,
        zipCode,
      }
    };

    try {
      // 4. Chame a função da API
      const response = await createUser(userData);
      console.log("Cadastro bem-sucedido:", response);

      // 5. Lógica Pós-Cadastro (SUCESSO)
      alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
      router.push('/login'); // Redireciona para a página de login

    } catch (err: any) {
      // 6. Lógica de Erro
      console.error('Erro no cadastro:', err);
      // Pega a mensagem de erro que nossa função fetchApi lançou
      setError(err.message || 'Falha ao realizar o cadastro. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Assume que o CSS Module existe em ./page.module.css
    <div className={styles.signupPage}>
      <div className={styles.signupCard}>
        <h1 className={styles.title}>Crie sua conta</h1>
        <p className={styles.subtitle}>Rápido e fácil, comece agora.</p>

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Dados Pessoais */}
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}><FaUser /></span>
            <input type="text" placeholder="Nome Completo" className={styles.input} value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
          </div>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}><FaEnvelope /></span>
            <input type="email" placeholder="E-mail" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
          </div>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}><FaPhone /></span>
            <input type="tel" placeholder="Telefone (Ex: (11) 98765-4321)" className={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={loading} />
          </div>
           <div className={styles.inputGroup}>
            <span className={styles.inputIcon}><FaIdCard /></span>
            <input type="text" placeholder="CPF (xxx.xxx.xxx-xx)" className={styles.input} value={cpfCnpj} onChange={(e) => setCpfCnpj(e.target.value)} required disabled={loading} />
          </div>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}><FaLock /></span>
            <input type="password" placeholder="Senha (mín. 6 caracteres)" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} disabled={loading} />
          </div>
          <div className={styles.inputGroup}>
            <span className={styles.inputIcon}><FaLock /></span>
            <input type="password" placeholder="Confirme sua senha" className={styles.input} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={loading} />
          </div>

          {/* Separador ou Título para Endereço (Opcional) */}
          <h2 className={styles.addressTitle}>Endereço</h2>

           {/* Endereço */}
           <div className={styles.inputGroup}>
             <span className={styles.inputIcon}><FaMapMarkerAlt /></span>
             <input type="text" placeholder="Rua / Avenida" className={styles.input} value={street} onChange={(e) => setStreet(e.target.value)} required disabled={loading} />
           </div>
           <div className={styles.inputGroup}>
             <span className={styles.inputIcon}><FaHashtag /></span>
             <input type="text" placeholder="Número" className={styles.input} value={number} onChange={(e) => setNumber(e.target.value)} required disabled={loading} />
           </div>
           <div className={styles.inputGroup}>
             <span className={styles.inputIcon}><FaMapPin /></span> {/* Ícone diferente para bairro */}
             <input type="text" placeholder="Bairro" className={styles.input} value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} required disabled={loading} />
           </div>
          <div className={styles.inputGroup}>
             <span className={styles.inputIcon}><FaCity /></span>
             <input type="text" placeholder="Cidade" className={styles.input} value={city} onChange={(e) => setCity(e.target.value)} required disabled={loading} />
           </div>
           <div className={styles.inputGroup}>
             <span className={styles.inputIcon}><FaGlobeAmericas /></span> {/* Ícone diferente para estado */}
             <input type="text" placeholder="Estado (UF)" className={styles.input} value={state} onChange={(e) => setState(e.target.value)} required maxLength={2} disabled={loading} />
           </div>
           <div className={styles.inputGroup}>
             <span className={styles.inputIcon}><FaMapPin /></span> {/* Ícone diferente para CEP */}
             <input type="text" placeholder="CEP (xxxxx-xxx)" className={styles.input} value={zipCode} onChange={(e) => setZipCode(e.target.value)} required disabled={loading} />
           </div>

          {/* Exibe a mensagem de erro */}
          {error && <p style={{ color: 'red', marginTop: '0.5rem', marginBottom: '0' }}>{error}</p>}

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className={styles.loginLink}>
          Já tem uma conta?
          <Link href="/login">
            <span> Acesse aqui</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

