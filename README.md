# Biblioteca Digital — Árvore Rubro-Negra

Sistema de gerenciamento de biblioteca digital desenvolvido como projeto acadêmico de Estrutura de Dados.

O sistema permite cadastrar e consultar livros, autores e categorias, além de controlar empréstimos e devoluções. O projeto utiliza uma **Árvore Rubro-Negra** como estrutura de dados para otimizar operações de busca e inserção no catálogo.

---

## Sobre o projeto

O projeto simula o funcionamento de uma biblioteca digital, permitindo o gerenciamento de seu catálogo e dos empréstimos realizados pelos usuários.

A principal proposta é demonstrar, na prática, a utilização de uma **Árvore Rubro-Negra (Red-Black Tree)** para o gerenciamento dos livros.

A escolha dessa estrutura está relacionada à necessidade de manter operações eficientes mesmo em situações de grande quantidade de inserções e consultas.

### Operações da Árvore Rubro-Negra

A Árvore Rubro-Negra mantém a árvore balanceada por meio de regras de coloração e rotações.

Complexidade no pior caso:

| Operação | Complexidade |
|---|---:|
| Busca | O(log n) |
| Inserção | O(log n) |
| Remoção | O(log n) |

Isso evita que a árvore se torne excessivamente desbalanceada, mantendo um desempenho previsível.

---

## Funcionalidades

### Catálogo

- Cadastro de livros
- Listagem de livros
- Busca de livros
- Atualização de livros
- Exclusão de livros
- Cadastro de autores
- Cadastro de categorias
- Associação entre livros e autores

### Empréstimos

- Realização de empréstimos
- Consulta de empréstimos
- Registro de devolução
- Controle de exemplares disponíveis
- Controle do status do empréstimo
- Associação entre usuário e empréstimo

### Usuários

- Cadastro de usuários
- Matrícula
- E-mail
- Senha
- Tipo de usuário
  - USER
  - ADMIN

### Árvore Rubro-Negra

O sistema possui uma área específica para visualizar a estrutura da Árvore Rubro-Negra utilizada no projeto.

A visualização permite compreender:

- Nós da árvore
- Cores dos nós
- Relações entre os nós
- Inserções
- Balanceamento
- Rotações

---

## Tecnologias

### Backend

- Node.js
- Express
- JavaScript
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- CORS
- dotenv

### Frontend

- HTML
- CSS
- JavaScript

### Estrutura de dados

- Árvore Rubro-Negra
- Busca
- Inserção
- Rotações
- Balanceamento

### Ferramentas

- Git
- GitHub
- Postman
- pgAdmin
- VS Code

---

## Arquitetura

O backend utiliza uma arquitetura baseada na separação de responsabilidades:

```text
                Cliente
                   │
                   ▼
                Routes
                   │
                   ▼
              Controller
                   │
                   ▼
                Service
                   │
                   ▼
              Repository
                   │
                   ▼
                Prisma
                   │
                   ▼
              PostgreSQL
