const AWS = require("aws-sdk");
const { config } = require("../config");

if (!config.S3) {
	console.warn("Configuração do AWS S3 não encontrada. O upload de arquivos está desabilitado.");
} else {
	AWS.config.update({
		accessKeyId: config.S3.accessKeyId,
		secretAccessKey: config.S3.secretAccessKey,
		region: config.S3.region,
	});
}

const s3 = new AWS.S3();

/**
 * Faz upload de um buffer de arquivo para o Amazon S3.
 * @param {Buffer} buffer O buffer do arquivo a ser enviado.
 * @param {string} filename O nome do arquivo a ser salvo no S3.
 * @param {string} contentType O tipo de conteúdo do arquivo (e.g., 'application/pdf').
 * @returns {Promise<AWS.S3.ManagedUpload.SendData>} O resultado do upload do S3.
 */
async function uploadFile(buffer, filename, contentType) {
	if (!config.S3) {
		throw new Error("O serviço S3 não está configurado.");
	}

	const params = {
		Bucket: config.S3.bucketName,
		Key: filename,
		Body: buffer,
		ContentType: contentType,
	};

	return s3.upload(params).promise();
}

/**
 * Gera uma URL assinada para download de um arquivo do S3.
 * @param {string} key A chave (nome do arquivo) do objeto no S3.
 * @returns {Promise<string>} A URL assinada para download.
 */
async function getSignedUrl(key) {
	if (!config.S3) {
		throw new Error("O serviço S3 não está configurado.");
	}

	const params = {
		Bucket: config.S3.bucketName,
		Key: key,
		Expires: config.S3.linkExpiration,
	};

	return s3.getSignedUrlPromise("getObject", params);
}

module.exports = {
	uploadFile,
	getSignedUrl,
	isS3Configured: () => !!config.S3,
};
