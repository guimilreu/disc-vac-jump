# Sistema DISC + VAC - JUMP

Sistema completo de testes DISC e VAC com geração de relatórios em PDF e envio por e-mail.

## 🚀 Funcionalidades

- ✅ Teste DISC com 50 perguntas (embaralhadas)
- ✅ Teste VAC com 20 perguntas (sistema de ranking 1º, 2º, 3º)
- ✅ Geração de PDF personalizado com logo da JUMP
- ✅ Envio de e-mail com anexo PDF
- ✅ Interface responsiva e moderna
- ✅ Sistema de embed para sites externos
- ✅ Rate limiting e segurança
- ✅ Monitoramento e métricas
- ✅ Deploy automatizado com Docker

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker (para deploy)

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd projeto-eli
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Inicie o servidor:
```bash
npm start
```

## ⚙️ Configuração

### Variáveis de Ambiente (.env)

```env
# Servidor
PORT=3000
LOG_LEVEL=info
EMBED_ALLOWED_ORIGINS=*

# E-mail (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
MAIL_FROM=JUMP <noreply@jump.com>
MAIL_COPY_TO=jump@jump.com

# Caminhos
JUMP_LOGO_PATH=public/assets/logo.svg
```

### Configuração de E-mail

Para Gmail:
1. Ative a verificação em 2 etapas
2. Gere uma senha de app
3. Use a senha de app no campo `SMTP_PASS`

## 🌐 Endpoints da API

### DISC
- `GET /api/disc` - Obter perguntas (embaralhadas)
- `POST /api/disc/score` - Calcular pontuação

### VAC
- `GET /api/vac` - Obter perguntas
- `POST /api/vac/score` - Calcular pontuação

### Relatório
- `POST /api/report` - Gerar PDF e enviar por e-mail

### Monitoramento
- `GET /health` - Health check
- `GET /api/health` - Health check da API
- `GET /metrics` - Métricas da aplicação

## 🎯 Como Usar

### Via Embed
```html
<iframe src="http://seu-dominio.com/embed" 
        width="100%" 
        height="600px" 
        frameborder="0">
</iframe>
```

### Via API
```javascript
// Obter perguntas DISC
const discQuestions = await fetch('/api/disc').then(r => r.json());

// Calcular pontuação DISC
const discResult = await fetch('/api/disc/score', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ answers: discAnswers })
}).then(r => r.json());

// Gerar relatório
const report = await fetch('/api/report', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    participant: { name, email },
    disc: discResult,
    vac: vacResult
  })
}).then(r => r.json());
```

## 🐳 Deploy com Docker

### Deploy Automatizado
```bash
./deploy.sh production
```

### Deploy Manual
```bash
# Construir e iniciar
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

### Deploy em VPS

1. Configure o servidor:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose curl

# CentOS/RHEL
sudo yum install docker docker-compose curl
sudo systemctl start docker
sudo systemctl enable docker
```

2. Clone e configure:
```bash
git clone <repository-url>
cd projeto-eli
cp .env.example .env
# Edite .env com suas configurações
```

3. Execute o deploy:
```bash
chmod +x deploy.sh
./deploy.sh production
```

## 📊 Monitoramento

### Métricas Disponíveis
- Total de requests
- Testes DISC realizados
- Testes VAC realizados
- PDFs gerados
- E-mails enviados
- Uptime e uso de memória

### Acessar Métricas
```bash
curl http://localhost:3000/metrics
```

## 🔒 Segurança

- Rate limiting (100 req/15min por IP)
- Sanitização de inputs
- CORS configurável
- Headers de segurança
- Validação de dados
- Logs de auditoria

## 🎨 Personalização

### Logo
Substitua o arquivo `public/assets/logo.svg` pelo logo da JUMP.

### Cores e Estilo
Edite o arquivo `public/embed.css` para personalizar a aparência.

### Perguntas
Modifique os arquivos em `data/disc.js` e `data/vac.js`.

## 🐛 Troubleshooting

### Problemas Comuns

1. **E-mail não enviando**
   - Verifique configurações SMTP no .env
   - Confirme senha de app (Gmail)
   - Teste conectividade SMTP

2. **PDF não gerando**
   - Verifique se o logo existe em `public/assets/logo.svg`
   - Confirme permissões de escrita

3. **CORS errors**
   - Configure `EMBED_ALLOWED_ORIGINS` no .env
   - Verifique headers de origem

### Logs
```bash
# Ver logs da aplicação
docker-compose logs -f disc-vac-app

# Ver logs do nginx
docker-compose logs -f nginx
```

## 📝 Estrutura do Projeto

```
projeto-eli/
├── config/           # Configurações
├── data/            # Dados dos testes
├── middleware/      # Middlewares
├── public/          # Assets estáticos
├── routes/          # Rotas da API
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
├── deploy.sh
└── README.md
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da JUMP e está sob licença proprietária.

## 📞 Suporte

Para suporte técnico, entre em contato com a equipe de desenvolvimento da JUMP.
