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
		ACL: 'public-read', // Torna o objeto publicamente legível
	};

	return s3.upload(params).promise();
}

module.exports = {
	uploadFile,
	isS3Configured: () => !!config.S3,
};
