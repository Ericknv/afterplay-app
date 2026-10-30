# 💽 Afterplay — Your Music Listening Diary

> *"O som termina. A experiência começa."*

O **Afterplay** é um diário de bordo e console analógico digital para audição atenta de música gravada. Projetado com estética de estúdio vintage (*Midnight Espresso*, *Tube Glow* e tons âmbar valvulados), o projeto elimina a pressa dos algoritmos de recomendação contemporâneos para focar no ritual de catalogar, refletir e revisitar álbuns completos.

A plataforma opera como uma **Single Page Application (SPA) estática** de alto desempenho construída inteiramente com tecnologias web nativas (*Vanilla Web*), hospedada no **GitHub Pages**, com persistência híbrida (*Offline-First* + *Cloud Auto-Sync*).

---

## 🧭 Sumário

* [Arquitetura Geral & Filosofia](#-arquitetura-geral--filosofia)
* [Visão Geral dos Módulos](#-visão-geral-dos-módulos)
* [Histórico Completo de Releases](#-histórico-completo-de-releases)
* [Stack Tecnológica & Engenharia de Dados](#-stack-tecnológica--engenharia-de-dados)
* [Estrutura de Diretórios](#-estrutura-de-diretórios)
* [Como Executar Localmente](#-como-executar-localmente)
* [Como Fazer Deploy](#-como-fazer-deploy)

---

## 🏛 Arquitetura Geral & Filosofia

O Afterplay adota três pilares conceituais de engenharia e design:

1. **Zero Framework Bloat:** Construído em HTML5, CSS3 moderno e JavaScript ES6+ puro. Sem dependência de bundlers pesados, Node.js para runtime ou frameworks de renderização. O código roda nativamente em qualquer navegador moderno.
2. **Respeito à Obra Completa:** Ao contrário de rastreadores focados em faixas individuais (*scrobbling* passivo), o Afterplay estimula o ouvinte a pontuar faixa a faixa, identificar o ponto alto (*faixa do coração*), anotar a atmosfera de escuta e redigir uma resenha crítica.
3. **Persistência Híbrida Desacoplada (Offline-First):** Toda a aplicação opera mesmo sem conexão externa. Ao conectar credenciais na nuvem, um motor assíncrono sincroniza alterações silenciosamente via REST.

---

## 🎛 Visão Geral dos Módulos

### 1. Home Editorial & Diário de Bordo (`#/` ou `#/diario`)
* **Hero Manifesto:** Apresentação da marca Afterplay, destacando os objetivos do estúdio.
* **Timeline de Avaliações:** Cartões com capa em alta resolução (600x600), data de audição, pontuação precisa por estrelas, selo da faixa favorita e tags de atmosfera (*Listening Moods*).
* **Filtros Dinâmicos:** Ordenação por data de adição, nota (maior/menor) e ano de lançamento, além de busca textual in-place e filtragem por chips de humor.
* **Ações Rápidas por Disco:** Edição in-place da resenha, inclusão em pastas temáticas, exclusão segura e disparo do *Card Studio*.

### 2. Busca Dedicada & Discografias Cronológicas (`#/busca`)
* **Rota Exclusiva:** Página desacoplada da Home para evitar sobrecarga visual, com atalho de teclado global (`/`).
* **Multi-Entidade em Paralelo:** Consulta concorrente na iTunes Search API para artistas e lançamentos avulsos.
* **Fotos de Artistas em Alta Resolução (Deezer API):** Enriquecimento visual com imagens reais dos músicos recuperadas via chamadas JSONP assíncronas.
* **Discografias Completas:** Visualização de até 100 álbuns de um artista, com algoritmo de desduplicação de títulos variantes (*Deluxe*, *Remaster*) e chave seletora de ordenação temporal (*Antigos ➔ Novos* / *Mais Recentes Primeiro*).

### 3. Fila da Vitrola (`#/want-to-listen`)
* Lista de espera para álbuns que o usuário pretende escutar nas próximas sessões.
* Ao avaliar um álbum que estava na fila, o sistema automaticamente o migra para o Diário Oficial, limpando a lista de pendências.

### 4. Pastas & Coleções Temáticas (`#/colecoes`)
* **Visualização de Mosaico:** Capas agrupadas em gavetas personalizadas (ex: *Obras-primas dos Anos 70*, *Madrugada Jazz*).
* **Console Detalhado da Coleção:** Ao abrir uma pasta, visualizam-se todos os discos participantes, média calculada de notas do acervo daquela pasta e botão para retirar títulos sem apagá-los do diário geral.

### 5. Perfil, Métricas de Estúdio & Desafio 2026 (`#/perfil`)
* **Mural Top 5 da Vida:** Os 5 discos supremos do ouvinte, com visual de vinil saindo da capa e botão para exportação em pôster HD.
* **Listening Challenge 2026:** Medidor de progresso anual com *Pace Tracker* inteligente (informa em tempo real se o ritmo do ouvinte está adiantado, em dia ou atrasado em relação ao dia do ano).
* **Histograma de Distribuição de Notas:** Frequência de notas concedidas de 0.5 a 5.0 estrelas, destacando o pico estatístico da coleção.
* **Linha do Tempo por Décadas:** Mapeamento histórico dos lançamentos ouvidos (anos 60s, 70s, 80s, etc.).
* **Top Artistas Catalogados:** Pódio com contagem de álbuns e média individual por músico.
* **Atmosferas de Escuta (Listening Moods):** Gráfico de barras com os humores e contextos mais frequentes das audições.

### 6. Afterplay Wrapped (Retrospectiva Mensal & Anual)
* Seleção dinâmica por mês/ano ou ano consolidado.
* Identificação automática do **Disco de Ouro do Período** (maior nota), **Artista Dominante**, **Nota Média** e **Mosaico de Capas**.
* Gerador integrado de Pôster Comemorativo em Canvas exportável em PNG vertical (1080x1350).

### 7. Card Studio 3.0 (Social Canvas Generator)
* Exportador nativo de cartões gráficos sem dependência de screenshots:
  * **4:5 (1080x1350):** Formato clássico para posts e carrosséis no Instagram.
  * **9:16 (1080x1920):** Formato imersivo para Stories e Reels.
  * **1:1 (1080x1080):** Formato quadrado clássico de encarte de vinil.
* Dois estilos tipográficos: **Studio Editorial** (com citação da resenha e selo da faixa favorita) e **Minimalista** (foco em arte pura e nota).
* 4 paletas analógicas: *Midnight Espresso*, *Tube Glow*, *Deep Velvet* e *Matte Graphite*.
* Modo dedicado para exportar o **Pôster Oficial do Top 5 da Vida**.

### 8. Audio Experience (Apple Music Previews)
* Prévia em áudio AAC de 30 segundos integrada nas listas de faixas de qualquer álbum.
* **Mini Player Analógico de Fita:** Console com animação de equalizador gráfico (VU meter), barra de progresso em tempo real e controle de reprodução sem travar a navegação.

### 9. Perfil de Acesso & Cloud Sync
* Indicador de status de conexão no cabeçalho (*ON AIR* / *OFFLINE*).
* Modal de autenticação (*Login* e *Cadastro*) integrada com isolamento de dados por identificador de usuário.
* Sincronização automática em segundo plano (*Auto-Sync*) a cada nova operação no banco local.
* Exportação e importação manual completa em formato JSON (`afterplay-backup-AAAA-MM-DD.json`).

---

## 🚀 Histórico Completo de Releases

| Versão | Principais Entregas |
| :--- | :--- |
| **Release 1.5** | • MVP de Diário e Avaliações<br>• SPA Hash Router e Navegação por Drawer<br>• Fila Want to Listen e Top 5 Inicial<br>• Card Studio Básico (4:5) |
| **Release 2.0** | • Rota Dedicada de Busca (`#/busca`)<br>• Integração Deezer para Fotos de Artistas<br>• Discografias Cronológicas Completas<br>• Visualizador Detalhado de Coleções<br>• Dashboard de Métricas (Histograma, Décadas, Ranking)<br>• Afterplay Wrapped (Mensal & Anual em PNG)<br>• Backup JSON e Favicon Oficial |
| **Release 3.0** | • Audio Experience (Previews de 30s + Mini Player com VU meter)<br>• Listening Moods (Tags de Vibe, Filtros Rápidos & Métricas)<br>• Card Studio 3.0 (Proporções 4:5, 9:16, 1:1)<br>• Pôster Oficial do Top 5 da Vida<br>• Console de Acesso & Sincronização em Nuvem (Supabase Auth / Local-Sync) |
| **Release 6.0 / Modernization** | • Blindagem contra XSS com DOMPurify e eliminação de inline handlers<br>• Arquitetura Modular em ES Modules (`src/`)<br>• Suporte PWA com Service Worker (`sw.js`) e `manifest.json`<br>• Store Reativa Centralizada e Router Desacoplado<br>• Desacoplamento de variáveis de ambiente (`.env.example`) |

---

## 🛠 Stack Tecnológica & Engenharia de Dados

| Camada | Tecnologia / Estratégia | Justificativa de Engenharia |
| :--- | :--- | :--- |
| **Interface / Markup** | HTML5 Semântico | Acessibilidade, SEO leve e renderização instantânea sem hidratação. |
| **Estilização** | CSS3 Moderno (Custom Properties, Grid, Flexbox) | Paleta de cores centralizada em variáveis, responsividade fluida para mobile/desktop. |
| **Tipografia** | *Inter* & *JetBrains Mono* (Google Fonts) | Combinação de legibilidade editorial com toque de console analógico de estúdio. |
| **Lógica & Roteamento** | Vanilla JavaScript ES6+ (SPA Hash Router) | Navegação via eventos `hashchange` sem recarregar página e compatível com GitHub Pages. |
| **Consumo de APIs** | JSONP Dinâmico (*Script Injection*) | Permite consultas diretas do cliente à Apple iTunes API e Deezer API sem bloqueios de CORS. |
| **Motor Gráfico** | HTML5 Canvas API | Renderização programática de pôsteres e cards HD com exportação via `canvas.toDataURL()`. |
| **Engine de Áudio** | HTML5 Audio API | Reprodução leve de streams AAC nativos com eventos de `timeupdate` e equalizador CSS sincronizado. |
| **Armazenamento Local** | `localStorage` API | Persistência instantânea de coleções, reviews e metas sem latência de rede. |
| **Armazenamento Nuvem** | Supabase REST API / Webhooks | Persistência remota e autenticação segura de contas de ouvinte. |
| **Deploy & CI/CD** | Git + GitHub Pages | Hospedagem estática com certificado SSL nativo e deploy via push na branch `main`. |

---

## 📁 Estrutura de Diretórios

```text
afterplay/
├── index.html        # Estrutura unificada da SPA, templates de views e modais
├── style.css         # Design system completo, variáveis de estúdio, animações e responsividade
├── app.js            # Motor central do estúdio
├── supabaseClient.js # Cliente de banco e autenticação com Supabase
├── manifest.json     # Metadados de instalação PWA (Progressive Web App)
├── sw.js             # Service Worker de cache e modo offline-first
├── .env.example      # Modelo de variáveis de ambiente para deploy
├── src/              # Módulos de arquitetura limpa (ES Modules)
│   ├── utils/        # Sanitização (DOMPurify), Toasts analógicos
│   ├── services/     # APIs externas (iTunes JSONP, Deezer)
│   ├── audio/        # Motor de áudio analógico e VU meter
│   ├── state/        # Store reativa centralizada (Pub/Sub)
│   └── router.js     # SPA Hash Router desacoplado
├── favicon.svg       # Ícone vetorial da marca para a aba do navegador
├── favicon.png       # Versão bitmap alternativa do favicon
└── README.md         # Documentação técnica e guia de desenvolvimento
