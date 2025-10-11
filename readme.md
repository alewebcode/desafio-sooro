# 🏋️‍♂️ Sistema de Acompanhamento de IMC da Academia

Este projeto é um sistema web para academias que permite acompanhar a evolução do **Índice de Massa Corporal (IMC)** dos alunos.  
A aplicação foi desenvolvida utilizando **Node.js**, **Express**, **TypeORM** (com **SQLite**) e segue boas práticas de arquitetura como **Use Cases** e **Factories**, valorizando os princípios do **SOLID**.

---

## 📘 1. Visão Geral

O sistema permite:

- 👤 Cadastro de usuários com perfis: **Administrador**, **Professor** e **Aluno**.
- 🔄 Ativação e inativação de usuários.
- 🧮 Cadastro de avaliações de IMC com base na altura e peso dos alunos.
- 🔍 Consulta das avaliações com filtros por aluno ou professor.
- 🔐 Autenticação segura com usuário e senha.

---

## 👥 2. Perfis de Usuário e Regras de Negócio

### 👑 Administrador

- Pode cadastrar, editar e excluir usuários (exceto se houver avaliações vinculadas).
- Pode cadastrar, editar e excluir avaliações de IMC.
- Pode consultar avaliações de qualquer aluno.

### 🎓 Professor

- Pode cadastrar e editar alunos.
- Pode cadastrar e editar avaliações de IMC.
- Pode consultar avaliações **apenas dos seus alunos**.

### 🧍 Aluno

- Pode consultar apenas **suas próprias avaliações**.

### 🚫 Usuários Inativos

- Não podem acessar o sistema.
- Não podem ter novas avaliações cadastradas.

---

## ⚖️ 3. Classificação do IMC

| IMC (kg/m²) | Classificação      |
| ----------- | ------------------ |
| < 18.5      | Abaixo do peso     |
| 18.5 - 24.9 | Peso normal        |
| 25 - 29.9   | Sobrepeso          |
| 30 - 34.9   | Obesidade grau I   |
| 35 - 39.9   | Obesidade grau II  |
| ≥ 40        | Obesidade grau III |

---

## 🧩 4. Estrutura do Projeto

O projeto segue uma estrutura baseada em **Clean Architecture**, **SOLID** e boas práticas de desenvolvimento:

- **Controllers** → Recebem requisições HTTP e delegam a lógica para os casos de uso.
- **Use Cases** → Contêm a lógica de negócio isolada, facilitando testes e manutenção.
- **Repositories** → Responsáveis pela interação com o banco de dados.
- **Factories** → Criam instâncias de objetos, desacoplando a implementação concreta.
- **Entities** → Representam os modelos do domínio, como `User` e `Evaluation`.

### Instalação

# Instalar dependências

yarn install

# ou

npm install

### Rodar as Migrations (TypeORM)

# Se estiver usando Yarn

yarn typeorm migration:run

# Ou com NPM

npx typeorm migration:run

### Executar no front e back

npm run dev ou yarn dev

### 🚀 Tecnologias Utilizadas

- Node.js
- Express
- TypeORM
- SQLite
- React / Next.js (Frontend)
- Chakra UI
- React Query

### Env Frontend

- NEXT_PUBLIC_API_URL=http://localhost:3333

### Env Backend

- PORT = 3333
- DB_PATH=./database.sqlite
- JWT_SECRET=JWTSECRET
- REFRESH_SECRET=REFRESH_SECRET

### Acesso ao sistema

Um usuário default é criado ao executar as migrations
usuário:admin
senha:admin123
