
# Plataforma de Arbitragem de Criptomoedas

Uma plataforma desenvolvida para realizar arbitragem de criptomoedas, utilizando dados em tempo real das exchanges Binance e Coinbase. O projeto foi construído com tecnologias modernas e é preparado para obter preços de mercado, executar ordens e explorar oportunidades de lucro em arbitragem.

---

## 🚀 Funcionalidades
- **Obtenção de preços em tempo real**: Consumo de dados públicos das APIs da Binance e Coinbase.
- **Execução de ordens**: Estrutura configurada para integrar autenticação e executar trades nas exchanges.
- **Interface moderna**: Desenvolvida com PrimeVue para criar uma experiência intuitiva e agradável.
- **Gerenciamento de estado**: Implementado com Pinia para controle eficiente dos dados.

---

## 🛠️ Tecnologias Utilizadas
- **Frontend**:
  - [Vue 3](https://vuejs.org/): Framework JavaScript progressivo.
  - [Vite](https://vitejs.dev/): Ferramenta de build rápida e eficiente.
  - [PrimeVue](https://primevue.org/): Biblioteca de componentes UI.
  - [Pinia](https://pinia.vuejs.org/): Gerenciador de estado para Vue.

- **Integração com APIs**:
  - [Binance API](https://binance-docs.github.io/apidocs/): Para consumo de dados de mercado e execução de trades.
  - [Coinbase API](https://developers.coinbase.com/): Para acesso a preços de criptomoedas e serviços de conta.

- **Configuração e Segurança**:
  - [dotenv](https://www.npmjs.com/package/dotenv): Para gerenciamento de variáveis de ambiente.

---

## ⚙️ Como Configurar e Executar

### 1. Pré-requisitos
- **Node.js** versão 16 ou superior.
- Gerenciador de pacotes como `npm` ou `yarn`.

### 2. Instalar Dependências
Clone o repositório e instale as dependências:
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
```env
VITE_BINANCE_API_KEY=sua-api-key-binance
VITE_BINANCE_API_SECRET=seu-segredo-binance
VITE_COINBASE_API_KEY=sua-api-key-coinbase
VITE_COINBASE_API_SECRET=seu-segredo-coinbase
```

> ⚠️ **Nota**: Certifique-se de adicionar o `.env` ao `.gitignore` para proteger suas credenciais.

### 4. Executar o Servidor de Desenvolvimento
Inicie o projeto localmente:
```bash
npm run dev
```
O servidor estará disponível em `http://localhost:3000`.

### 5. Gerar Build para Produção
Crie os arquivos otimizados para produção:
```bash
npm run build
```

---

## 📂 Estrutura do Projeto
```plaintext
src/
├── components/       # Componentes Vue
├── services/         # Integração com APIs (Binance e Coinbase)
├── stores/           # Gerenciamento de estado com Pinia
├── App.vue           # Componente raiz
├── main.ts           # Arquivo de inicialização do Vue
```

---

## 🧑‍💻 Contribuindo
1. Faça um fork do repositório.
2. Crie uma branch para sua feature:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça commit de suas mudanças:
   ```bash
   git commit -m "Minha nova feature"
   ```
4. Envie suas alterações:
   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request.

---

## 📜 Licença
Este projeto é licenciado sob a [MIT License](LICENSE).

---

## 🌟 Agradecimentos
Agradecemos às documentações da [Binance API](https://binance-docs.github.io/apidocs/) e [Coinbase API](https://developers.coinbase.com/) por suas ferramentas incríveis que possibilitaram o desenvolvimento deste projeto.
