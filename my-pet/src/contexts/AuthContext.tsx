"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
// 1. Importa o NOVO cliente Supabase
import { supabase } from '@/lib/supabaseClient'; 
import { Session } from '@supabase/supabase-js';
import { LoginRequest } from '@/lib/interfaces'; // (Ainda podemos usar esta interface)

// Define o formato do nosso "cofre"
interface AuthContextType {
  session: Session | null; // <-- Trocamos 'token' por 'session'
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>; 
  logout: () => Promise<void>; // <-- Logout agora é async
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa a carregar
  const router = useRouter();

  // 2. ESTA É A MÁGICA DO SUPABASE
  useEffect(() => {
    // 2a. Verifica a sessão no carregamento inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false); // <-- Termina de carregar SÓ DEPOIS de verificar
      console.log('[AuthContext] Sessão inicial verificada:', session ? 'OK' : 'Nenhuma');
    });

    // 2b. Ouve por MUDANÇAS (Login, Logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        console.log('[AuthContext] Estado de autenticação mudou:', _event, (session ? 'Logado' : 'Deslogado'));
      }
    );

    // 2c. Limpa o "ouvinte" quando o componente é destruído
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 3. Função de Login (agora usa o Supabase)
  const login = async (credentials: LoginRequest) => {
    try {
      console.log('[AuthContext] 📞 A tentar login com Supabase...');
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        // Mapeia o erro comum do Supabase
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos');
        }
        throw error;
      }
      // O 'onAuthStateChange' (o "ouvinte") vai tratar de atualizar o estado 'session'
      
    } catch (error) {
      console.error("[AuthContext] ❌ Falha no login", error);
      throw error; 
    }
  };

  // 4. Função de Logout (agora usa o Supabase)
  const logout = async () => {
    console.log('[AuthContext] 📞 A tentar logout com Supabase...');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("[AuthContext] ❌ Falha no logout", error);
      throw error;
    }
    // O 'onAuthStateChange' vai tratar de atualizar o estado para 'null'
    router.push('/login'); // Redireciona para o login
  };

  // 5. O 'isAuthenticated' agora é baseado na existência de uma sessão
  const isAuthenticated = !!session;

  // Não renderiza nada até sabermos se estamos logados ou não
  if (isLoading) {
    return null; // (Ou um spinner global se preferir)
  }

  return (
    <AuthContext.Provider value={{ session, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado (não muda)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};