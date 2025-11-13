#!/bin/bash

# Script com exemplos de uso da API de Geocodificação

echo "==================================="
echo "Exemplos de uso da API de Geocodificação"
echo "==================================="
echo ""

# Verifica se a API está rodando
echo "1. Testando se a API está rodando..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/geocode
echo ""
echo ""

# Exemplo 1: Geocodificar endereço em São Paulo
echo "2. Geocodificando: Av. Paulista, 1578, São Paulo, SP"
curl -X POST http://localhost:8080/api/geocode \
  -H "Content-Type: application/json" \
  -d '{"address": "Av. Paulista, 1578, São Paulo, SP"}' | jq
echo ""
echo ""

# Exemplo 2: Geocodificar endereço no Rio de Janeiro
echo "3. Geocodificando: Cristo Redentor, Rio de Janeiro"
curl -X POST http://localhost:8080/api/geocode \
  -H "Content-Type: application/json" \
  -d '{"address": "Cristo Redentor, Rio de Janeiro"}' | jq
echo ""
echo ""

# Exemplo 3: Geocodificar endereço em Brasília
echo "4. Geocodificando: Congresso Nacional, Brasília"
curl -X POST http://localhost:8080/api/geocode \
  -H "Content-Type: application/json" \
  -d '{"address": "Congresso Nacional, Brasília"}' | jq
echo ""
echo ""

# Exemplo 4: Listar todos os endereços
echo "5. Listando todos os endereços geocodificados..."
curl http://localhost:8080/api/geocode | jq
echo ""
echo ""

# Exemplo 5: Buscar endereço por ID
echo "6. Buscando endereço com ID 1..."
curl http://localhost:8080/api/geocode/1 | jq
echo ""
echo ""

# Exemplo 6: Tentar geocodificar o mesmo endereço novamente (deve retornar do cache)
echo "7. Geocodificando novamente: Av. Paulista, 1578, São Paulo, SP (deve vir do cache)"
curl -X POST http://localhost:8080/api/geocode \
  -H "Content-Type: application/json" \
  -d '{"address": "Av. Paulista, 1578, São Paulo, SP"}' | jq
echo ""
echo ""

echo "==================================="
echo "Exemplos concluídos!"
echo "==================================="

