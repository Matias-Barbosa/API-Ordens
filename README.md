# 📦 API de Gerenciamento de Pedidos

API REST desenvolvida em Node.js para gerenciamento de pedidos, com autenticação JWT e documentação Swagger.

## 🚀 Tecnologias

- **Node.js** com **Express.js**
- **PostgreSQL** com **Prisma ORM**
- **JWT** para autenticação
- **Zod** para validação de dados
- **Swagger** para documentação

## ⚙️ Como rodar o projeto

### Pré-requisitos
- Node.js instalado
- PostgreSQL instalado e rodando

### 1. Clone o repositório
```bash
git clone https://github.com/Matias-Barbosa/API-Ordens.git
cd API-Ordens
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o `.env`
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/orders_db"
JWT_SECRET="sua_chave_secreta"
PORT=3000
```

### 4. Execute as migrations
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Inicie o servidor
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## 📄 Documentação

A documentação completa da API está disponível via Swagger em:
```
http://localhost:3000/docs
```

## 🔐 Autenticação

A API utiliza autenticação via **JWT (JSON Web Token)**. Para acessar os endpoints protegidos:

1. Crie uma conta em `POST /auth/register`
2. Faça login em `POST /auth/login` e copie o token retornado
3. Envie o token no header de cada requisição:
```
Authorization: Bearer <seu_token>
```

## 📋 Endpoints

### Auth
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/auth/register` | Cadastrar novo usuário | ❌ |
| POST | `/auth/login` | Autenticar e obter token JWT | ❌ |

### Pedidos
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/pedidos` | Listar todos os pedidos | ✅ |
| GET | `/pedidos/:id` | Obter pedido por ID | ✅ |
| POST | `/pedidos` | Criar novo pedido | ✅ |
| PATCH | `/pedidos/:id/status` | Atualizar status do pedido | ✅ |
| DELETE | `/pedidos/:id` | Deletar pedido | ✅ |

## 📨 Exemplo de requisição

### Criar pedido
```json
{
  "numeroPedido": "v10089016vdb",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

### Status disponíveis
- `PENDING` — Pendente
- `CONFIRMED` — Confirmado
- `SHIPPED` — Enviado
- `DELIVERED` — Entregue
- `CANCELLED` — Cancelado