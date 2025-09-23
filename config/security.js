// config/security.js
function buildCSP(allowedOrigins) {
	const frameAncestors = allowedOrigins.length ? allowedOrigins.join(" ") : "'none'";
	const directives = [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline' blob:", // Permitir scripts inline
		"script-src-elem 'self' 'unsafe-inline' blob:", // Permitir scripts inline
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: blob: https://jump.net.br",
		"font-src 'self' data:",
		"connect-src 'self'",
		"worker-src 'self' blob:",
		`frame-ancestors ${frameAncestors}`,
		"base-uri 'self'",
		"form-action 'self'",
	];
	return directives.join("; ");
}

function buildStaticCache() {
	return {
		setHeaders: (res, filePath) => {
			// Cache longo para assets
			if (/\.(css|js|svg|png|jpg|jpeg|gif|woff2?)$/i.test(filePath)) {
				res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
			} else {
				res.setHeader("Cache-Control", "public, max-age=3600");
			}
			res.setHeader("X-Content-Type-Options", "nosniff");
		},
	};
}

function buildNoStore() {
	return {
		"Cache-Control": "Fno-store, no-cache, must-revalidate, proxy-revalidate",
		Pragma: "no-cache",
		Expires: "0",
		"Surrogate-Control": "no-store",
	};
}

module.exports = { buildCSP, buildStaticCache, buildNoStore };
