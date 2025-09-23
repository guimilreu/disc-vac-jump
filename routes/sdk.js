// routes/sdk.js
const express = require("express");

module.exports = function sdkRouter(corsMiddleware) {
	const router = express.Router();

	router.get("/embed-loader.js", corsMiddleware, (req, res) => {
		res.setHeader("Cross-origin-Resource-Policy", "cross-origin");
		res.setHeader("Content-Type", "application/javascript; charset=utf-8");
		res.setHeader("Cache-Control", "public, max-age=86400");
		const js = `(() => {
			const s = document.currentScript;
			const src = new URL(s.src);
			const base = src.origin;
			const params = new URLSearchParams();
			const pass = ['org', 'mode', 'theme', 'token'];
			pass.forEach(k => {
				const v = s.dataset[k];
				if (v != null && v !== '') params.set(k, v);
			});

			const width = s.dataset.width || '100%';
			
			// Lógica de altura corrigida
			let height = s.dataset.height || '600px';
			if (/^\\d+$/.test(height)) { // Se for apenas um número, adiciona 'px'
				height += 'px';
			}

			const auto = (s.dataset.autoHeight || '').toLowerCase() === 'true';

			const iframe = document.createElement('iframe');
			iframe.src = base + '/embed' + (params.toString() ? ('?' + params.toString()) : '');
			iframe.style.width = width;
			iframe.style.height = height;
			iframe.style.border = '0';
			iframe.setAttribute('title', 'JUMP Embed');
			
			s.parentNode.insertBefore(iframe, s);

			window.JUMP_EMBED = {
				iframe,
				postMessage: (msg) => {
					try {
						iframe.contentWindow.postMessage(msg, '*');
					} catch (e) {}
				}
			};

			window.addEventListener('message', (e) => {
				if (!e || !e.data || e.origin !== base) return;
				if (e.data.type === 'embed:height' && (auto || !s.dataset.height)) {
					iframe.style.height = e.data.height + 'px';
				}
			});
		})();`;
		res.end(js);
	});

	return router;
};
