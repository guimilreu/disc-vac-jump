const puppeteer = require("puppeteer");
const hbs = require("handlebars");
const fs = require("fs/promises");
const path = require("path");

// --- Handlebars Helpers ---

// Helper para gerar um gráfico de barras SVG dinâmico
hbs.registerHelper("barChart", function (items, options) {
	const { maxValue, colors } = options.hash;
	const chartHeight = 150;
	const barWidth = 60; // Aumentado para dar mais espaço
	const barMargin = 30; // Aumentado para evitar sobreposição
	const width = items.length * (barWidth + barMargin) - barMargin;

	const bars = items
		.map((item, index) => {
			const barHeight = (item.value / maxValue) * (chartHeight - 30); // 30px de espaço para o valor
			const x = index * (barWidth + barMargin);
			const y = chartHeight - barHeight;
			const color = colors[index % colors.length];

			return `
            <g transform="translate(${x}, 0)">
                <rect x="0" y="${y}" width="${barWidth}" height="${barHeight}" rx="4" fill="${color}" />
                <text x="${barWidth / 2}" y="${y - 8}" text-anchor="middle" fill="#333" font-size="14" font-weight="bold">${item.value}</text>
                <text x="${barWidth / 2}" y="${chartHeight + 20}" text-anchor="middle" fill="#666" font-size="12" 
                      style="overflow: visible; white-space: normal; max-width: ${barWidth}px;">${item.label}</text>
            </g>
        `;
		})
		.join("");

	return new hbs.SafeString(`
        <svg width="${width}" height="${chartHeight + 30}" viewBox="0 0 ${width} ${chartHeight + 30}" xmlns="http://www.w3.org/2000/svg">
            ${bars}
        </svg>
    `);
});

// --- Template Loading ---

let compiledTemplate;
async function initTemplate() {
	try {
		const templateHtml = await fs.readFile(path.join(__dirname, "report-template.hbs"), "utf8");
		compiledTemplate = hbs.compile(templateHtml);
		console.log("Template de relatório HTML carregado e compilado.");
	} catch (error) {
		console.error("Falha ao carregar report-template.hbs:", error);
		process.exit(1);
	}
}
initTemplate();

// --- PDF Generation ---

async function generatePDF(participant, discResult, vacResult) {
	if (!compiledTemplate) {
		throw new Error("O template de relatório não foi compilado com sucesso.");
	}

	const discData = [
		{ label: "Dominância (D)", value: discResult.score.D },
		{ label: "Influência (I)", value: discResult.score.I },
		{ label: "Estabilidade (S)", value: discResult.score.S },
		{ label: "Conformidade (C)", value: discResult.score.C },
	];

	const vacData = [
		{ label: "Visual", value: vacResult.score.V },
		{ label: "Auditivo", value: vacResult.score.A },
		{ label: "Cinestésico", value: vacResult.score.K },
	];

	const renderData = {
		participant,
		discResult: {
			...discResult,
			data: discData,
			maxValue: Math.max(...discData.map((d) => d.value)),
			colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'] // Cores para D, I, S, C
		},
		vacResult: {
			...vacResult,
			data: vacData,
			maxValue: Math.max(...vacData.map((d) => d.value)),
			colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'] // Cores para Visual, Auditivo, Cinestésico
		},
		generationDate: new Date().toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		}),
	};

	const html = compiledTemplate(renderData);

	let pdfBuffer;
	let browser;
	try {
		browser = await puppeteer.launch({
			headless: true,
			executablePath: "/usr/bin/chromium",
			args: [
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"--disable-dev-shm-usage",
				"--disable-gpu",
				"--disable-software-rasterizer",
			],
			protocolTimeout: 60000, // aumenta tempo limite
		});

		const page = await browser.newPage();
		await page.emulateMediaType("screen");
		await page.setContent(html, { waitUntil: "networkidle0" });
		await page.evaluate(async () => {
			if (document && document.fonts && document.fonts.ready) {
				await document.fonts.ready;
			}
		});

		pdfBuffer = await page.pdf({
			format: "A4",
			margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
			printBackground: true,
		});
	} catch (error) {
		console.error("Erro ao gerar PDF com Puppeteer:", error);
		throw new Error("Falha na geração do PDF do relatório");
	} finally {
		if (browser) {
			await browser.close();
		}
	}

	return pdfBuffer;
}

module.exports = { generatePDF };
