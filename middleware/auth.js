// middleware/auth.js
const crypto = require("crypto");

function hmacHex(secret, data) {
	return crypto
		.createHmac("sha256", secret)
		.update(String(data || ""))
		.digest("hex");
}

function extractToken(req) {
	const q = req.query?.token;
	const h = req.headers["x-embed-token"];
	const auth = req.headers["authorization"];
	if (q) return String(q);
	if (h) return String(h);
	if (auth && auth.toLowerCase().startsWith("bearer ")) return auth.slice(7);
	return null;
}

function requireAuth(config) {
	return function (req, res, next) {
		if (!config.EMBED_AUTH_REQUIRED) return next();

		const token = extractToken(req);
		const org = String(req.query?.org || "");

		if (!token) return res.status(401).json({ error: "token ausente" });

		const valid = token === config.EMBED_TOKEN_SECRET || token === hmacHex(config.EMBED_TOKEN_SECRET, org);
		if (!valid) return res.status(403).json({ error: "token inválido" });

		return next();
	};
}

module.exports = { requireAuth, hmacHex };
