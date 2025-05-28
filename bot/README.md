
# Discord Shop Bot 🛒

Bot completo para Discord com sistema de carrinho de compras, pagamentos PIX e tickets de suporte.

## 🚀 Funcionalidades

### 🛍️ Sistema de Loja
- **Cadastro de produtos** com nome, preço, descrição, estoque e cargo
- **Listagem de produtos** com botões interativos
- **Carrinho de compras** em canais privados por usuário
- **Checkout** com geração de QR Code PIX

### 💳 Sistema de Pagamentos
- **Geração automática** de códigos PIX
- **QR Code** para pagamento
- **Validação de pagamentos** (mock para testes)
- **Entrega automática** de produtos por DM
- **Atribuição de cargos** após compra

### 🎫 Sistema de Tickets
- **Abertura de tickets** via botão
- **Canais privados** entre usuário e suporte
- **Fechamento automático** de tickets

## 📦 Instalação

### 1. Clonar/Baixar o projeto
```bash
# Baixe todos os arquivos para uma pasta chamada "bot"
```

### 2. Instalar dependências
```bash
cd bot
npm install
```

### 3. Configurar variáveis de ambiente
```bash
# Copie o arquivo .env.example para .env
cp .env.example .env

# Edite o arquivo .env com seus dados:
TOKEN=SEU_TOKEN_DO_BOT
CLIENT_ID=ID_DO_SEU_BOT
GUILD_ID=ID_DO_SEU_SERVIDOR
SUPPORT_ROLE_ID=ID_DO_CARGO_DE_SUPORTE
```

### 4. Executar o bot
```bash
npm start
# ou para desenvolvimento:
npm run dev
```

## 🤖 Configuração do Bot Discord

### Permissões necessárias:
- ✅ Gerenciar Canais
- ✅ Gerenciar Cargos
- ✅ Enviar Mensagens
- ✅ Ver Canais
- ✅ Adicionar Reações
- ✅ Usar Comandos de Barra
- ✅ Gerenciar Mensagens

### Intents necessários:
- ✅ Guilds
- ✅ Guild Messages
- ✅ Message Content
- ✅ Guild Members
- ✅ Direct Messages

## 📋 Comandos Disponíveis

| Comando | Descrição | Permissão |
|---------|-----------|-----------|
| `/add-produto` | Cadastrar novo produto | Admin |
| `/editar-produto` | Editar produto existente | Admin |
| `/remover-produto` | Remover produto | Admin |
| `/listar-produtos` | Mostrar todos os produtos | Todos |
| `/ticket` | Configurar sistema de tickets | Admin |

## 🗃️ Estrutura do Banco de Dados

### Tabela `products`
- `id` - ID único do produto
- `name` - Nome do produto
- `price` - Preço do produto
- `description` - Descrição do produto
- `stock` - Quantidade em estoque
- `role_id` - ID do cargo dado após compra
- `thumbnail` - URL da imagem (opcional)
- `created_at` - Data de criação

### Tabela `carts`
- `id` - ID único do carrinho
- `user_id` - ID do usuário
- `channel_id` - ID do canal do carrinho
- `products` - JSON com produtos do carrinho
- `created_at` - Data de criação

### Tabela `sales`
- `id` - ID único da venda
- `user_id` - ID do usuário
- `products` - JSON com produtos comprados
- `total_price` - Valor total da compra
- `payment_status` - Status do pagamento
- `created_at` - Data da venda

## 🔧 Personalização

### Integração com APIs de Pagamento Reais
Para usar pagamentos reais, substitua o código mock em `events/interactionCreate.js` por integrações com:
- **MercadoPago API**
- **PagSeguro API** 
- **Stripe API**
- **PagTesouro API**

### Modificar Validação de Pagamentos
Edite a função `handleValidatePayment` para integrar com webhook de sua API de pagamentos.

## 📞 Suporte

- Crie um **issue** no repositório para reportar bugs
- Consulte a documentação do **discord.js** para customizações avançadas
- Verifique os **logs do console** para debug

## 🔄 Atualizações Futuras

- [ ] Interface web para administração
- [ ] Relatórios de vendas
- [ ] Sistema de cupons
- [ ] Produtos digitais com entrega automática
- [ ] Múltiplos métodos de pagamento

---

**⚠️ Importante:** Este bot inclui sistema de pagamentos mock para testes. Para uso em produção, integre com APIs de pagamento reais e implemente validações de segurança adequadas.
