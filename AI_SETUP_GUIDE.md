# 🤖 Guia de Configuração da IA - Completo!

Tudo pronto! Aqui está como configurar sua IA:

---

## 📝 Passo 1: Obtenha suas chaves API

### Opção A: OpenAI (ChatGPT) 🧠
1. Acesse: https://platform.openai.com/api-keys
2. Clique em "Create new secret key"
3. Copie a chave (ela começa com `sk-`)

### Opção B: Google Gemini (Gratuito!) 🎨
1. Acesse: https://aistudio.google.com/app/apikey
2. Clique em "Create API Key"
3. Copie a chave gerada

---

## 🔑 Passo 2: Adicione as chaves no seu bot

### Se estiver usando Localmente:
Edite o arquivo `.env` e adicione:

```env
# Discord (já configurado)
DISCORD_TOKEN=seu-token
CLIENT_ID=seu-client-id
GUILD_ID=seu-guild-id

# IA - Escolha uma das opções
OPENAI_API_KEY=sk-sua-chave-openai-aqui
# OU
GEMINI_API_KEY=sua-chave-gemini-aqui
```

### Se estiver usando Render:
1. Vá para o Dashboard do Render
2. Clique no seu Web Service
3. Vá para "Environment"
4. Adicione uma nova variável:
   - **Name**: `OPENAI_API_KEY` ou `GEMINI_API_KEY`
   - **Value**: sua chave API
5. Salve e faça o deploy!

---

## ⚙️ Passo 3: Configure e ligue a IA

1. Certifique-se que o bot está online
2. No Discord, use o comando:
   - `/ai-set-provider` - Escolha OpenAI ou Gemini
   - `/ai-toggle true` - Liga o sistema de IA

---

## 🚀 Como usar a IA

1. **FAQ Automático**: Funciona sempre, sem configuração!
   - Basta perguntar algo como: "Como pego cargo?"

2. **IA Inteligente**: 
   - Mencione o bot: `@BotNome como eu crio um ticket?`
   - A IA responderá com contexto completo do servidor!

---

## 🎯 Todos os comandos de IA

- `/faq-add` - Adiciona nova pergunta no FAQ
- `/faq-list` - Lista todas as FAQs
- `/ai-toggle` - Liga/desliga a IA
- `/ai-set-provider` - Escolhe entre OpenAI ou Gemini

---

## 💡 Dicas importantes

1. **Gemini é Gratuito**: Recomendo começar por ele!
2. **OpenAI tem custo**: Mas é barato para bots pequenos
3. **Moderção**: Funciona automaticamente! Adicione palavras proibidas no `/data/moderation-rules.json`
4. **FAQ**: Adicione suas perguntas frequentes para respostas rápidas

---

## 🎉 Pronto!

Sua IA está 100% configurada! Qualquer dúvida, é só perguntar!
