# API de Geocodificação e Gerenciamento de Usuários

API REST desenvolvida em Java com Spring Boot que utiliza o cliente `google-maps-services-java` para geocodificar endereços e gerenciar usuários com diferentes perfis. A aplicação geocodifica automaticamente os endereços durante o cadastro de usuários e retorna coordenadas geográficas para visualização no Google Maps.

## 🚀 Funcionalidades

### Gerenciamento de Usuários
- ✅ Cadastro de usuários com 2 perfis: **Cliente** e **Empresa**
- ✅ Geocodificação automática do endereço durante o cadastro
- ✅ Atualização de dados do usuário e endereço
- ✅ Consulta de usuários por ID, perfil ou status (ativo/inativo)
- ✅ Ativação e desativação de usuários (soft delete)
- ✅ Exclusão física de usuários
- ✅ Validação de email e CPF/CNPJ únicos
- ✅ Campos específicos para perfil EMPRESA (razão social, nome fantasia, etc.)

### Geocodificação
- ✅ Integração com Google Maps API para geocodificação
- ✅ Armazenamento de coordenadas (latitude e longitude)
- ✅ Geração automática de link para visualização no Google Maps
- ✅ Suporte a endereços completos com CEP, rua, número, complemento, bairro, cidade e estado

## 🔐 Autenticação e Autorização

### Registrar um novo usuário

```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com",
    "password": "senha123",
    "confirmPassword": "senha123",
    "phone": "11999999999",
    "role": "CLIENTE"
  }'
```

**Resposta de sucesso (201 Created):**
```json
{
  "id": 1,
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "phone": "11999999999",
  "role": "CLIENTE",
  "active": true,
  "createdAt": "2025-11-08T15:21:32.12345"
}
```

### Fazer login e obter tokens

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }'
```

**Resposta de sucesso (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer"
}
```

### Renovar access token usando refresh token

```bash
curl -X POST http://localhost:8080/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
  }'
```

**Resposta de sucesso (200 OK):**
```json
{
  "accessToken": "novo_token_aqui",
  "refreshToken": "mesmo_refresh_token",
  "tokenType": "Bearer"
}
```

### Usando o token em requisições protegidas

Para acessar endpoints protegidos, inclua o token no cabeçalho `Authorization`:

```bash
curl -X GET http://localhost:8080/api/usuarios/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

## 🔓 Endpoints Públicos

Os seguintes endpoints podem ser acessados sem autenticação:

- `GET /api/users` - Lista todos os usuários
- `POST /api/users/register` - Registro de novos usuários
- `POST /api/auth/login` - Autenticação de usuários
- `POST /api/auth/refresh-token` - Renovação de token de acesso
- Documentação Swagger: `http://localhost:8080/swagger-ui.html`
- Console H2: `http://localhost:8080/h2-console`

## ⏱️ Validade dos Tokens

- **Access Token**: 30 minutos
- **Refresh Token**: 7 dias

## 📋 Pré-requisitos

- Java 17 ou superior
- Maven 3.6 ou superior
- Chave de API do Google Maps (obtenha em: https://developers.google.com/maps/documentation/geocoding/get-api-key)

## 🔧 Configuração

### 1. Clone ou navegue até o diretório do projeto

```bash
cd /Users/llcosta/Documents/estudo_maps
```

### 2. Configure sua chave de API do Google Maps

Edite o arquivo `src/main/resources/application.properties` e substitua `YOUR_GOOGLE_MAPS_API_KEY` pela sua chave:

```properties
google.maps.api.key=SUA_CHAVE_AQUI
```

### 3. Compile o projeto

```bash
mvn clean install
```

### 4. Execute a aplicação

```bash
mvn spring-boot:run
```

A API estará disponível em: `http://localhost:8080`

## 📡 Endpoints da API

### 👥 Gerenciamento de Usuários

#### 1. Criar Usuário

**POST** `/api/users`

Cria um novo usuário e geocodifica seu endereço automaticamente.

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao.silva@email.com",
  "phone": "(11) 98765-4321",
  "cpfCnpj": "123.456.789-00",
  "role": "CLIENTE",
  "address": {
    "street": "Av. Paulista",
    "number": "1578",
    "complement": "Andar 5",
    "neighborhood": "Bela Vista",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01310-200"
  }
}
```

**Perfis disponíveis:**
- `CLIENTE`
- `EMPRESA`

**Request Body para perfil EMPRESA:**
```json
{
  "name": "Maria Santos",
  "email": "contato@empresa.com",
  "phone": "(11) 3000-0000",
  "cpfCnpj": "12.345.678/0001-00",
  "role": "EMPRESA",
  "companyName": "Empresa Exemplo LTDA",
  "tradeName": "Empresa Exemplo",
  "contactPerson": "Maria Santos",
  "acceptsPets": true,
  "companyType": "RESTAURANTE",
  "address": {
    "street": "Rua Exemplo",
    "number": "100",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01000-000"
  }
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao.silva@email.com",
  "phone": "(11) 98765-4321",
  "cpfCnpj": "123.456.789-00",
  "role": "CLIENTE",
  "roleDisplayName": "Cliente",
  "address": {
    "street": "Av. Paulista",
    "number": "1578",
    "complement": "Andar 5",
    "neighborhood": "Bela Vista",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01310-200",
    "latitude": -23.5631313,
    "longitude": -46.6566596,
    "formattedAddress": "Av. Paulista, 1578 - Bela Vista, São Paulo - SP, 01310-200, Brasil",
    "googleMapsUrl": "https://www.google.com/maps?q=-23.5631313,-46.6566596"
  },
  "active": true,
  "createdAt": "2025-10-19T10:30:00",
  "updatedAt": "2025-10-19T10:30:00"
}
```

#### 2. Atualizar Usuário

**PUT** `/api/users/{id}`

Atualiza dados de um usuário existente.

**Request Body (todos os campos são opcionais):**
```json
{
  "name": "João Silva Santos",
  "phone": "(11) 98765-9999",
  "address": {
    "street": "Rua Nova",
    "number": "200",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01000-000"
  }
}
```

#### 3. Buscar Usuário por ID

**GET** `/api/users/{id}`

Retorna os dados de um usuário específico.

#### 4. Listar Todos os Usuários

**GET** `/api/users`

Retorna todos os usuários cadastrados, ordenados por data de criação (mais recentes primeiro).

#### 5. Listar Usuários por Perfil

**GET** `/api/users/role/{role}`

Retorna usuários de um perfil específico.

Exemplos:
- `/api/users/role/CLIENTE`
- `/api/users/role/EMPRESA`

#### 6. Listar Apenas Usuários Ativos

**GET** `/api/users/active`

Retorna apenas usuários com status ativo.

#### 7. Desativar Usuário

**PATCH** `/api/users/{id}/deactivate`

Desativa um usuário (soft delete - não remove do banco).

#### 8. Ativar Usuário

**PATCH** `/api/users/{id}/activate`

Reativa um usuário previamente desativado.

#### 9. Deletar Usuário

**DELETE** `/api/users/{id}`

Remove permanentemente um usuário do banco de dados.

### 🗺️ Geocodificação Direta

#### 1. Geocodificar um Endereço

**POST** `/api/geocode`

Geocodifica um endereço diretamente (mantido para compatibilidade).

**Request Body:**
```json
{
  "address": "Av. Paulista, 1578, São Paulo, SP"
}
```

**Response:**
```json
{
  "id": 1,
  "address": "Av. Paulista, 1578, São Paulo, SP",
  "formattedAddress": "Av. Paulista, 1578 - Bela Vista, São Paulo - SP, 01310-200, Brasil",
  "latitude": -23.5631313,
  "longitude": -46.6566596,
  "googleMapsUrl": "https://www.google.com/maps?q=-23.5631313,-46.6566596",
  "fromCache": false,
  "message": "Endereço geocodificado com sucesso"
}
```

#### 2. Listar Todos os Endereços Geocodificados

**GET** `/api/geocode`

#### 3. Buscar Endereço por ID

**GET** `/api/geocode/{id}`

## 🧪 Testando a API

### Usando cURL

#### Criar um Cliente
```bash
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
  }'
```

#### Criar uma Empresa
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "contato@empresa.com",
    "phone": "(11) 3000-0000",
    "cpfCnpj": "12.345.678/0001-00",
    "role": "EMPRESA",
    "companyName": "Empresa Exemplo LTDA",
    "tradeName": "Empresa Exemplo",
    "contactPerson": "Maria Santos",
    "acceptsPets": true,
    "companyType": "CAFE",
    "address": {
      "street": "Rua da Consolação",
      "number": "100",
      "neighborhood": "Centro",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01301-000"
    }
  }'
```

#### Listar Todos os Usuários
```bash
curl http://localhost:8080/api/users
```

#### Listar Apenas Clientes
```bash
curl http://localhost:8080/api/users/role/CLIENTE
```

#### Buscar Usuário por ID
```bash
curl http://localhost:8080/api/users/1
```

#### Atualizar Usuário
```bash
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "(11) 99999-9999"
  }'
```

#### Desativar Usuário
```bash
curl -X PATCH http://localhost:8080/api/users/1/deactivate
```

#### Ativar Usuário
```bash
curl -X PATCH http://localhost:8080/api/users/1/activate
```

#### Deletar Usuário
```bash
curl -X DELETE http://localhost:8080/api/users/1
```

## 🗄️ Banco de Dados

A aplicação utiliza H2 Database (banco em memória) para desenvolvimento. Para acessar o console do H2:

- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:mapsdb`
- Username: `sa`
- Password: (deixe em branco)

### Tabelas Criadas
- `users` - Dados dos usuários
- `addresses` - Endereços geocodificados

## 📁 Estrutura do Projeto

```
src/main/java/com/example/mapsapi/
├── MapsApiApplication.java          # Classe principal
├── config/
│   └── GoogleMapsConfig.java        # Configuração do Google Maps client
├── controller/
│   ├── GeocodeController.java       # Endpoints de geocodificação
│   └── UserController.java          # Endpoints de usuários
├── dto/
│   ├── AddressDTO.java              # DTO de endereço
│   ├── AddressRequest.java          # DTO de requisição (geocode)
│   ├── AddressResponse.java         # DTO de resposta (geocode)
│   ├── UserCreateRequest.java       # DTO de criação de usuário
│   ├── UserResponse.java            # DTO de resposta de usuário
│   └── UserUpdateRequest.java       # DTO de atualização de usuário
├── entity/
│   ├── Address.java                 # Entidade de endereço
│   └── User.java                    # Entidade de usuário
├── enums/
│   └── UserRole.java                # Enum de perfis de usuário
├── exception/
│   ├── GeocodeException.java        # Exceção customizada
│   └── GlobalExceptionHandler.java  # Tratamento global de exceções
├── repository/
│   ├── AddressRepository.java       # Repository de endereços
│   └── UserRepository.java          # Repository de usuários
└── service/
    ├── GeocodeService.java          # Serviço de geocodificação
    └── UserService.java             # Serviço de usuários
```

## 👥 Perfis de Usuário

### CLIENTE
Perfil para clientes.
- Campos: nome, email, telefone, CPF

### EMPRESA
Perfil para empresas com campos adicionais.
- Campos comuns: nome, email, telefone, CNPJ
- Campos específicos:
  - `companyName`: Razão social
  - `tradeName`: Nome fantasia
  - `contactPerson`: Pessoa de contato
  - `acceptsPets`: Indica se aceita pets (true/false)
  - `companyType`: Tipo da empresa (enum: RESTAURANTE, PET_SHOP, HOTEL, CAFE, etc.)

## 🔒 Validações

- Email deve ser único e válido
- CPF/CNPJ deve ser único (quando informado)
- Todos os campos de endereço são obrigatórios
- Nome, email e perfil são obrigatórios
- Campos específicos de empresa são validados apenas para perfil EMPRESA

## 🐛 Tratamento de Erros

A API retorna respostas apropriadas para diferentes cenários de erro:

- **400 Bad Request**: Dados inválidos, email/CPF duplicado, endereço não encontrado
- **404 Not Found**: Usuário não encontrado
- **500 Internal Server Error**: Erro no servidor ou na API do Google Maps

Exemplo de resposta de erro:
```json
{
  "status": 400,
  "message": "Email já cadastrado: joao.silva@email.com",
  "timestamp": "2025-10-19T10:30:00"
}
```

## 📚 Tecnologias Utilizadas

- Java 17
- Spring Boot 3.1.5
- Spring Data JPA
- H2 Database
- Google Maps Services Java (2.2.0)
- Lombok
- Maven
- Bean Validation

## 🔄 Fluxo de Cadastro de Usuário

1. Cliente envia requisição POST com dados do usuário e endereço
2. Sistema valida dados (email único, CPF único, campos obrigatórios)
3. Sistema geocodifica o endereço usando Google Maps API
4. Endereço é salvo com coordenadas (latitude e longitude)
5. Usuário é criado e vinculado ao endereço
6. Resposta inclui todos os dados + link do Google Maps

---

**Observação:** Para visualizar as coordenadas no Google Maps, basta acessar o `googleMapsUrl` retornado pela API! 🗺️
