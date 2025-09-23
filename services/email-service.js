const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { config } = require("../config");

// Se a configuração do Gmail não existir, não faz nada
if (!config.GMAIL) {
	console.warn("Configuração do Google/Gmail não encontrada. O envio de e-mail via Gmail está desabilitado.");
}

const OAuth2 = google.auth.OAuth2;

/**
 * Cria um transporter do Nodemailer configurado para usar OAuth2 com a API do Gmail.
 * @returns {Promise<import("nodemailer").Transporter | null>}
 */
async function createTransporter() {
	if (!config.GMAIL) {
		return null;
	}

	try {
		const oauth2Client = new OAuth2(
			config.GMAIL.clientId,
			config.GMAIL.clientSecret,
			"https://developers.google.com/oauthplayground"
		);

		oauth2Client.setCredentials({
			refresh_token: config.GMAIL.refreshToken,
		});

		const accessToken = await new Promise((resolve, reject) => {
			oauth2Client.getAccessToken((err, token) => {
				if (err) {
					reject("Falha ao criar o token de acesso do Gmail: " + err);
				}
				resolve(token);
			});
		});

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: config.GMAIL.user,
				clientId: config.GMAIL.clientId,
				clientSecret: config.GMAIL.clientSecret,
				refreshToken: config.GMAIL.refreshToken,
				accessToken: accessToken,
			},
		});

		return transporter;
	} catch (error) {
		console.error("Erro ao criar o transporter do Nodemailer para o Gmail:", error);
		return null;
	}
}

/**
 * Verifica se o serviço de e-mail do Gmail está configurado.
 * @returns {boolean}
 */
function isGmailConfigured() {
	return !!config.GMAIL;
}

module.exports = {
	createTransporter,
	isGmailConfigured,
};
