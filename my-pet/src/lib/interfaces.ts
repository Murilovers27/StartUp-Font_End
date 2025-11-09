// src/lib/interfaces.ts

// --- Autenticação ---
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken?: string
  [key: string]: unknown
}

export interface RefreshTokenResponse {
  token: string
  refreshToken?: string
}

// --- Empresa (para GET) ---
// src/lib/interfaces.ts
// ... (mantenha as outras interfaces)

// --- Empresa (para GET) ---
export interface Company {
  id?: string
  name: string // Nome do Responsável
  companyName?: string
  tradeName?: string // <-- ADICIONE ESTA LINHA
  companyType?: string
  email: string
  phone?: string
  cpfCnpj?: string
  address?: Address
}

// ... (mantenha o resto do ficheiro)

// --- Cadastro de Empresa (para POST) ---
export interface RegisterCompanyRequest {
  name: string
  email: string
  password: string
  phone: string
  cpfCnpj: string
  role: 'EMPRESA'
  companyName: string
  tradeName: string
  contactPerson: string
  acceptsPets: boolean
  companyType: string
  address: Address
}

// (Aqui podemos adicionar 'RegisterClienteRequest' no futuro)
// src/lib/interfaces.ts
// ... (mantenha LoginRequest, LoginResponse, Company, etc.)

// --- CADASTRO DE CLIENTE (NOVO) ---
export interface RegisterClientRequest {
  name: string
  email: string
  password: string
  phone: string
  cpfCnpj: string // Para o cliente, será o CPF
  role: 'CLIENTE'
  address: Address
}

// src/lib/interfaces.ts

// ... (as outras interfaces) ...

// --- Endereço (Consolidado) ---
export interface Address {
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  complement?: string
  country?: string
  
  // --- CAMPOS ADICIONADOS ---
  // (O '?' torna-os opcionais, pois só existem na RESPOSTA da API)
  latitude?: number 
  longitude?: number
  googleMapsUrl?: string
}

// ... (o resto do ficheiro) ...