# 🏗️ MSB Construções - Sistema de Controle de EPI

## ✨ Características Principais

- ✅ **Progressive Web App (PWA)** - Funciona como aplicativo nativo
- 📱 **Funciona offline** - Acesso completo sem conexão
- 🏥 **Compatível com iPhone/Safari** - Instalável como app
- 📊 **Relatórios e Exportação** - Excel e PDF
- 📲 **Responsivo** - Funciona em qualquer dispositivo
- 🔒 **Dados locais** - Tudo salvo no seu dispositivo

---

## 🚀 Como Configurar no GitHub Pages

### 1️⃣ Criar um Repositório no GitHub

```bash
# Clone o repositório ou crie um novo
git clone https://github.com/SEU_USUARIO/msb-construcoes-epi-control.git
cd msb-construcoes-epi-control
```

### 2️⃣ Fazer Upload dos Arquivos

Coloque os seguintes arquivos na raiz do repositório:

```
/
├── index.html
├── manifest.json
├── service-worker.js
├── README.md
└── assets/
    ├── icon-192.png
    └── icon-512.png
```

### 3️⃣ Ativar GitHub Pages

1. Vá para **Settings** do repositório
2. Role até **Pages**
3. Em "Source", selecione:
   - **Branch:** `main` (ou `gh-pages`)
   - **Folder:** `/ (root)`
4. Clique em **Save**
5. Aguarde alguns minutos

### 4️⃣ Acessar o Site

Seu app estará disponível em:
```
https://SEU_USUARIO.github.io/msb-construcoes-epi-control
```

---

## 📱 Instalar como App no iPhone (Safari)

### Via Safari:

1. Abra o link acima no **Safari**
2. Clique no ícone **Compartilhar** (seta para cima)
3. Selecione **"Adicionar à Tela de Início"**
4. Dê um nome e toque **Adicionar**
5. Pronto! O app aparece na home screen

### Características no iPhone:

- ✅ Funciona offline
- ✅ Acesso rápido da home screen
- ✅ Notificações em background (em breve)
- ✅ Interface fullscreen

---

## 🤖 Instalar como App no Android/Chrome

1. Abra o link no **Chrome**
2. Toque no menu (**⋮**) no canto superior
3. Selecione **"Instalar app"** ou **"Adicionar à tela inicial"**
4. Confirme

---

## 🔄 Como Atualizar a Versão

### Fazer Mudanças Locais:

```bash
# Edite os arquivos (index.html, etc)
git add .
git commit -m "Atualização: descrição das mudanças"
git push origin main
```

GitHub Pages atualizará automaticamente em alguns minutos.

### Limpar Cache (Forçar Atualização):

Os usuários podem:
1. Abrir o app
2. Abrir DevTools (F12)
3. Ir para **Application > Service Workers**
4. Clicar **Unregister**
5. Recarregar a página

---

## 💾 Dados e Privacidade

- ✅ **Todos os dados são armazenados localmente** no seu dispositivo
- ✅ **Nenhuma informação é enviada** para servidores externos
- ✅ **Sincronização manual** entre dispositivos (você copia/cola os dados)
- ✅ **Backup automático** - Exporte regularmente como Excel

---

## 📊 Como Usar

### 1. Cadastrar Funcionários

- Aba **Cadastros**
- Preencha: Nome, CPF, Função
- Clique **Cadastrar**

### 2. Cadastrar EPIs

- Aba **Cadastros**
- Preencha: Nome, Código CA, Quantidade, Valor, Fornecedor
- Clique **Cadastrar**

### 3. Registrar Entrega

- Aba **Entregas**
- Selecione: Funcionário, EPI, Quantidade
- Clique **Registrar Entrega**

### 4. Gerar Relatórios

- Aba **Relatórios**
- Clique nos botões de relatório desejado
- Exporte como Excel ou PDF

### 5. Gerenciar Base de Dados

- Aba **Base de Dados**
- Visualize e exporte todos os dados
- Deletar registros conforme necessário

---

## 🛠️ Estrutura Técnica

```
/
├── index.html              # Interface principal (HTML5 + CSS3 + JavaScript)
├── manifest.json           # Configuração PWA
├── service-worker.js       # Cache offline
├── assets/
│   ├── icon-192.png       # Ícone 192x192 (Android)
│   └── icon-512.png       # Ícone 512x512 (Splash screen)
└── README.md              # Este arquivo
```

### Tecnologias:

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Storage:** LocalStorage (Browser API)
- **PWA:** Service Workers + Manifest
- **Libs Externas:**
  - Font Awesome (ícones)
  - SheetJS (exportar Excel)
  - jsPDF (exportar PDF)
  - html2canvas (converter para imagem)
  - jQuery + jQuery Mask (formatação)

---

## 🔐 Segurança

- ✅ HTTPS obrigatório (GitHub Pages fornece)
- ✅ Sem login necessário (dados locais)
- ✅ Sem backend/servidor
- ✅ Compatível com todas as políticas de segurança

---

## 📱 Compatibilidade

| Dispositivo | Suporte |
|---|---|
| iPhone/iPad (Safari) | ✅ Completo |
| Android (Chrome) | ✅ Completo |
| Windows (Edge/Chrome) | ✅ Completo |
| macOS (Safari) | ✅ Completo |
| Firefox | ✅ Completo |

---

## 🐛 Troubleshooting

### App não instala no iPhone?
- Certifique-se que está usando **HTTPS** (GitHub Pages usa automaticamente)
- Tente em **modo normal** (não modo privado)
- Atualize o iOS

### Dados desapareceram?
- Limpar cache do navegador pode apagar dados
- **Sempre faça backup** exportando como Excel
- Restaure a partir do backup

### Service Worker não funciona?
- Certifique-se que está em **HTTPS**
- Abra DevTools e vá para **Application > Service Workers**
- Verifique se está **Activated**

---

## 📝 Licença

Propriedade da **MSB Construções**  
Desenvolvido em 2026

---

## 👨‍💻 Suporte

Para dúvidas ou bugs:
1. Verifique este README
2. Abra uma **Issue** no GitHub
3. Contacte o desenvolvedor

---

**Última atualização:** 2026-03-03