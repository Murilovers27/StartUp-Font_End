// src/lib/api.ts

// 1. Lê a URL base do arquivo .env.local
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// --- INTERFACES (Definem o formato dos dados) ---
// Baseado no DTO do backend
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  role: string;
  active: boolean;
  address: {
    id: number;
    googleMapsUrl?: string; // Vimos isso no README
    [key: string]: any; // Outros campos de endereço
  };
  // Campos da Empresa (se 'role' for 'EMPRESA')
  companyName?: string;
  tradeName?: string; // Nome Fantasia (vamos usar este!)
  contactPerson?: string;
  acceptsPets?: boolean;
  companyType?: string;
}

// Interface para o Cadastro (Usaremos depois)
export interface UserCreateRequest {
  name: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  role: 'CLIENTE' | 'FUNCIONARIO' | 'ADMINISTRADOR' | 'EMPRESA';
  password: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    complement?: string;
  };
}


// --- FUNÇÃO DE FETCH GENÉRICA ---
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers, 
  };
  
  try {
    const response = await fetch(url, { ...options, headers });
    const responseData = await response.json().catch(() => null); 

    if (!response.ok) {
      console.error("Erro da API:", responseData);
      throw new Error(responseData?.message || `Erro ${response.status}: ${response.statusText}`);
    }

    return responseData;

  } catch (error) {
    console.error(`Falha na chamada API para ${endpoint}:`, error);
    throw error; 
  }
}


// --- FUNÇÕES EXPORTADAS (Que nossos componentes vão usar) ---

/**
 * Busca todas as EMPRESAS
 * Endpoint: GET /api/users/role/EMPRESA
 */
export const getCompanies = (): Promise<UserResponse[]> => {
   // O '/users/role/EMPRESA' vem dos seus arquivos 'curl'
   return fetchApi('/users/role/EMPRESA');
};

/**
 * Cria um novo usuário (Cliente, Empresa, etc.)
 * Endpoint: POST /api/users
 */
export const createUser = (userData: UserCreateRequest): Promise<UserResponse> => {
  return fetchApi('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

// src/lib/api.ts

// ... (API_BASE_URL, UserResponse, UserCreateRequest, fetchApi, getCompanies, createUser ... )
// ... Cole o código abaixo no final do arquivo ...

// --- INTERFACE PARA LOGIN (O que enviamos) ---
export interface LoginRequest {
  email: string;
  password?: string; // (Verificar se o back-end espera 'password' ou 'senha')
}

// --- INTERFACE PARA RESPOSTA DO LOGIN (O que recebemos) ---
export interface LoginResponse {
  token: string;
  // (Pode ser que o back-end retorne o usuário também)
  // user: UserResponse; 
}


// --- FUNÇÃO DE LOGIN ---
/**
 * Autentica um usuário
 * Endpoint: POST /api/auth/login (ASSUMINDO ESTE ENDPOINT!)
 */
export const loginUser = (credentials: LoginRequest): Promise<LoginResponse> => {
  // ATENÇÃO: Verifique com o back-end se o endpoint é /auth/login,
  // /login, /authenticate, ou outro.
  return fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};
// src/lib/api.ts

// ... (fetchApi, loginUser, createUser, etc. ... )
// ... Cole o código abaixo no final do arquivo ...

// --- INTERFACE PARA SOLICITAR RESET ---
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Solicita um reset de senha para um e-mail
 * Endpoint: POST /api/auth/forgot-password (!! ASSUMINDO ESTE ENDPOINT !!)
 */
export const requestPasswordReset = (data: ForgotPasswordRequest): Promise<void> => {
  // ATENÇÃO: Verifique com o back-end se o endpoint é este.
  // Pode ser /forgot-password, /password/request, etc.
  return fetchApi('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// src/lib/api.ts

// ... (fetchApi, loginUser, requestPasswordReset, etc. ... )
// ... Cole o código abaixo no final do arquivo ...

// --- INTERFACE PARA FINALIZAR O RESET ---
export interface ResetPasswordRequest {
  token: string;
  novaSenha?: string; // (Verificar com o back-end)
  password?: string; // (O back-end pode esperar 'password')
  // (O back-end pode querer a confirmação também)
  // confirmPassword?: string; 
}


/**
 * Define uma nova senha usando um token de reset
 * Endpoint: POST /api/auth/reset-password (!! ASSUMINDO ESTE ENDPOINT !!)
 */
export const resetPassword = (data: ResetPasswordRequest): Promise<void> => {
  // ATENÇÃO: Verifique com o back-end se o endpoint é este.
  // Pode ser /reset-password, /password/reset, etc.
  return fetchApi('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};