const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { config } = require("../config");
const { DISC_QUESTIONS, DISC_RESULTS } = require("../data/disc");
const { VAC_QUESTIONS, VAC_RESULTS } = require("../data/vac");
const { generatePDF } = require("../services/pdf-service");
const { uploadFile, getSignedUrl, isS3Configured } = require("../services/s3-service");
const { sendEmailWithPdf, isBrevoConfigured } = require("../services/email-service");

function generateRandomUID() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

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

// Função para enviar e-mail usando Brevo API
async function sendEmail(participant, pdfBuffer) {
	// O envio agora depende exclusivamente do Brevo API
	if (!isBrevoConfigured()) {
		throw new Error("O serviço de e-mail do Brevo não está configurado.");
	}

	try {
		return await sendEmailWithPdf(participant, pdfBuffer);
	} catch (error) {
		console.error("Erro ao enviar email:", error);
		throw error;
	}
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

// Rota para obter perguntas do VAC (embaralhadas)
router.get('/vac', (req, res) => {
  try {
    const shuffledQuestions = shuffleArray(VAC_QUESTIONS);
    res.json({ 
      success: true, 
      questions: shuffledQuestions 
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

		let downloadUrl = null;
		let emailSent = false;

		// Sempre tentar upload para S3 se configurado
		if (isS3Configured()) {
			try {
				const filename = `relatorios/relatorio-${generateRandomUID()}.pdf`;
				const uploadResult = await uploadFile(pdfBuffer, filename, "application/pdf");
				downloadUrl = uploadResult.Location; // Usa a URL pública permanente
			} catch (s3error) {
				console.error("Falha no upload para o S3:", s3error);
			}
		}

		// Se S3 falhou ou não configurado, usar fallback local
		if (!downloadUrl) {
			const localFilename = `relatorio-${generateRandomUID()}.pdf`;
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

		// Tentar enviar e-mail com link
		try {
			if (isBrevoConfigured()) {
				await sendEmailWithPdf(participant, downloadUrl);
				emailSent = true;
				if (metrics) metrics.emailsSent++;
			}
		} catch (emailError) {
			console.error("Erro ao enviar e-mail:", emailError);
		}

		res.json({
			success: true,
			emailed: emailSent,
			downloadUrl: downloadUrl,
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