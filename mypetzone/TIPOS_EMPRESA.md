# 🏢 Tipos de Empresa

## 📋 Visão Geral

O campo `companyType` permite categorizar empresas por seu ramo de atividade. Este campo é opcional e específico para usuários com perfil **EMPRESA**.

## 🎯 Tipos Disponíveis

| Código | Nome Amigável | Descrição |
|--------|---------------|-----------|
| `RESTAURANTE` | Restaurante | Estabelecimentos de alimentação |
| `PET_SHOP` | Pet Shop | Lojas especializadas em produtos e serviços para pets |
| `HOTEL` | Hotel | Hotéis e hospedagens |
| `POUSADA` | Pousada | Pousadas e hospedagens menores |
| `CAFE` | Café | Cafeterias e cafés |
| `LANCHONETE` | Lanchonete | Lanchonetes e fast-food |
| `COMERCIO` | Comércio | Comércio em geral |
| `SERVICOS` | Serviços | Empresas de serviços diversos |
| `CLINICA_VETERINARIA` | Clínica Veterinária | Clínicas e hospitais veterinários |
| `SUPERMERCADO` | Supermercado | Supermercados e mercados |
| `FARMACIA` | Farmácia | Farmácias e drogarias |
| `ESCRITORIO` | Escritório | Escritórios e consultorias |
| `INDUSTRIA` | Indústria | Empresas industriais |
| `ACADEMIA` | Academia | Academias de ginástica |
| `SALAO_BELEZA` | Salão de Beleza | Salões de beleza e estética |
| `CONSULTORIO` | Consultório | Consultórios médicos e odontológicos |
| `ESCOLA` | Escola | Escolas e instituições de ensino |
| `TRANSPORTADORA` | Transportadora | Empresas de transporte e logística |
| `CONSTRUTORA` | Construtora | Empresas de construção civil |
| `OUTROS` | Outros | Outros tipos de empresa |

## 💡 Exemplos de Uso

### 1. Restaurante

```json
{
  "name": "Carlos Souza",
  "email": "contato@restaurante.com",
  "role": "EMPRESA",
  "companyName": "Restaurante Sabor LTDA",
  "tradeName": "Restaurante Sabor",
  "contactPerson": "Carlos Souza",
  "acceptsPets": false,
  "companyType": "RESTAURANTE",
  "address": { ... }
}
```

### 2. Pet Shop

```json
{
  "name": "Ana Silva",
  "email": "contato@petshop.com",
  "role": "EMPRESA",
  "companyName": "Pet Shop Amigo Fiel LTDA",
  "tradeName": "Pet Shop Amigo Fiel",
  "contactPerson": "Ana Silva",
  "acceptsPets": true,
  "companyType": "PET_SHOP",
  "address": { ... }
}
```

### 3. Hotel Pet Friendly

```json
{
  "name": "Roberto Lima",
  "email": "contato@hotel.com",
  "role": "EMPRESA",
  "companyName": "Hotel Aconchego LTDA",
  "tradeName": "Hotel Aconchego",
  "contactPerson": "Roberto Lima",
  "acceptsPets": true,
  "companyType": "HOTEL",
  "address": { ... }
}
```

### 4. Café

```json
{
  "name": "Mariana Costa",
  "email": "contato@cafe.com",
  "role": "EMPRESA",
  "companyName": "Café com Pets LTDA",
  "tradeName": "Café Pet Friendly",
  "contactPerson": "Mariana Costa",
  "acceptsPets": true,
  "companyType": "CAFE",
  "address": { ... }
}
```

### 5. Clínica Veterinária

```json
{
  "name": "Dr. Pedro Santos",
  "email": "contato@clinicavet.com",
  "role": "EMPRESA",
  "companyName": "Clínica Veterinária Pet Saúde LTDA",
  "tradeName": "Clínica Pet Saúde",
  "contactPerson": "Dr. Pedro Santos",
  "acceptsPets": true,
  "companyType": "CLINICA_VETERINARIA",
  "address": { ... }
}
```

### 6. Comércio Geral

```json
{
  "name": "João Oliveira",
  "email": "contato@loja.com",
  "role": "EMPRESA",
  "companyName": "Loja Exemplo LTDA",
  "tradeName": "Loja Exemplo",
  "contactPerson": "João Oliveira",
  "acceptsPets": false,
  "companyType": "COMERCIO",
  "address": { ... }
}
```

## 🔄 Como Usar

### Criar Empresa com Tipo

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "contato@empresa.com",
    "role": "EMPRESA",
    "companyName": "Minha Empresa LTDA",
    "tradeName": "Minha Empresa",
    "contactPerson": "Maria Santos",
    "acceptsPets": true,
    "companyType": "PET_SHOP",
    "address": {
      "street": "Rua Exemplo",
      "number": "100",
      "neighborhood": "Centro",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01000-000"
    }
  }'
```

### Atualizar Tipo da Empresa

```bash
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "companyType": "RESTAURANTE"
  }'
```

## 📊 Resposta da API

A resposta incluirá tanto o código quanto o nome amigável:

```json
{
  "id": 1,
  "role": "EMPRESA",
  "companyName": "Pet Shop Amigo Fiel LTDA",
  "tradeName": "Pet Shop Amigo Fiel",
  "contactPerson": "Ana Silva",
  "acceptsPets": true,
  "companyType": "PET_SHOP",
  "companyTypeDisplayName": "Pet Shop",
  "address": { ... }
}
```

## 🎨 Combinações Recomendadas

### Empresas que Normalmente Aceitam Pets
- `PET_SHOP` + `acceptsPets: true`
- `CLINICA_VETERINARIA` + `acceptsPets: true`
- `HOTEL` (alguns) + `acceptsPets: true`
- `CAFE` (pet friendly) + `acceptsPets: true`
- `POUSADA` (algumas) + `acceptsPets: true`

### Empresas que Normalmente NÃO Aceitam Pets
- `RESTAURANTE` + `acceptsPets: false`
- `FARMACIA` + `acceptsPets: false`
- `SUPERMERCADO` + `acceptsPets: false`
- `CONSULTORIO` + `acceptsPets: false`
- `ESCOLA` + `acceptsPets: false`

## 📋 Regras

1. **Opcional**: O campo `companyType` é opcional
2. **Específico para EMPRESA**: Só é relevante para perfil EMPRESA
3. **Validação**: Deve ser um dos valores do enum CompanyType
4. **Case Sensitive**: Use MAIÚSCULAS (ex: `RESTAURANTE`, não `restaurante`)
5. **Atualização**: Pode ser atualizado a qualquer momento

## 🔍 Consultas Futuras

**Sugestões de melhorias:**
- Filtrar empresas por tipo: `GET /api/users/company-type/{type}`
- Buscar empresas pet-friendly por tipo
- Estatísticas por tipo de empresa
- Pesquisa combinada (tipo + aceita pets + localização)


