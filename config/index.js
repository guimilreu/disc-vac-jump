const dotenv = require("dotenv");
const { z } = require("zod");
dotenv.config();

const envSchema = z.object({
	PORT: z.string().optional(),
	EMBED_ALLOWED_ORIGINS: z.string().optional().default("*"),
	LOG_LEVEL: z.string().optional().default("info"),
	DATA_DIR: z.string().optional().default("./data"),
	MAIL_COPY_TO: z.string().optional(),
	MAIL_ENABLED: z.string().optional().default("false"), // Nova variável
	JUMP_LOGO_PATH: z.string().optional().default("public/assets/logo.svg"),
	// AWS S3
	AWS_ACCESS_KEY_ID: z.string().optional(),
	AWS_SECRET_ACCESS_KEY: z.string().optional(),
	AWS_REGION: z.string().optional(),
	S3_BUCKET_NAME: z.string().optional(),
	S3_LINK_EXPIRATION: z.string().optional().default("300"), // 5 minutos

	// Google OAuth2 for Gmail
	GMAIL_CLIENT_ID: z.string().optional(),
	GMAIL_CLIENT_SECRET: z.string().optional(),
	GMAIL_REFRESH_TOKEN: z.string().optional(),
	GMAIL_USER: z.string().optional(), // O e-mail do qual você está enviando
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
	console.error("Erro de configuração:", parsed.error.flatten().fieldErrors);
	process.exit(1);
}
const env = parsed.data;

const config = {
	PORT: env.PORT || "3000",
	EMBED_ALLOWED_ORIGINS: env.EMBED_ALLOWED_ORIGINS.split(/[\s,]+/)
		.map((s) => s.trim())
		.filter(Boolean),
	LOG_LEVEL: env.LOG_LEVEL,
	DATA_DIR: env.DATA_DIR,
	MAIL_ENABLED: (env.MAIL_ENABLED || "false").toLowerCase() === "true", // Converte para booleano
	JUMP_LOGO_PATH: env.JUMP_LOGO_PATH,
	S3:
		env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY && env.S3_BUCKET_NAME
			? {
					accessKeyId: env.AWS_ACCESS_KEY_ID,
					secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
					region: env.AWS_REGION || "us-east-1",
					bucketName: env.S3_BUCKET_NAME,
					linkExpiration: Number(env.S3_LINK_EXPIRATION),
			  }
			: null,
	GMAIL:
		env.GMAIL_CLIENT_ID && env.GMAIL_CLIENT_SECRET && env.GMAIL_REFRESH_TOKEN && env.GMAIL_USER
			? {
					clientId: env.GMAIL_CLIENT_ID,
					clientSecret: env.GMAIL_CLIENT_SECRET,
					refreshToken: env.GMAIL_REFRESH_TOKEN,
					user: env.GMAIL_USER,
					copyTo: env.MAIL_COPY_TO,
			  }
			: null,
};

module.exports = { config };
