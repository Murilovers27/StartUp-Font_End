// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// 1. Verifique se o seu .env.local tem estes nomes exatos
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 2. Trata os erros caso as variáveis não estejam definidas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Erro: Váriaveis de ambiente do Supabase não encontradas. Verifique o seu .env.local')
}

// 3. Crie e exporte o cliente (APENAS UMA VEZ)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// (Remova qualquer outra linha que diga 'const supabase = ...')