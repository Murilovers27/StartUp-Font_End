// src/lib/userService.ts
import { apiClient } from './authService'
import axios from 'axios'
// O import agora inclui RegisterClientRequest
import { RegisterCompanyRequest, RegisterClientRequest } from './interfaces'

class UserService {
  /**
   * Cadastra uma nova EMPRESA
   * POST /api/users
   */
  async registerCompany(data: RegisterCompanyRequest): Promise<void> {
    try {
      // O interceptor do authService NÃO vai adicionar token aqui,
      // mas o /users pode ser um endpoint protegido que só admins podem usar.
      // Vamos assumir que /users (POST) é público para cadastro.
      await apiClient.post('/users', data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status
          const message = (error.response.data as any)?.message || 'Erro ao cadastrar empresa'

          switch (status) {
            case 400:
              // Mensagens de validação do back-end
              if (message.includes('Email já cadastrado')) {
                throw new Error('Este e-mail já está em uso.');
              }
              if (message.includes('CPF/CNPJ já cadastrado')) {
                throw new Error('Este CPF/CNPJ já está em uso.');
              }
              throw new Error('Dados inválidos. Verifique os campos preenchidos.')
            case 409: // (Conflito - bom para duplicados)
              throw new Error('Email ou CPF/CNPJ já cadastrado.')
            case 500:
              throw new Error('Erro interno do servidor. Tente novamente mais tarde.')
            default:
              throw new Error(message)
          }
        } else if (error.request) {
          throw new Error('Não foi possível conectar ao servidor.')
        }
      }
      throw new Error('Erro desconhecido ao cadastrar empresa')
    }
  }

  // --- FUNÇÃO ADICIONADA ---
  /**
   * Cadastra um novo CLIENTE
   * POST /api/users
   */
  async registerClient(data: RegisterClientRequest): Promise<void> {
    try {
      // O endpoint é o MESMO, o que muda é o JSON enviado
      await apiClient.post('/users', data)
    } catch (error) {
      // O tratamento de erro é idêntico
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status
          const message = (error.response.data as any)?.message || 'Erro ao cadastrar'

          switch (status) {
            case 400:
              if (message.includes('Email já cadastrado')) {
                throw new Error('Este e-mail já está em uso.');
              }
              if (message.includes('CPF/CNPJ já cadastrado')) {
                throw new Error('Este CPF já está em uso.');
              }
              throw new Error('Dados inválidos. Verifique os campos preenchidos.')
            case 409:
              throw new Error('Email ou CPF já cadastrado.')
            case 500:
              throw new Error('Erro interno do servidor.')
            default:
              throw new Error(message)
          }
        } else if (error.request) {
          throw new Error('Não foi possível conectar ao servidor.')
        }
      }
      throw new Error('Erro desconhecido ao cadastrar')
    }
  }
}

export const userService = new UserService()