const path = require("path");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const { config } = require("./config");
const { buildCSP, buildStaticCache, buildNoStore } = require("./config/security");

const app = express();
app.set("trust proxy", 1); // Confiar apenas no primeiro proxy
app.use(express.json({ limit: "2mb" }));
// Rate limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 100, // máximo 100 requests por IP por janela
	message: {
		error: "Muitas tentativas. Tente novamente em 15 minutos.",
		retryAfter: "15 minutos"
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// app.use(limiter);

app.use(cors({
	origin: function (origin, callback) {
		// Permitir requests sem origin (mobile apps, curl, etc.)
		if (!origin) return callback(null, true);
		
		// Permitir origins configurados ou qualquer origin em desenvolvimento
		if (config.EMBED_ALLOWED_ORIGINS.includes("*") || 
			config.EMBED_ALLOWED_ORIGINS.includes(origin)) {
			return callback(null, true);
		}
		
		callback(new Error("Not allowed by CORS"));
	},
	credentials: true
}));

// Logging personalizado
if (config.LOG_LEVEL !== "silent") {
	const morganFormat = config.LOG_LEVEL === "debug" 
		? "dev" 
		: "combined";
	app.use(morgan(morganFormat));
}

// Monitoramento de métricas
const metrics = {
	requests: 0,
	errors: 0,
	discTests: 0,
	vacTests: 0,
	pdfsGenerated: 0,
	emailsSent: 0
};

// Logging customizado para requests da API
app.use("/api", (req, res, next) => {
	const start = Date.now();
	metrics.requests++;
	
	res.on("finish", () => {
		const duration = Date.now() - start;
		console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
		
		if (res.statusCode >= 400) {
			metrics.errors++;
		}
	});
	next();
});

// Endpoint de métricas
app.get("/metrics", (req, res) => {
	res.json({
		success: true,
		metrics: metrics,
		uptime: process.uptime(),
		memory: process.memoryUsage(),
		timestamp: new Date().toISOString()
	});
});

app.use(
	helmet({
		contentSecurityPolicy: false,
		frameguard: false,
		crossOriginEmbedderPolicy: false,
		crossOriginResourcePolicy: { policy: "cross-origin" },
	})
);
// Compressão otimizada
app.use(compression({
	level: 6,
	threshold: 1024,
	filter: (req, res) => {
		if (req.headers['x-no-compression']) {
			return false;
		}
		return compression.filter(req, res);
	}
}));

app.use("/public", express.static(path.join(__dirname, "public"), buildStaticCache()));

app.get("/health", (_req, res) => res.status(200).json({ status: "ok", ts: Date.now() }));

// SDK loader liberado cross-origin
const sdkRouter = require("./routes/sdk");
app.use("/sdk", sdkRouter(cors({ methods: ["GET"], origin: (_o, cb) => cb(null, true) })));

// API DISC + VAC
const apiRouter = require("./routes/api");
app.use("/api", apiRouter(metrics));

// EMBED
const embedRouter = require("./routes/embed");
app.use(
	"/",
	embedRouter({
		csp: buildCSP(config.EMBED_ALLOWED_ORIGINS),
		noStore: buildNoStore(),
	})
);

// Middleware de tratamento de erros
app.use((req, res) => {
	console.warn(`404 - Rota não encontrada: ${req.method} ${req.path}`);
	res.status(404).json({ 
		success: false,
		error: "Rota não encontrada", 
		path: req.path 
	});
});

app.use((err, req, res, next) => {
	console.error("Erro no servidor:", {
		error: err.message,
		stack: err.stack,
		path: req.path,
		method: req.method,
		timestamp: new Date().toISOString()
	});
	
	// Erro de CORS
	if (err.message === "Not allowed by CORS") {
		return res.status(403).json({
			success: false,
			error: "Acesso negado por CORS"
		});
	}
	
	// Erro de rate limiting
	if (err.status === 429) {
		return res.status(429).json({
			success: false,
			error: "Muitas tentativas. Tente novamente em 15 minutos."
		});
	}
	
	res.status(500).json({ 
		success: false,
		error: "Erro interno do servidor" 
	});
});

app.get("/", (_req, res) => {
    res.redirect("/embed");
});

const port = Number(config.PORT || 3000);
app.listen(port, () => console.log(`DISC+VAC up on :${port}`));
