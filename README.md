
# Limaris Studios - Bot do Discord

Bot de gerenciamento de servidor para a Limaris Studios, com funcionalidades de boas-vindas, moderação e devlogs.

## Funcionalidades

- 🎉 Sistema de boas-vindas automático
- 🔨 Comandos de moderação (banir, expulsar, promover)
- 📝 Sistema de devlogs
- Configuração fácil via comandos slash

## Configuração

1. **Crie um bot no Discord Developer Portal**
   - Acesse https://discord.com/developers/applications
   - Crie uma nova aplicação
   - Vá para a seção "Bot" e clique em "Add Bot"
   - Copie o token do bot (clique em "Reset Token")
   - Vá para a seção "OAuth2" → "URL Generator"
   - Marque as opções: `bot` e `applications.commands`
   - Marque as permissões: `Administrator` (ou as permissões específicas que o bot precisa)
   - Copie a URL gerada e adicione o bot ao seu servidor

2. **Configuração do projeto**
   - Renomeie o arquivo `.env.example` para `.env`
   - Preencha as variáveis:
     - `DISCORD_TOKEN`: Token do seu bot
     - `CLIENT_ID`: ID da sua aplicação (disponível no Discord Developer Portal)
     - `GUILD_ID`: ID do seu servidor Discord (ativar o Modo Desenvolvedor no Discord → Clicar com o botão direito no servidor → "Copiar ID")

3. **Instale as dependências**
   ```bash
   npm install
   ```

4. **Registre os comandos**
   ```bash
   node deploy-commands.js
   ```

5. **Inicie o bot**
   ```bash
   node index.js
   ```

## Comandos Disponíveis

- `/setwelcome [canal]`: Define o canal de boas-vindas
- `/setdevlog [canal]`: Define o canal de devlogs
- `/ban [membro] [motivo]`: Bane um membro
- `/kick [membro] [motivo]`: Expulsa um membro
- `/promover [membro] [cargo]`: Atribui um cargo a um membro
- `/devlog [titulo] [conteudo] [imagem]`: Envia um devlog

## Hospedagem Gratuita

Algumas opções de hospedagem gratuita para o seu bot:

1. **Discloud** (https://discloudbot.com/)
   - Hospedagem gratuita para bots do Discord
   - Fácil de usar
   - Suporta Node.js

2. **Render** (https://render.com/)
   - Plano gratuito com limitações
   - Bom para projetos pequenos

3. **Railway** (https://railway.app/)
   - Créditos gratuitos mensais
   - Fácil de configurar

4. **Replit** (https://replit.com/)
   - Hospedagem gratuita
   - Precisa de um "ping" periódico para manter o bot online (você pode usar serviços como UptimeRobot)

## Licença

ISC
