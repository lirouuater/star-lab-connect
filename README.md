# SpaceBio Knowledge Engine 🚀

Plataforma de rede social para pesquisadores de biologia espacial. Desenvolvido para o NASA Space Apps Challenge 2025.

## 🌟 Visão Geral

SpaceBio é uma rede social acadêmica especializada em biologia espacial que conecta pesquisadores, facilita a publicação de artigos científicos e oferece um assistente de IA para auxiliar no desenvolvimento de pesquisas.

## ✨ Funcionalidades

- **Dashboard Interativo**: Landing page moderna com estatísticas da plataforma
- **Feed de Artigos**: Publicação e descoberta de artigos científicos
- **Chat em Tempo Real**: Comunicação direta entre pesquisadores
- **Assistente de IA**: Ferramenta inteligente para auxiliar em pesquisas
- **Perfis de Pesquisadores**: Perfis completos com publicações e conquistas
- **Configurações Personalizadas**: Controle de privacidade e notificações

## 🎨 Design

A interface utiliza um tema espacial moderno com:
- Paleta de cores cosmic (deep space blue, cosmic purple, nebula cyan)
- Gradientes dinâmicos e efeitos de brilho
- Animações suaves e fluidas
- Design responsivo e acessível
- Componentes shadcn-ui customizados

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Estilização**: Tailwind CSS
- **Componentes**: shadcn-ui
- **Roteamento**: React Router
- **State Management**: TanStack Query

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes shadcn-ui
│   ├── AppSidebar.tsx   # Navegação lateral
│   ├── Hero.tsx         # Seção hero da landing page
│   └── Features.tsx     # Seção de funcionalidades
├── pages/
│   ├── Index.tsx        # Página inicial (Dashboard)
│   ├── Feed.tsx         # Feed de artigos
│   ├── Chat.tsx         # Sistema de mensagens
│   ├── AIAssistant.tsx  # Assistente de IA
│   ├── Profile.tsx      # Perfil do usuário
│   └── Settings.tsx     # Configurações
└── index.css            # Design system e estilos globais
```

## 🎯 Roadmap

### Fase 1 - MVP (Concluído)
- [x] Interface principal
- [x] Sistema de navegação
- [x] Feed de artigos (mock)
- [x] Chat básico (mock)
- [x] Assistente de IA (interface)
- [x] Perfis de usuário

### Fase 2 - Backend
- [ ] Integração com Supabase/Lovable Cloud
- [ ] Sistema de autenticação
- [ ] Banco de dados para artigos
- [ ] Chat em tempo real
- [ ] Integração com API de IA

### Fase 3 - Features Avançadas
- [ ] Sistema de recomendação
- [ ] Análise bibliométrica
- [ ] Colaboração em documentos
- [ ] Integração com repositórios científicos

## 🌐 Deploy

O projeto está configurado para deploy através do Lovable:

1. Acesse [Lovable](https://lovable.dev/projects/22bd912f-df17-4a1f-a509-4e76c8bd3f7e)
2. Clique em Share → Publish
3. Configure domínio customizado (opcional)

## 🤝 Contribuindo

Projeto desenvolvido para o NASA Space Apps Challenge 2025.

## 📄 Licença

Este projeto é open source e está disponível para fins educacionais e de pesquisa.

---

**NASA Space Apps Challenge 2025** | SpaceBio Knowledge Engine
