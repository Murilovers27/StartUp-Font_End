# 🚀 Guia Rápido de Início

Este guia rápido irá ajudá-lo a colocar a API funcionando em **5 minutos**.

## ⚡ Passo a Passo Rápido

### 1️⃣ Configure a Chave do Google Maps (2 minutos)

Edite o arquivo `src/main/resources/application.properties`:

```properties
google.maps.api.key=COLOQUE_SUA_CHAVE_AQUI
```

> 📌 **Onde obter a chave?** 
> https://developers.google.com/maps/documentation/geocoding/get-api-key

### 2️⃣ Execute a Aplicação (1 minuto)

```bash
cd /Users/llcosta/Documents/estudo_maps
mvn spring-boot:run
```

Aguarde a mensagem: `Started MapsApiApplication in X seconds`

### 3️⃣ Teste seu Primeiro Cadastro (2 minutos)

Abra outro terminal e execute:

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Seu Nome",
    "email": "seu.email@exemplo.com",
    "phone": "(11) 98765-4321",
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

### 4️⃣ Visualize no Google Maps

Na resposta, você receberá algo como:

```json
{
  "address": {
    "googleMapsUrl": "https://www.google.com/maps?q=-23.5631313,-46.6566596"
  }
}
```

**Copie o link e cole no navegador** - você verá o endereço no mapa! 🗺️

## 🎯 Exemplos Prontos

Execute o script com **15 exemplos completos**:

```bash
./exemplos_usuarios_curl.sh
```

Ou importe a collection no Postman:
- Arquivo: `postman_collection.json`

## 📚 Principais Endpoints

### Criar Usuário
```bash
POST http://localhost:8080/api/users
```

### Listar Usuários
```bash
GET http://localhost:8080/api/users
```

### Buscar por ID
```bash
GET http://localhost:8080/api/users/1
```

### Listar por Perfil
```bash
GET http://localhost:8080/api/users/role/CLIENTE
GET http://localhost:8080/api/users/role/EMPRESA
```

## 🔧 Console H2 (Banco de Dados)

Acesse: http://localhost:8080/h2-console

**Configurações:**
- JDBC URL: `jdbc:h2:mem:mapsdb`
- User: `sa`
- Password: (deixe em branco)

Você pode consultar os dados diretamente:
```sql
SELECT * FROM USERS;
SELECT * FROM ADDRESSES;
```

## 📖 Documentação Completa

- **README.md** - Documentação completa da API
- **RESUMO.md** - Resumo executivo do projeto
- **GUIA_PERFIS.md** - Detalhes sobre os perfis de usuário

## 🎨 Perfis Disponíveis

1. **CLIENTE** - Para clientes finais
2. **EMPRESA** - Para pessoas jurídicas (tem campos extras)

### Exemplo de Empresa

```json
{
  "name": "Representante",
  "email": "contato@empresa.com",
  "role": "EMPRESA",
  "companyName": "Minha Empresa LTDA",
  "tradeName": "Minha Empresa",
  "contactPerson": "João Silva",
  "acceptsPets": true,
  "companyType": "COMERCIO",
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

## ✅ Checklist de Verificação

Antes de começar a usar, verifique:

- [ ] Java 17+ instalado (`java -version`)
- [ ] Maven instalado (`mvn -version`)
- [ ] Chave do Google Maps configurada
- [ ] Aplicação rodando na porta 8080
- [ ] Conseguiu fazer um POST com sucesso
- [ ] Link do Google Maps funcionando

## ❓ Problemas Comuns

### Erro: "Unauthorized" ou erro 403
- ✅ Verifique se colocou sua chave do Google Maps corretamente

### Erro: "Port 8080 already in use"
- ✅ Outra aplicação está usando a porta 8080
- ✅ Pare a outra aplicação ou mude a porta em `application.properties`:
  ```properties
  server.port=8081
  ```

### Erro: "No results found for address"
- ✅ Verifique se o endereço está correto
- ✅ Tente com um endereço mais conhecido (ex: Av. Paulista)

### Erro: "Email já cadastrado"
- ✅ Use um email diferente ou delete o usuário existente

## 🎉 Pronto!

Agora você tem:
- ✅ API funcionando
- ✅ Geocodificação automática
- ✅ Visualização no Google Maps
- ✅ 4 perfis de usuário
- ✅ CRUD completo

## 💡 Próximos Passos

1. Explore os outros endpoints (atualizar, desativar, deletar)
2. Teste com diferentes endereços e cidades
3. Crie usuários com todos os 4 perfis
4. Visualize os dados no console H2
5. Importe a collection no Postman para testes mais fáceis

## 📞 Arquivos de Ajuda

- `README.md` - Documentação completa
- `RESUMO.md` - Visão geral do projeto
- `GUIA_PERFIS.md` - Detalhes dos perfis
- `exemplos_usuarios_curl.sh` - 15 exemplos práticos
- `postman_collection.json` - Collection do Postman

---

**Divirta-se explorando a API! 🚀**

