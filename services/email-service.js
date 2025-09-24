const axios = require("axios");
const { config } = require("../config");

// Se a configuração do Brevo não existir, não faz nada
if (!config.BREVO) {
	console.warn("Configuração do Brevo não encontrada. O envio de e-mail via Brevo está desabilitado.");
}

/**
 * Envia um email usando a API do Brevo
 * @param {Object} emailData - Dados do email
 * @param {string} emailData.to - Email do destinatário
 * @param {string} emailData.subject - Assunto do email
 * @param {string} emailData.htmlContent - Conteúdo HTML do email
 * @param {string} emailData.textContent - Conteúdo texto do email (opcional)
 * @param {string} emailData.cc - Email para cópia (opcional)
 * @param {Array} emailData.attachments - Anexos (opcional)
 * @returns {Promise<Object>} Resposta da API do Brevo
 */
async function sendEmail(emailData) {
	if (!config.BREVO) {
		throw new Error("Configuração do Brevo não encontrada");
	}

	try {
		const payload = {
			sender: {
				name: config.BREVO.senderName || "JUMP",
				email: config.BREVO.senderEmail
			},
			to: [
				{
					email: emailData.to,
					name: emailData.toName || emailData.to
				}
			],
			subject: emailData.subject,
			htmlContent: emailData.htmlContent,
			textContent: emailData.textContent
		};

		// Adiciona cópia se especificado
		if (emailData.cc) {
			payload.cc = [
				{
					email: emailData.cc,
					name: emailData.ccName || emailData.cc
				}
			];
		}

		// Adiciona anexos se especificado
		if (emailData.attachments && emailData.attachments.length > 0) {
			payload.attachment = emailData.attachments.map(attachment => ({
				content: attachment.content, // Base64 encoded content
				name: attachment.name,
				type: attachment.type || "application/pdf"
			}));
		}

		const response = await axios.post(
			"https://api.brevo.com/v3/smtp/email",
			payload,
			{
				headers: {
					"accept": "application/json",
					"api-key": config.BREVO.apiKey,
					"content-type": "application/json"
				}
			}
		);

		return response.data;
	} catch (error) {
		console.error("Erro ao enviar email via Brevo:", error.response?.data || error.message);
		throw new Error(`Falha ao enviar email via Brevo: ${error.response?.data?.message || error.message}`);
	}
}

/**
 * Verifica se o serviço de e-mail do Brevo está configurado.
 * @returns {boolean}
 */
function isBrevoConfigured() {
	return !!config.BREVO;
}

/**
 * Envia um email com anexo PDF usando a API do Brevo
 * @param {Object} participant - Dados do participante
 * @param {Buffer} pdfBuffer - Buffer do PDF
 * @returns {Promise<Object>} Resposta da API do Brevo
 */
async function sendEmailWithPdf(participant, pdfLink) {
	if (!isBrevoConfigured()) {
		throw new Error("O serviço de e-mail do Brevo não está configurado.");
	}

	const emailData = {
		to: participant.email,
		toName: participant.name || participant.email,
		subject: "Seu Relatório DISC + VAC - JUMP",
		htmlContent: `
			<div style="font-family: 'Manrope', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<div style="background: #f0f0f0; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
					<img src="https://jump.hackdev.org/public/assets/logo-2.png?v=1" alt="Logo JUMP com fundo transparente" style="max-width: 150px; height: auto; background: transparent; display: block; margin: 0 auto;">
				</div>
				<div style="background: #ffffff; padding: 40px 20px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
					<h1 style="color: #333; font-size: 28px; margin-bottom: 20px; text-align: center;">Seu Relatório Está Pronto!</h1>
					<p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
						Olá <strong>${participant.name || 'Participante'}</strong>,
					</p>
					<p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
						Seu relatório personalizado DISC + VAC foi gerado com sucesso! 
						Acesse o relatório através deste link: <a href="${pdfLink}" style="color: #007bff; text-decoration: none;">Baixar Relatório PDF</a>
					</p>
					<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
						<h3 style="color: #333; margin-top: 0;">O que você encontrará no relatório:</h3>
						<ul style="color: #666; padding-left: 20px;">
							<li>Análise completa do seu perfil DISC</li>
							<li>Insights sobre seu estilo de comunicação</li>
							<li>Recomendações para desenvolvimento pessoal</li>
							<li>E muito mais!</li>
						</ul>
					</div>
					<p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
						Obrigado por participar da nossa análise!<br>
						<strong>Equipe JUMP</strong>
					</p>
				</div>
			</div>
		`,
		textContent: `
			Olá ${participant.name || 'Participante'},
			
			Seu relatório personalizado DISC + VAC foi gerado com sucesso! 
			Acesse o relatório através deste link: ${pdfLink}
			
			O que você encontrará no relatório:
			- Análise completa do seu perfil DISC
			- Insights sobre seu estilo de comunicação
			- Recomendações para desenvolvimento pessoal
			- E muito mais!
			
			Obrigado por participar da nossa análise!
			Equipe JUMP
		`,
		cc: config.BREVO.copyTo,
		attachments: [] // Removido o anexo
	};

	return await sendEmail(emailData);
}

module.exports = {
	sendEmail,
	sendEmailWithPdf,
	isBrevoConfigured,
};