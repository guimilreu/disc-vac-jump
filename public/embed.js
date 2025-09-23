(function () {
	const view = document.getElementById("view");
	const state = { participant: null, disc: {}, vac: {} };

	stepCadastro();

	function stepCadastro() {
		view.innerHTML = `
      <div class="card">
        <div style="text-align:center;margin-bottom:24px">
          <h1 style="font-family:var(--font-family);font-weight:800;font-size:28px;color:var(--accent);margin:0 0 8px 0">Teste DISC e VAC</h1>
          <p style="color:var(--muted);margin:0;font-size:16px">Descubra seu perfil comportamental e estilo de aprendizagem</p>
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
              <button class="btn" id="next">${idx === questions.length - 1 ? "Concluir DISC" : "Próximo"}</button>
            </div>
          </div>`;
				byId("prev").onclick = () => {
					if (idx > 0) idx--;
					render();
				};
				byId("next").onclick = () => {
					const v = sel("input[name=opt]:checked");
					if (!v) return alert("Escolha uma alternativa");
					state.disc.answers[idx] = { id: q.id, key: v.value };
					if (idx < questions.length - 1) {
						idx++;
						render();
					} else {
						finishDISC();
					}
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

				view.innerHTML = `
					<div class="card">
						<div class="label">VAC • Questão ${idx + 1} de ${questions.length}</div>
						<div class="q">${q.text}</div>
						<div class="label">Clique nas setas para ordenar as opções.</div>
						<div id="vac-list">
							${q.options.map((o, i) => `
								<div class="vac-item" data-tag="${o.tag}">
									<span class="rank-handle">${i + 1}º</span>
									<span class="item-label">${o.label}</span>
									<div class="arrow-buttons">
										<button class="arrow-btn up-btn" title="Mover para cima">
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
										</button>
										<button class="arrow-btn down-btn" title="Mover para baixo">
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
										</button>
									</div>
								</div>
							`).join("")}
						</div>
						<div style="display:flex;justify-content:space-between;margin-top:20px;">
							<button class="btn" id="prev" ${idx === 0 ? "disabled" : ""}>Voltar</button>
							<button class="btn" id="next">${idx === questions.length - 1 ? "Concluir VAC" : "Próximo"}</button>
						</div>
					</div>`;
				
				const list = byId("vac-list");

				function updateButtons() {
					const items = list.querySelectorAll('.vac-item');
					items.forEach((item, index) => {
						item.querySelector('.up-btn').disabled = (index === 0);
						item.querySelector('.down-btn').disabled = (index === items.length - 1);
						item.querySelector('.rank-handle').textContent = `${index + 1}º`;
					});
				}

				list.addEventListener('click', e => {
					const button = e.target.closest('.arrow-btn');
					if (!button) return;

					const item = button.closest('.vac-item');
					if (button.classList.contains('up-btn')) {
						const prevSibling = item.previousElementSibling;
						if (prevSibling) {
							list.insertBefore(item, prevSibling);
						}
					} else if (button.classList.contains('down-btn')) {
						const nextSibling = item.nextElementSibling;
						if (nextSibling) {
							list.insertBefore(nextSibling, item);
						}
					}
					updateButtons();
				});
				
				updateButtons();

				byId("prev").onclick = () => {
					if (idx > 0) {
						idx--;
						render();
					}
				};

				byId("next").onclick = () => {
					const currentOrder = [...list.querySelectorAll('.vac-item')].map(item => item.dataset.tag);
					state.vac.answers[idx] = { 
						id: q.id, 
						first: currentOrder[0], 
						second: currentOrder[1], 
						third: currentOrder[2] 
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
		
		// Calcular máximo para normalizar as barras
		const maxDisc = Math.max(d.score.D, d.score.I, d.score.S, d.score.C);
		const maxVac = Math.max(v.score.V, v.score.A, v.score.K);
		
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
          ${bar("D", d.score.D, maxDisc)}${bar("I", d.score.I, maxDisc)}${bar("S", d.score.S, maxDisc)}${bar("C", d.score.C, maxDisc)}
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
          ${bar("Visual", v.score.V, maxVac)}${bar("Auditivo", v.score.A, maxVac)}${bar("Cinestésico", v.score.K, maxVac)}
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
				
				if (result.emailed) {
					alert("✅ Relatório enviado por e-mail com sucesso!\n\nVerifique sua caixa de entrada e também a pasta de spam.");
				} else if (result.downloadUrl) {
					// Usa a URL de download fornecida pelo servidor
					const a = document.createElement("a");
					a.href = result.downloadUrl;
					a.download = `relatorio-disc-vac-${state.participant.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
					document.body.appendChild(a); // Necessário para Firefox
					a.click();
					document.body.removeChild(a); // Limpa o elemento
					alert("📄 Relatório baixado com sucesso!");
				} else {
					alert("⚠️ Erro inesperado ao gerar relatório.");
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
		const pct = Math.max(0, Math.min(100, Math.round((val / max) * 100)));
		const color = getBarColor(label);
		return `<div style="margin:8px 0">
			<div style="display:flex;justify-content:space-between;margin-bottom:4px">
				<span style="font-weight:500">${label}</span>
				<span style="color:var(--accent);font-weight:600">${val}</span>
			</div>
			<div class="bar" style="position:relative">
				<div style="position:absolute;top:0;left:0;height:100%;width:${pct}%;background:${color};border-radius:6px;transition:width 0.3s ease"></div>
			</div>
		</div>`;
	}

	function getBarColor(label) {
		const colors = {
			'D': '#FF6B6B',
			'I': '#4ECDC4', 
			'S': '#45B7D1',
			'C': '#96CEB4',
			'Visual': '#FF6B6B',
			'Auditivo': '#4ECDC4',
			'Cinestésico': '#45B7D1'
		};
		return colors[label] || 'var(--accent)';
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
			K: "Cinestésico"
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
