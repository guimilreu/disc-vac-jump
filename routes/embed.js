const path = require("path");
const express = require("express");
module.exports = function embedRouter({ csp, noStore }) {
	const router = express.Router();
	function setEmbedHeaders(res) {
		res.setHeader("Content-Security-Policy", csp);
		res.setHeader("X-Content-Type-Options", "nosniff");
		Object.entries(noStore).forEach(([k, v]) => res.setHeader(k, v));
	}
	router.get("/embed", (_req, res) => {
		setEmbedHeaders(res);
		res.sendFile(path.join(__dirname, "..", "public", "embed.html"));
	});
	router.get("/embed/raw", (_req, res) => {
		setEmbedHeaders(res);
		res.sendFile(path.join(__dirname, "..", "public", "embed.html"));
	});
	return router;
};
