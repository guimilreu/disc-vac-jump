const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { config } = require("../config");
const { DISC_QUESTIONS, DISC_RESULTS } = require("../data/disc");
const { VAC_QUESTIONS, VAC_RESULTS } = require("../data/vac");
const { generatePDF } = require("../services/pdf-service");
const { uploadFile, getSignedUrl, isS3Configured } = require("../services/s3-service");
const { createTransporter, isGmailConfigured } = require("../services/email-service");
const { v4: uuidv4 } = require("uuid");

// Garante que o diretório temporário para PDFs exista (para fallback)
const tempDir = path.join(__dirname, "..", "public", "temp");
if (!fs.existsSync(tempDir)) {
	fs.mkdirSync(tempDir, { recursive: true });
}

// Referência global para métricas (será injetada pelo server.js)
let metrics = null;

const router = express.Router();

// Utilitários
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para gerar gráfico de barras no PDF
function drawBarChart(doc, x, y, width, height, data, maxValue) {
  const barWidth = width / data.length;
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
  
  data.forEach((item, index) => {
    const barHeight = (item.value / maxValue) * height;
    const barX = x + (index * barWidth);
    const barY = y + height - barHeight;
    
    // Barra
    doc.rect(barX, barY, barWidth - 2, barHeight)
       .fillAndStroke(colors[index % colors.length], colors[index % colors.length]);
    
    // Label
    doc.fontSize(10)
       .fillColor('#000')
       .text(item.label, barX, y + height + 5, { align: 'center', width: barWidth - 2 });
    
    // Valor
    doc.text(item.value.toString(), barX, barY - 15, { align: 'center', width: barWidth - 2 });
  });
}

// Função para enviar e-mail (agora usando o novo serviço)
async function sendEmail(participant, pdfBuffer) {
	// O envio agora depende exclusivamente do Gmail via OAuth2
	if (!isGmailConfigured()) {
		throw new Error("O serviço de e-mail do Gmail não está configurado.");
	}

	const transporter = await createTransporter();
	if (!transporter) {
		throw new Error("Falha ao inicializar o transporter do Gmail. Verifique as configurações.");
	}

	const mailOptions = {
		from: config.GMAIL.user,
		to: participant.email,
		cc: config.GMAIL.copyTo,
		subject: "Seu Relatório DISC + VAC - JUMP",
		html: `
      <div style="font-family: 'Manrope', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="cid:logo" alt="JUMP" style="height: 60px;">
          <h1 style="color: #286bfe; margin: 10px 0;">Relatório DISC + VAC</h1>
        </div>
        
        <p>Olá <strong>${sanitizeInput(participant.name)}</strong>,</p>
        
        <p>Obrigado por participar do nosso teste DISC + VAC! Seu relatório personalizado está pronto e anexado a este e-mail.</p>
        
        <p>No relatório você encontrará:</p>
        <ul>
          <li>Seu perfil DISC dominante com interpretação detalhada</li>
          <li>Seu perfil VAC (Visual, Auditivo, Cinestésico) com recomendações</li>
          <li>Gráficos visuais dos seus resultados</li>
          <li>Orientações sobre como usar seus pontos fortes</li>
        </ul>
        
        <p>Este relatório é confidencial e foi gerado exclusivamente para você.</p>
        
        <p>Se tiver alguma dúvida ou quiser agendar uma conversa sobre seus resultados, entre em contato conosco.</p>
        
        <p>Atenciosamente,<br>
        <strong>Equipe JUMP</strong></p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          Este e-mail foi enviado automaticamente. Por favor, não responda a esta mensagem.
        </p>
      </div>
    `,
		attachments: [
			{
				filename: `relatorio-disc-vac-${sanitizeInput(participant.name).toLowerCase().replace(/\s+/g, "-")}.pdf`,
				content: pdfBuffer,
				contentType: "application/pdf",
			},
		],
	};

	// Adicionar logo ao e-mail se disponível
	if (config.JUMP_LOGO_PATH && fs.existsSync(config.JUMP_LOGO_PATH)) {
		try {
			const logoPath = config.JUMP_LOGO_PATH;
			const ext = path.extname(logoPath).toLowerCase();
			
			// Apenas adicionar se for um formato suportado para e-mail
			if (['.png', '.jpg', '.jpeg', '.gif'].includes(ext)) {
				mailOptions.attachments.push({
					filename: 'logo.png',
					path: logoPath,
					cid: 'logo'
				});
			}
		} catch (error) {
			console.warn('Erro ao adicionar logo ao e-mail:', error.message);
		}
	}

	return transporter.sendMail(mailOptions);
}

// Rota para obter perguntas do DISC (embaralhadas)
router.get('/disc', (req, res) => {
  try {
    const shuffledQuestions = shuffleArray(DISC_QUESTIONS);
    res.json({ 
      success: true, 
      questions: shuffledQuestions 
    });
  } catch (error) {
    console.error('Erro ao obter perguntas DISC:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Rota para calcular pontuação DISC
router.post('/disc/score', (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Respostas inválidas' 
      });
    }

    // Calcular pontuação
    const scores = { D: 0, I: 0, S: 0, C: 0 };
    
    answers.forEach(answer => {
      if (answer && answer.key && scores.hasOwnProperty(answer.key)) {
        scores[answer.key]++;
      }
    });

    // Encontrar perfil dominante
    const dominant = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const result = DISC_RESULTS[dominant];
    
    const description = `${result.title}\n\nCaracterísticas: ${result.characteristics}\n\nComo usar a favor: ${result.howToUse}\n\nCuidados: ${result.care}`;

    // Incrementar métrica
    if (metrics) metrics.discTests++;

    res.json({
      success: true,
      score: scores,
      dominant: dominant,
      description: description
    });
  } catch (error) {
    console.error('Erro ao calcular pontuação DISC:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Rota para obter perguntas do VAC
router.get('/vac', (req, res) => {
  try {
    res.json({ 
      success: true, 
      questions: VAC_QUESTIONS 
    });
  } catch (error) {
    console.error('Erro ao obter perguntas VAC:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Rota para calcular pontuação VAC
router.post('/vac/score', (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Respostas inválidas' 
      });
    }

    // Calcular pontuação VAC (10, 5, 0 para 1º, 2º, 3º)
    const scores = { V: 0, A: 0, K: 0 };
    
    answers.forEach(answer => {
      if (answer && answer.first && scores.hasOwnProperty(answer.first)) {
        scores[answer.first] += 10; // 1º lugar = 10 pontos
      }
      if (answer && answer.second && scores.hasOwnProperty(answer.second)) {
        scores[answer.second] += 5; // 2º lugar = 5 pontos
      }
      if (answer && answer.third && scores.hasOwnProperty(answer.third)) {
        scores[answer.third] += 0; // 3º lugar = 0 pontos
      }
    });

    // Encontrar perfil dominante
    const dominant = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const result = VAC_RESULTS[dominant];
    
    const description = `${result.title}\n\nComo aprender melhor: ${result.learning}\n\nPontos fortes: ${result.strengths}\n\nCuidados: ${result.care}`;

    // Incrementar métrica
    if (metrics) metrics.vacTests++;

    res.json({
      success: true,
      score: scores,
      dominant: dominant,
      description: description
    });
  } catch (error) {
    console.error('Erro ao calcular pontuação VAC:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// Rota para gerar relatório e enviar por e-mail
router.post('/report', async (req, res) => {
	try {
		const { participant, disc, vac } = req.body;

		// Validações
		if (!participant || !participant.name || !participant.email) {
			return res.status(400).json({
				success: false,
				error: "Dados do participante incompletos",
			});
		}

		if (!validateEmail(participant.email)) {
			return res.status(400).json({
				success: false,
				error: "E-mail inválido",
			});
		}

		if (!disc || !vac) {
			return res.status(400).json({
				success: false,
				error: "Resultados dos testes incompletos",
			});
		}

		// Gerar PDF com o novo serviço Puppeteer
		const pdfBuffer = await generatePDF(participant, disc, vac);

		// Incrementar métrica
		if (metrics) metrics.pdfsGenerated++;

		// Tentar enviar e-mail
		let emailSent = false;
		try {
			// Só tenta enviar se o SMTP estiver configurado E a feature estiver habilitada
			if (config.SMTP && config.MAIL_ENABLED) {
				await sendEmail(participant, pdfBuffer);
				emailSent = true;
				if (metrics) metrics.emailsSent++;
			}
		} catch (emailError) {
			console.error("Erro ao enviar e-mail:", emailError);
		}

		// Se o e-mail não foi enviado, preparar um link para download
		let downloadUrl = null;
		if (!emailSent) {
			const filename = `relatorios/relatorio-${uuidv4()}.pdf`;

			// Tenta fazer upload para o S3 se configurado
			if (isS3Configured()) {
				try {
					await uploadFile(pdfBuffer, filename, "application/pdf");
					downloadUrl = await getSignedUrl(filename);
				} catch (s3error) {
					console.error("Falha no upload para o S3. Usando fallback local:", s3error);
					// Se o S3 falhar, usa o método antigo como fallback
					const localFilename = path.basename(filename); // usa apenas o nome do arquivo
					const filePath = path.join(tempDir, localFilename);
					await fs.promises.writeFile(filePath, pdfBuffer);
					downloadUrl = `/public/temp/${localFilename}`;

					setTimeout(() => {
						fs.promises.unlink(filePath).catch((err) => {
							console.error(`Falha ao limpar arquivo temporário ${filePath}:`, err);
						});
					}, 5 * 60 * 1000);
				}
			} else {
				// Se S3 não está configurado, usa o método antigo
				const localFilename = `relatorio-${uuidv4()}.pdf`;
				const filePath = path.join(tempDir, localFilename);

				await fs.promises.writeFile(filePath, pdfBuffer);
				downloadUrl = `/public/temp/${localFilename}`;

				// Limpa o arquivo temporário após 5 minutos
				setTimeout(() => {
					fs.promises.unlink(filePath).catch((err) => {
						console.error(`Falha ao limpar arquivo temporário ${filePath}:`, err);
					});
				}, 5 * 60 * 1000);
			}
		}

		res.json({
			success: true,
			emailed: emailSent,
			downloadUrl: downloadUrl, // Envia a URL de download em vez do Base64
			message: emailSent
				? "Relatório enviado por e-mail com sucesso!"
				: "E-mail não pôde ser enviado. Use o download abaixo.",
		});
	} catch (error) {
		console.error("Erro ao gerar relatório:", error);
		res.status(500).json({
			success: false,
			error: "Erro interno do servidor",
		});
	}
});

// Rota de saúde da API
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

module.exports = (metricsRef) => {
	metrics = metricsRef;
	return router;
};