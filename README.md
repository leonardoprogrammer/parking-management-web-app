# Parking Management Web App

O **Parking Management Web App** é uma aplicação web desenvolvida com Angular para gerenciar estacionamentos. A aplicação permite que usuários administrem estacionamentos, adicionem veículos, gerenciem funcionários, visualizem históricos e muito mais. Este projeto foi projetado para ser intuitivo, eficiente e escalável.

---

## 🚀 Funcionalidades Principais

- **Autenticação de Usuários**:
  - Login e registro de novos usuários.
  - Recuperação e redefinição de senha.

- **Gerenciamento de Estacionamentos**:
  - Criação, edição e exclusão de estacionamentos.
  - Visualização de detalhes do estacionamento.

- **Controle de Veículos**:
  - Check-in e check-out de veículos.
  - Histórico de veículos estacionados.

- **Gerenciamento de Funcionários**:
  - Adição e remoção de funcionários.
  - Controle de permissões de acesso.

- **Perfil do Usuário**:
  - Atualização de informações pessoais.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**:
  - Angular 17
  - Angular Material
  - SCSS para estilização
  - Moment.js para manipulação de datas
  - Ngx-Mask e Currency Mask para formatação de campos

- **Backend**:
  - API RESTful (não incluída neste repositório)

- **Outras Ferramentas**:
  - RxJS para manipulação de streams reativas
  - TypeScript para tipagem estática
  - Zone.js para gerenciamento de mudanças no Angular

---

## 📂 Estrutura do Projeto

Abaixo está a estrutura principal do projeto:

```
src/
├── app/
│   ├── components/       # Componentes reutilizáveis
│   ├── dialogs/          # Diálogos modais (ex.: adicionar veículo)
│   ├── guards/           # Guards de rotas (auth e no-auth)
│   ├── interceptors/     # Interceptores HTTP (ex.: auth-interceptor)
│   ├── pages/            # Páginas principais da aplicação
│   │   ├── auth/         # Páginas de autenticação (login, registro, etc.)
│   │   ├── dashboard/    # Página inicial do usuário
│   │   ├── parking/      # Páginas relacionadas a estacionamentos
│   │   ├── profile/      # Página de perfil do usuário
│   ├── services/         # Serviços para comunicação com a API
│   ├── app.component.ts  # Componente raiz
│   ├── app.routes.ts     # Configuração de rotas
│   ├── app.config.ts     # Configuração da aplicação
├── assets/               # Recursos estáticos (imagens, ícones, etc.)
├── environments/         # Configurações de ambiente (dev/prod)
├── styles.scss           # Estilos globais
```

---

## ⚙️ Configuração e Execução

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Angular CLI](https://angular.io/cli) (versão 17 ou superior)

### Passos para Configuração

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/parking-management-web-app.git
   cd parking-management-web-app
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   ng serve
   ```

4. **Acesse a aplicação**: Abra o navegador e vá para [http://localhost:4200](http://localhost:4200).

---

## 🧪 Testes

### Testes Unitários

Execute os testes unitários com o Karma:
```bash
ng test
```

### Testes End-to-End

Execute os testes end-to-end (E2E):
```bash
ng e2e
```

---

## 🌐 Rotas da Aplicação

| Rota                  | Descrição                              | Guard Utilizado |
|-----------------------|----------------------------------------|-----------------|
| `/login`              | Página de login                       | `noAuthGuard`   |
| `/register`           | Página de registro                    | `noAuthGuard`   |
| `/dashboard`          | Dashboard principal                   | `authGuard`     |
| `/create-parking`     | Criar novo estacionamento              | `authGuard`     |
| `/manage/:id`         | Gerenciar estacionamento específico    | `authGuard`     |
| `/manage/:id/edit`    | Editar estacionamento                  | `authGuard`     |
| `/manage/:id/history` | Histórico de veículos                  | `authGuard`     |
| `/manage/:id/employees` | Gerenciar funcionários               | `authGuard`     |
| `/profile`            | Perfil do usuário                     | `authGuard`     |

---

## 📋 Scripts Disponíveis

### Desenvolvimento

Iniciar servidor de desenvolvimento:
```bash
npm start
```

Build para produção:
```bash
npm run build
```

Executar testes unitários:
```bash
npm test
```

---

## 📖 Documentação Adicional

- [Angular CLI: Documentação oficial](https://angular.io/cli)
- [Angular Material: Documentação oficial](https://material.angular.io/)
- [Moment.js: Documentação oficial](https://momentjs.com/)

---

## 🖼️ Screenshots

### Dashboard
<img alt="Dashboard" src="https://via.placeholder.com/800x400?text=Dashboard">

### Gerenciamento de Estacionamento
<img alt="Gerenciamento de Estacionamento" src="https://via.placeholder.com/800x400?text=Gerenciamento+de+Estacionamento">

---

## 🤝 Contribuição

Contribuições são bem-vindas! Siga os passos abaixo para contribuir:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature:
   ```bash
   git checkout -b minha-feature
   ```
3. Commit suas alterações:
   ```bash
   git commit -m "Minha nova feature"
   ```
4. Envie para o repositório remoto:
   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request.

---

## 📝 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---