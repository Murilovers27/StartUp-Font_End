// src/lib/companyService.ts
import axios from 'axios'
import { apiClient } from './authService'
import { Company } from './interfaces'

class CompanyService {
  /**
   * Busca todas as EMPRESAS
   * GET /api/users/role/EMPRESA
   */
  async getCompanies(): Promise<Company[]> {
    try {
      const response = await apiClient.get<Company[]>('/users/role/EMPRESA')
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status
          const message = (error.response.data as any)?.message || 'Erro ao buscar empresas'

          switch (status) {
            case 401:
              throw new Error('Não autorizado. Faça login novamente.')
            case 404:
              throw new Error('Nenhuma empresa encontrada')
            case 500:
              throw new Error('Erro interno do servidor. Tente novamente mais tarde.')
            default:
              throw new Error(message)
          }
        } else if (error.request) {
          throw new Error('Não foi possível conectar ao servidor.')
        }
      }
      throw new Error('Erro desconhecido ao buscar empresas')
    }
  }
}

export const companyService = new CompanyService()