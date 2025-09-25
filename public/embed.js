(function () {
	const view = document.getElementById("view");
	const state = { participant: null, disc: {}, vac: {} };

	stepCadastro();

	function stepCadastro() {
		view.innerHTML = `
      <div class="card">
        <div style="text-align:center;margin-bottom:24px">
          <h1 style="font-family:var(--font-family);font-weight:800;font-size:28px;color:var(--accent);margin:0 0 8px 0">Teste DISC e VAC</h1>
          	<p style="color:var(--muted);margin:0;font-size:16px">
				👋 Bem-vindo, Bem-vinda, Alegria!
				Você está ingressando no programa de treinamento da Jump e fazendo parte da nossa Alcateia, um grupo de vendedores que dominam técnica, relacionamento e processo de vendas, mas que acima de tudo entendem o valor do autoconhecimento e da inteligência emocional.
				Agora, através dos testes DISC e VAC (Visual, Auditivo e Cinestésico), você vai descobrir o que precisa usar de melhor no seu perfil, o que deve se proteger para não limitar seus resultados, e como reconhecer essas mesmas características nos seus clientes. É isso que vai permitir criar atendimentos de grande experiência e alcançar alta performance em vendas.
				👉 Responda com sinceridade. Mostre quem você é hoje, e não quem gostaria de ser. Só assim o resultado será verdadeiro e útil para a sua evolução.
				🚀 Vamos juntos nessa jornada de autoconhecimento e performance!
			</p>
        </div>
        <div class="grid cols-2">
          <div>
            <div class="label">Nome completo</div>
            <input id="name" class="input" placeholder="Seu nome"/>
          </div>
          <div>
            <div class="label">E-mail</div>
            <input id="email" class="input" placeholder="voce@exemplo.com"/>
          </div>
          <div style="grid-column:1/-1;display:flex;justify-content:center;margin-top:10px">
            <button id="go" class="btn">Iniciar</button>
          </div>
        </div>
      </div>`;
		document.getElementById("go").onclick = async () => {
			const name = byId("name").value.trim();
			const email = byId("email").value.trim();

			if (!name) return alert("Por favor, preencha seu nome completo");
			if (name.length < 2) return alert("Nome deve ter pelo menos 2 caracteres");
			if (!email) return alert("Por favor, preencha seu e-mail");
			if (!isValidEmail(email)) return alert("Por favor, insira um e-mail válido");

			state.participant = { name, email };
			return stepDISC();
		};
	}

	async function stepDISC() {
		try {
			const r = await fetch("/api/disc");
			if (!r.ok) {
				throw new Error(`Erro ${r.status}: ${r.statusText}`);
			}
			const data = await r.json();
			if (!data.success || !data.questions || !data.questions.length) {
				throw new Error("Sem perguntas do DISC disponíveis");
			}
			const { questions } = data;

			state.disc.questions = questions;
			state.disc.answers = [];
			let idx = 0;

			function render() {
				const q = questions[idx];
				view.innerHTML = `
          <div class="card">
            <div class="label">DISC • Pergunta ${idx + 1} de ${questions.length}</div>
            <div class="q" style="font-weight:600;margin:6px 0 10px">${q.text}</div>
            ${q.options
				.map((o) => `<label class="opt"><input type="radio" name="opt" value="${o.key}"> ${o.label}</label>`)
				.join("")}
            <div style="display:flex;gap:8px;justify-content:space-between;margin-top:10px">
              <button class="btn" id="prev" ${idx === 0 ? "disabled" : ""}>Voltar</button>
            </div>
          </div>`;

				// Adicionar evento para avanço automático ao clicar na opção
				document.querySelectorAll(".opt").forEach((label) => {
					label.addEventListener("click", () => {
						const radio = label.querySelector("input");
						radio.checked = true;
						state.disc.answers[idx] = { id: q.id, key: radio.value };
						setTimeout(() => {
							if (idx < questions.length - 1) {
								idx++;
								render();
							} else {
								finishDISC();
							}
						}, 200);
					});
				});

				byId("prev").onclick = () => {
					if (idx > 0) idx--;
					render();
				};
			}

			render();
		} catch (error) {
			console.error("Erro ao carregar DISC:", error);
			alert("Erro ao carregar as perguntas do DISC. Tente novamente.");
		}
	}

	async function finishDISC() {
		try {
			const r = await fetch("/api/disc/score", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ answers: state.disc.answers }),
			});

			if (!r.ok) {
				throw new Error(`Erro ${r.status}: ${r.statusText}`);
			}

			const resp = await r.json();
			if (!resp.success) {
				throw new Error(resp.error || "Erro ao processar resultados DISC");
			}

			state.disc.result = resp;
			return stepVAC();
		} catch (error) {
			console.error("Erro ao finalizar DISC:", error);
			alert("Erro ao processar suas respostas do DISC. Tente novamente.");
		}
	}

	async function stepVAC() {
		try {
			const r = await fetch("/api/vac");
			if (!r.ok) throw new Error(`Erro ${r.status}: ${r.statusText}`);

			const data = await r.json();
			if (!data.success || !data.questions?.length) {
				throw new Error("Sem perguntas do VAC disponíveis");
			}

			const { questions } = data;
			state.vac.questions = questions;
			state.vac.answers = [];
			let idx = 0;

			function render() {
				const q = questions[idx];

				if (!state.vac.answers[idx]) {
					state.vac.answers[idx] = { id: q.id, ranks: {} };
				}
				const currentRanks = state.vac.answers[idx].ranks;

				view.innerHTML = `
					<div class="card">
						<div class="label">VAC • Questão ${idx + 1} de ${questions.length}</div>
						<div class="q">${q.text}</div>
						<div class="label">Clique nas opções para ordená-las: 1º, 2º e 3º.</div>
						<div id="vac-list">
							${q.options
								.map(
									(o) => `
								<div class="vac-item" data-tag="${o.tag}">
									<span class="item-label">${o.label}</span>
									${currentRanks[o.tag] ? `<span class="rank-circle">${currentRanks[o.tag]}</span>` : ""}
								</div>
							`
								)
								.join("")}
						</div>
						<div style="display:flex;justify-content:space-between;margin-top:20px;">
							<button class="btn" id="prev" ${idx === 0 ? "disabled" : ""}>Voltar</button>
							<button class="btn" id="next" ${Object.keys(currentRanks).length === 3 ? "" : "disabled"}>${
					idx === questions.length - 1 ? "Concluir VAC" : "Próximo"
				}</button>
						</div>
					</div>`;

				const getNextAvailableRank = (ranks) => {
					const usedRanks = new Set(Object.values(ranks));
					for (let i = 1; i <= 3; i++) {
						if (!usedRanks.has(i)) return i;
					}
					return null;
				};

				document.querySelectorAll(".vac-item").forEach((item) => {
					item.addEventListener("click", () => {
						const tag = item.dataset.tag;
						if (currentRanks[tag]) {
							delete currentRanks[tag];
						} else {
							const nextRank = getNextAvailableRank(currentRanks);
							if (nextRank) {
								currentRanks[tag] = nextRank;
							}
						}
						render();
					});
				});

				byId("prev").onclick = () => {
					if (idx > 0) {
						idx--;
						render();
					}
				};

				byId("next").onclick = () => {
					if (Object.keys(currentRanks).length !== 3) return;

					const sorted = Object.entries(currentRanks).sort((a, b) => a[1] - b[1]);
					state.vac.answers[idx] = {
						id: q.id,
						first: sorted[0][0],
						second: sorted[1][0],
						third: sorted[2][0],
					};

					if (idx < questions.length - 1) {
						idx++;
						render();
					} else {
						finishVAC();
					}
				};
			}
			render();
		} catch (error) {
			console.error("Erro ao carregar VAC:", error);
			alert("Erro ao carregar as perguntas do VAC. Tente novamente.");
		}
	}

	async function finishVAC() {
		try {
			const r = await fetch("/api/vac/score", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ answers: state.vac.answers }),
			});

			if (!r.ok) {
				throw new Error(`Erro ${r.status}: ${r.statusText}`);
			}

			const resp = await r.json();
			if (!resp.success) {
				throw new Error(resp.error || "Erro ao processar resultados VAC");
			}

			state.vac.result = resp;
			return stepResultados();
		} catch (error) {
			console.error("Erro ao finalizar VAC:", error);
			alert("Erro ao processar suas respostas do VAC. Tente novamente.");
		}
	}

	function stepResultados() {
		const d = state.disc.result;
		const v = state.vac.result;

		// Calcular porcentagens DISC
		const totalDisc = Object.values(d.score).reduce((sum, val) => sum + val, 0) || 1;
		const discPcts = {
			D: ((d.score.D / totalDisc) * 100).toFixed(1),
			I: ((d.score.I / totalDisc) * 100).toFixed(1),
			S: ((d.score.S / totalDisc) * 100).toFixed(1),
			C: ((d.score.C / totalDisc) * 100).toFixed(1),
		};

		// Calcular porcentagens VAC
		const totalVac = Object.values(v.score).reduce((sum, val) => sum + val, 0) || 1;
		const vacPcts = {
			V: ((v.score.V / totalVac) * 100).toFixed(1),
			A: ((v.score.A / totalVac) * 100).toFixed(1),
			K: ((v.score.K / totalVac) * 100).toFixed(1),
		};

		view.innerHTML = `
      <div style="text-align:center;margin-bottom:20px">
        <h2 style="color:var(--accent);margin:0">🎉 Seus Resultados</h2>
        <p style="color:var(--muted);margin:5px 0">Parabéns por completar os testes DISC + VAC!</p>
      </div>
      
      <div class="grid cols-2" style="gap:16px">
        <div class="card">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
            <span style="font-size:24px">📊</span>
            <div>
              <div style="font-weight:700;color:var(--accent)">DISC</div>
              <div style="font-size:12px;color:var(--muted)">Perfil dominante: ${d.dominant}</div>
            </div>
          </div>
          ${bar("D", discPcts.D, 100)}${bar("I", discPcts.I, 100)}${bar("S", discPcts.S, 100)}${bar(
			"C",
			discPcts.C,
			100
		)}
          <div class="label" style="margin-top:12px">📝 Interpretação</div>
          <div style="font-size:13px;line-height:1.5;color:#909090">${escapeHtml(d.description || "")}</div>
        </div>
        
        <div class="card">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
            <span style="font-size:24px">🧠</span>
            <div>
              <div style="font-weight:700;color:var(--accent)">VAC</div>
              <div style="font-size:12px;color:var(--muted)">Dominante: ${fullVAC(v.dominant)}</div>
            </div>
          </div>
          ${bar("Visual", vacPcts.V, 100)}${bar("Auditivo", vacPcts.A, 100)}${bar("Cinestésico", vacPcts.K, 100)}
          <div class="label" style="margin-top:12px">📝 Interpretação</div>
          <div style="font-size:13px;line-height:1.5;color:#909090">${escapeHtml(v.description || "")}</div>
        </div>
      </div>
      
      <div class="card" style="margin-top:16px; border:1px solid var(--border-color);">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
          <div style="flex:1;min-width:200px">
            <div style="font-weight:600;margin-bottom:4px">📧 Relatório Personalizado</div>
            <div style="font-size:13px;color:var(--muted)">
              PDF será enviado para <strong style="color:var(--accent)">${state.participant.email}</strong><br>
              Cópia também enviada para a JUMP
            </div>
          </div>
          <button class="btn" id="pdf" style="flex-shrink:0;padding:12px 20px;font-weight:600">
            📄 Gerar PDF e Enviar
          </button>
        </div>
      </div>`;
		byId("pdf").onclick = async () => {
			try {
				const button = byId("pdf");
				button.disabled = true;
				button.textContent = "Gerando...";

				const payload = { participant: state.participant, disc: d, vac: v };
				const r = await fetch("/api/report", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});

				if (!r.ok) {
					throw new Error(`Erro ${r.status}: ${r.statusText}`);
				}

				const result = await r.json();
				if (!result.success) {
					throw new Error(result.error || "Erro ao gerar relatório");
				}

				// Abrir nova guia com o URL do PDF
				if (result.downloadUrl) {
					window.open(result.downloadUrl, "_blank");
				}

				if (result.emailed) {
					alert(
						"✅ Relatório enviado por e-mail com sucesso!\n\nVerifique sua caixa de entrada e também a pasta de spam.\nUma nova guia foi aberta com o PDF para visualização imediata."
					);
				} else {
					alert(
						"📄 Relatório gerado com sucesso! Uma nova guia foi aberta com o PDF para visualização/download."
					);
				}
			} catch (error) {
				console.error("Erro ao gerar relatório:", error);
				alert("❌ Erro ao gerar relatório: " + error.message);
			} finally {
				const button = byId("pdf");
				button.disabled = false;
				button.textContent = "Gerar PDF e Enviar";
			}
		};
	}

	function bar(label, val, max) {
		const pct = Math.max(0, Math.min(100, val)); // val is already a percentage
		const color = getBarColor(label);
		return `<div style="margin:8px 0">
			<div style="display:flex;justify-content:space-between;margin-bottom:4px">
				<span style="font-weight:500">${label}</span>
				<span style="color:var(--accent);font-weight:600">${val}%</span>
			</div>
			<div class="bar" style="position:relative">
				<div style="position:absolute;top:0;left:0;height:100%;width:${pct}%;background:${color};border-radius:6px;transition:width 0.3s ease"></div>
			</div>
		</div>`;
	}

	function getBarColor(label) {
		const colors = {
			D: "#FF6B6B",
			I: "#4ECDC4",
			S: "#45B7D1",
			C: "#96CEB4",
			Visual: "#FF6B6B",
			Auditivo: "#4ECDC4",
			Cinestésico: "#45B7D1",
		};
		return colors[label] || "var(--accent)";
	}

	function byId(id) {
		return document.getElementById(id);
	}
	function sel(q) {
		return document.querySelector(q);
	}
	function isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function fullVAC(v) {
		const mapping = {
			V: "Visual",
			A: "Auditivo",
			K: "Cinestésico",
		};
		return mapping[v] || v;
	}

	function escapeHtml(s) {
		return String(s).replace(
			/[&<>"']/g,
			(m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
		);
	}
})();
