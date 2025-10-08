# Star-Lab Connect 🚀

Bem-vindo ao **Star-Lab Connect**, uma plataforma web de código aberto dedicada a explorar e visualizar um grafo de conhecimento sobre pesquisas em biologia espacial. O projeto combina um backend de processamento de dados em Python com uma interface interativa em React para tornar o conhecimento científico mais acessível e conectado.

## 🔮 Sobre o Projeto

Este repositório contém o código para uma aplicação full-stack que consiste em duas partes principais:

1.  **🚀 Knowledge Engine (Backend - Python)**: Um conjunto de scripts que ingere, processa e estrutura dados de artigos científicos e outras fontes sobre biologia espacial. Ele forma a base do nosso grafo de conhecimento.
2.  **🖥️ Interface Web (Frontend - React)**: Uma aplicação moderna e interativa que permite aos usuários navegar, pesquisar e visualizar as conexões dentro do grafo de conhecimento de forma intuitiva.

O objetivo é criar uma ferramenta poderosa para pesquisadores, estudantes e entusiastas da área, permitindo a descoberta de relações e insights que não são facilmente visíveis em textos brutos.

## ✨ Features Principais

* **Processamento de Dados**: Scripts em Python para ingestão e análise de texto a partir de fontes de dados.
* **Visualização de Grafo**: Interface interativa para explorar as entidades e suas relações.
* **Autenticação de Usuário**: Sistema de login para futuras funcionalidades personalizadas.
* **Design Responsivo**: Interface adaptável para uso em desktops e dispositivos móveis.

## 🛠️ Tecnologias Utilizadas

* **Frontend**:
    * [React](https://reactjs.org/)
    * [TypeScript](https://www.typescriptlang.org/)
    * CSS Modules / Styled-Components (para estilização)
* **Backend**:
    * [Python](https://www.python.org/)
    * (Sugestão) [Flask](https://flask.palletsprojects.com/) ou [FastAPI](https://fastapi.tiangolo.com/) para a criação da API.
* **Banco de Dados**:
    * (Sugestão) [Supabase](https://supabase.io/) ou outro banco de dados para armazenar os dados processados e informações de usuários.

## 🏁 Como Começar

Siga os passos abaixo para configurar e rodar o projeto localmente.

### Pré-requisitos

* [Node.js](https://nodejs.org/en/) (versão 16 ou superior)
* [Python](https://www.python.org/downloads/) (versão 3.9 ou superior)
* `npm` ou `yarn`

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/lirouuater/star-lab-connect.git](https://github.com/lirouuater/star-lab-connect.git)
    cd star-lab-connect
    ```

2.  **Instale as dependências do Frontend:**
    ```bash
    npm install
    ```

3.  **Instale as dependências do Backend:**
    ```bash
    pip install -r requirements.txt
    ```

### Rodando a Aplicação

A aplicação precisa que o frontend e o backend rodem simultaneamente em terminais separados.

1.  **Inicie o servidor de desenvolvimento do Frontend:**
    ```bash
    npm run dev
    ```
    Acesse `http://localhost:3000` (ou a porta indicada no terminal) no seu navegador.

2.  **Inicie o servidor do Backend (após a criação da API):**
    ```bash
    # Exemplo caso use Flask
    python api.py 
    ```

---

## 🗺️ Próximas Tasks (Roadmap)

Aqui está o plano para finalizar a integração e adicionar as funcionalidades principais do projeto.

### Prioridade Máxima: Integração Back-End e Front-End

-   [ ] **1. Desenvolver a API no Backend:**
    -   [ ] Utilizar Flask ou FastAPI para criar uma camada de API sobre os scripts Python.
    -   [ ] Criar um endpoint principal (ex: `/api/graph-data`) que retorna os dados do grafo (nós e arestas) em formato JSON.
    -   [ ] Criar um endpoint de busca (ex: `/api/search?q=termo`) para pesquisar no conhecimento processado.

-   [ ] **2. Conectar o Frontend com a API:**
    -   [ ] No código React, substituir os dados mocados (estáticos) por chamadas `fetch` para a nova API.
    -   [ ] Fazer o componente `KnowledgeGraph.tsx` renderizar os dados recebidos da API dinamicamente.
    -   [ ] Implementar um estado de "loading" enquanto os dados são carregados.

### Funcionalidades Adicionais

-   [ ] **3. Refinar a Visualização do Grafo:**
    -   [ ] Melhorar a interatividade: zoom, arrastar, clicar em um nó para ver mais detalhes.
    -   [ ] Adicionar filtros para exibir/ocultar tipos específicos de nós ou relações.

-   [ ] **4. Implementar a Funcionalidade de Busca na UI:**
    -   [ ] Criar uma barra de busca na interface.
    -   [ ] Conectar a busca ao endpoint `/api/search` e exibir os resultados de forma amigável.

-   [ ] **5. Aprimorar o Processamento de Dados:**
    -   [ ] Melhorar os algoritmos de extração de entidades e relações no backend.
    -   [ ] Adicionar mais fontes de dados para enriquecer o grafo.

### Finalização e Deploy

-   [ ] **6. Escrever Testes:**
    -   [ ] Adicionar testes unitários para as funções críticas do backend.
    -   [ ] Adicionar testes para os componentes principais do React.

-   [ ] **7. Preparar para o Deploy:**
    -   [ ] Documentar as variáveis de ambiente necessárias (chaves de API, etc.).
    -   [ ] Fazer o deploy do frontend em uma plataforma como [Vercel](https://vercel.com/) ou [Netlify](https://www.netlify.com/).
    -   [ ] Fazer o deploy do backend em uma plataforma como [Heroku](https://www.heroku.com/) ou um serviço de nuvem (AWS, GCP).

## 🤝 Como Contribuir

Contribuições são o que fazem a comunidade de código aberto um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito apreciada**.

1.  Faça um Fork do projeto
2.  Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Faça o Commit de suas alterações (`git commit -m 'Add some AmazingFeature'`)
4.  Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5.  Abra um Pull Request

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
