#!/bin/bash

# Script com exemplos de uso da API de Usuários e Geocodificação

echo "==================================="
echo "Exemplos de Uso - API de Usuários"
echo "==================================="
echo ""

# Exemplo 1: Criar um Cliente
echo "1. Criando um CLIENTE..."
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao.silva@email.com",
    "phone": "(11) 98765-4321",
    "cpfCnpj": "123.456.789-00",
    "role": "CLIENTE",
    "address": {
      "street": "Av. Paulista",
      "number": "1578",
      "neighborhood": "Bela Vista",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01310-200"
    }
  }' | jq
echo ""
echo ""

# Exemplo 2: Criar um Funcionário
echo "2. Criando um FUNCIONÁRIO..."
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "maria.santos@email.com",
    "phone": "(11) 97654-3210",
    "cpfCnpj": "987.654.321-00",
    "role": "FUNCIONARIO",
    "address": {
      "street": "Rua da Consolação",
      "number": "2000",
      "neighborhood": "Centro",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01301-000"
    }
  }' | jq
echo ""
echo ""

# Exemplo 3: Criar um Administrador
echo "3. Criando um ADMINISTRADOR..."
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carlos Admin",
    "email": "admin@sistema.com",
    "phone": "(11) 96543-2100",
    "cpfCnpj": "111.222.333-44",
    "role": "ADMINISTRADOR",
    "address": {
      "street": "Av. Faria Lima",
      "number": "3000",
      "neighborhood": "Itaim Bibi",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01451-000"
    }
  }' | jq
echo ""
echo ""

# Exemplo 4: Criar uma Empresa
echo "4. Criando uma EMPRESA..."
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Representante Legal",
    "email": "contato@empresa.com",
    "phone": "(11) 3000-0000",
    "cpfCnpj": "12.345.678/0001-00",
    "role": "EMPRESA",
    "companyName": "Empresa Exemplo LTDA",
    "tradeName": "Empresa Exemplo",
    "contactPerson": "Pedro Oliveira",
    "acceptsPets": true,
    "companyType": "COMERCIO",
    "address": {
      "street": "Av. Brigadeiro Faria Lima",
      "number": "1461",
      "neighborhood": "Jardim Paulistano",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01452-002"
    }
  }' | jq
echo ""
echo ""

# Exemplo 5: Listar todos os usuários
echo "5. Listando todos os usuários..."
curl http://localhost:8080/api/users | jq
echo ""
echo ""

# Exemplo 6: Buscar usuário por ID
echo "6. Buscando usuário com ID 1..."
curl http://localhost:8080/api/users/1 | jq
echo ""
echo ""

# Exemplo 7: Listar apenas clientes
echo "7. Listando apenas CLIENTES..."
curl http://localhost:8080/api/users/role/CLIENTE | jq
echo ""
echo ""

# Exemplo 8: Listar apenas empresas
echo "8. Listando apenas EMPRESAS..."
curl http://localhost:8080/api/users/role/EMPRESA | jq
echo ""
echo ""

# Exemplo 9: Listar apenas usuários ativos
echo "9. Listando apenas usuários ATIVOS..."
curl http://localhost:8080/api/users/active | jq
echo ""
echo ""

# Exemplo 10: Atualizar telefone de um usuário
echo "10. Atualizando telefone do usuário ID 1..."
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "(11) 99999-9999"
  }' | jq
echo ""
echo ""

# Exemplo 11: Atualizar endereço de um usuário
echo "11. Atualizando endereço do usuário ID 2..."
curl -X PUT http://localhost:8080/api/users/2 \
  -H "Content-Type: application/json" \
  -d '{
    "address": {
      "street": "Rua Augusta",
      "number": "2000",
      "neighborhood": "Consolação",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01304-000"
    }
  }' | jq
echo ""
echo ""

# Exemplo 12: Desativar um usuário
echo "12. Desativando usuário ID 3..."
curl -X PATCH http://localhost:8080/api/users/3/deactivate | jq
echo ""
echo ""

# Exemplo 13: Reativar um usuário
echo "13. Reativando usuário ID 3..."
curl -X PATCH http://localhost:8080/api/users/3/activate | jq
echo ""
echo ""

# Exemplo 14: Criar cliente no Rio de Janeiro
echo "14. Criando cliente no Rio de Janeiro..."
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana Costa",
    "email": "ana.costa@email.com",
    "phone": "(21) 98765-4321",
    "cpfCnpj": "555.666.777-88",
    "role": "CLIENTE",
    "address": {
      "street": "Av. Atlântica",
      "number": "1500",
      "neighborhood": "Copacabana",
      "city": "Rio de Janeiro",
      "state": "RJ",
      "zipCode": "22021-000"
    }
  }' | jq
echo ""
echo ""

# Exemplo 15: Criar funcionário em Brasília
echo "15. Criando funcionário em Brasília..."
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Roberto Silva",
    "email": "roberto.silva@email.com",
    "phone": "(61) 99876-5432",
    "cpfCnpj": "999.888.777-66",
    "role": "FUNCIONARIO",
    "address": {
      "street": "Esplanada dos Ministérios",
      "number": "S/N",
      "neighborhood": "Zona Cívico-Administrativa",
      "city": "Brasília",
      "state": "DF",
      "zipCode": "70050-000"
    }
  }' | jq
echo ""
echo ""

echo "==================================="
echo "Exemplos concluídos!"
echo "==================================="
echo ""
echo "Dicas:"
echo "- Use o googleMapsUrl retornado para visualizar o endereço"
echo "- Copie o ID retornado para usar em outras operações"
echo "- Consulte o README.md para mais exemplos"

