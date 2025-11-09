// src/lib/authService.ts
import axios from 'axios'
import { LoginRequest, LoginResponse, RefreshTokenResponse } from './interfaces'

// Em desenvolvimento ou produção, usa a URL do Next.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

class AuthService {
  private isRefreshing = false
  private failedQueue: Array<{
    resolve: (value?: unknown) => void
    reject: (reason?: unknown) => void
  }> = []

  // O cliente Axios principal
  private apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000,
    // Sempre enviar credenciais (útil para cookies de refresh token)
    withCredentials: true,
  })

  constructor() {
    // Interceptor de Requisição: Adiciona o token
    this.apiClient.interceptors.request.use(
      (config) => {
        if (config.url?.includes('/auth/login') || config.url?.includes('/auth/refresh-token')) {
          return config
        }

        const token = this.getToken()
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Interceptor de Resposta: Renova o token se expirar
    this.apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh-token')) {
          if (this.isRefreshing) {
            // Se já está renovando, entra na fila
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject })
            })
              .then(() => {
                const token = this.getToken()
                if (token && originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`
                }
                return this.apiClient(originalRequest)
              })
              .catch((err) => {
                return Promise.reject(err)
              })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            const newToken = await this.refreshToken()
            this.processQueue(null, newToken)
            
            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
            }
            
            return this.apiClient(originalRequest)
          } catch (refreshError) {
            this.processQueue(refreshError, null)
            this.logout() // Se o refresh falhar, faz logout
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        return Promise.reject(error)
      }
    )
  }

  // --- Métodos do Interceptor ---
  private processQueue(error: unknown, token: string | null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error)
      } else {
        prom.resolve(token)
      }
    })
    this.failedQueue = []
  }

  // --- Métodos de Autenticação ---
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.apiClient.post<LoginResponse | string>('/auth/login', {
        email,
        password,
      } as LoginRequest)
      
      let token: string
      let refreshToken: string | undefined

      if (typeof response.data === 'string') {
        token = response.data
      } else if (response.data && typeof response.data === 'object') {
        const data = response.data as Record<string, unknown>
        
        if ('token' in data && typeof data.token === 'string') token = data.token;
        else if ('accessToken' in data && typeof data.accessToken === 'string') token = data.accessToken;
        else if ('access_token' in data && typeof data.access_token === 'string') token = data.access_token;
        else throw new Error('Token não encontrado na resposta');

        if ('refreshToken' in data && typeof data.refreshToken === 'string') refreshToken = data.refreshToken;
        else if ('refresh_token' in data && typeof data.refresh_token === 'string') refreshToken = data.refresh_token;

      } else {
        throw new Error('Formato de resposta inválido do servidor')
      }
      
      if (token) {
        localStorage.setItem('authToken', token)
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken)
        } else {
          localStorage.removeItem('refreshToken')
        }
      }

      return { token, refreshToken }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status
          const message = (error.response.data as any)?.message || 'Erro ao realizar login'

          switch (status) {
            case 401:
              throw new Error('Email ou senha incorretos')
            case 404:
              throw new Error('Serviço não encontrado')
            case 500:
              throw new Error('Erro interno do servidor. Tente novamente mais tarde.')
            default:
              throw new Error(message)
          }
        } else if (error.request) {
          throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.')
        }
      }
      throw new Error('Erro desconhecido ao realizar login')
    }
  }

  async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken()
    
    if (!refreshToken) {
      throw new Error('Refresh token não encontrado')
    }

    try {
      const refreshClient = axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true,
      })

      const response = await refreshClient.post<RefreshTokenResponse>(
        '/auth/refresh-token',
        { refreshToken }
      )

      const newToken = response.data.token
      const newRefreshToken = response.data.refreshToken

      if (newToken) {
        localStorage.setItem('authToken', newToken)
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken)
        }
        return newToken
      }

      throw new Error('Token não recebido na resposta de refresh')
    } catch (error) {
      this.logout()
      throw new Error('Sessão expirada. Faça login novamente.')
    }
  }

  logout(): void {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
  }

  getToken(): string | null {
    // Garante que só rode no navegador
    if (typeof window === 'undefined') return null
    return localStorage.getItem('authToken')
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('refreshToken')
  }

  // Método para expor o cliente para outros serviços
  getApiClient() {
    return this.apiClient
  }
}

// Exporta uma instância única (Singleton)
export const authService = new AuthService()

// Exporta o cliente para ser usado por outros serviços
export const apiClient = authService.getApiClient()