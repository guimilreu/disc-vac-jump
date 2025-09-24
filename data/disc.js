// Dados do teste DISC - 50 perguntas
const DISC_QUESTIONS = [
	{
		id: 1,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Determinado" },
			{ key: "I", label: "Comunicativo" },
			{ key: "S", label: "Paciente" },
			{ key: "C", label: "Preciso" },
		],
	},
	{
		id: 2,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Corajoso" },
			{ key: "I", label: "Animado" },
			{ key: "S", label: "Calmo" },
			{ key: "C", label: "Meticuloso" },
		],
	},
	{
		id: 3,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Assertivo" },
			{ key: "I", label: "Entusiasmado" },
			{ key: "S", label: "Leal" },
			{ key: "C", label: "Organizado" },
		],
	},
	{
		id: 4,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Competitivo" },
			{ key: "I", label: "Persuasivo" },
			{ key: "S", label: "Cooperativo" },
			{ key: "C", label: "Analítico" },
		],
	},
	{
		id: 5,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Direto" },
			{ key: "I", label: "Expressivo" },
			{ key: "S", label: "Amável" },
			{ key: "C", label: "Exato" },
		],
	},
	{
		id: 6,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Eficiente" },
			{ key: "I", label: "Inspirador" },
			{ key: "S", label: "Confiável" },
			{ key: "C", label: "Detalhista" },
		],
	},
	{
		id: 7,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Proativo" },
			{ key: "I", label: "Sociável" },
			{ key: "S", label: "Sereno" },
			{ key: "C", label: "Criterioso" },
		],
	},
	{
		id: 8,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Forte" },
			{ key: "I", label: "Influente" },
			{ key: "S", label: "Tranquilo" },
			{ key: "C", label: "Minucioso" },
		],
	},
	{
		id: 9,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Independente" },
			{ key: "I", label: "Espontâneo" },
			{ key: "S", label: "Compreensivo" },
			{ key: "C", label: "Metódico" },
		],
	},
	{
		id: 10,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Resoluto" },
			{ key: "I", label: "Carismático" },
			{ key: "S", label: "Estável" },
			{ key: "C", label: "Disciplinado" },
		],
	},
	{
		id: 11,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Confiante" },
			{ key: "I", label: "Otimista" },
			{ key: "S", label: "Prestativo" },
			{ key: "C", label: "Responsável" },
		],
	},
	{
		id: 12,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Ágil" },
			{ key: "I", label: "Agradável" },
			{ key: "S", label: "Moderado" },
			{ key: "C", label: "Conservador" },
		],
	},
	{
		id: 13,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Objetivo" },
			{ key: "I", label: "Falante" },
			{ key: "S", label: "Consistente" },
			{ key: "C", label: "Racional" },
		],
	},
	{
		id: 14,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Ambicioso" },
			{ key: "I", label: "Extrovertido" },
			{ key: "S", label: "Atencioso" },
			{ key: "C", label: "Cauteloso" },
		],
	},
	{
		id: 15,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Enérgico" },
			{ key: "I", label: "Acolhedor" },
			{ key: "S", label: "Discreto" },
			{ key: "C", label: "Técnico" },
		],
	},
	{
		id: 16,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Prático" },
			{ key: "I", label: "Afetuoso" },
			{ key: "S", label: "Sensível" },
			{ key: "C", label: "Precavido" },
		],
	},
	{
		id: 17,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Decidido" },
			{ key: "I", label: "Cativante" },
			{ key: "S", label: "Equilibrado" },
			{ key: "C", label: "Lógico" },
		],
	},
	{
		id: 18,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Inovador" },
			{ key: "I", label: "Charmoso" },
			{ key: "S", label: "Paciente" },
			{ key: "C", label: "Cuidadoso" },
		],
	},
	{
		id: 19,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Desafiador" },
			{ key: "I", label: "Inspirado" },
			{ key: "S", label: "Tolerante" },
			{ key: "C", label: "Controlado" },
		],
	},
	{
		id: 20,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Seguro" },
			{ key: "I", label: "Simpático" },
			{ key: "S", label: "Fiel" },
			{ key: "C", label: "Planejador" },
		],
	},
	{
		id: 21,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Iniciador" },
			{ key: "I", label: "Brincalhão" },
			{ key: "S", label: "Conciliador" },
			{ key: "C", label: "Estudioso" },
		],
	},
	{
		id: 22,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Autoconfiante" },
			{ key: "I", label: "Expressivo" },
			{ key: "S", label: "Discreto" },
			{ key: "C", label: "Objetivo" },
		],
	},
	{
		id: 23,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Franco" },
			{ key: "I", label: "Leve" },
			{ key: "S", label: "Diplomático" },
			{ key: "C", label: "Pontual" },
		],
	},
	{
		id: 24,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Impulsivo" },
			{ key: "I", label: "Risonho" },
			{ key: "S", label: "Comedido" },
			{ key: "C", label: "Sério" },
		],
	},
	{
		id: 25,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Rápido" },
			{ key: "I", label: "Conversador" },
			{ key: "S", label: "Reservado" },
			{ key: "C", label: "Justo" },
		],
	},
	{
		id: 26,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Aventureiro" },
			{ key: "I", label: "Animado" },
			{ key: "S", label: "Paciente" },
			{ key: "C", label: "Cuidadoso" },
		],
	},
	{
		id: 27,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Persistente" },
			{ key: "I", label: "Empático" },
			{ key: "S", label: "Tranquilo" },
			{ key: "C", label: "Detalhado" },
		],
	},
	{
		id: 28,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Direcionado" },
			{ key: "I", label: "Cordial" },
			{ key: "S", label: "Moderado" },
			{ key: "C", label: "Metódico" },
		],
	},
	{
		id: 29,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Rígido" },
			{ key: "I", label: "Alegre" },
			{ key: "S", label: "Amigável" },
			{ key: "C", label: "Formal" },
		],
	},
	{
		id: 30,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Desbravador" },
			{ key: "I", label: "Afável" },
			{ key: "S", label: "Solidário" },
			{ key: "C", label: "Crítico" },
		],
	},
	{
		id: 31,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Produtivo" },
			{ key: "I", label: "Criativo" },
			{ key: "S", label: "Leal" },
			{ key: "C", label: "Disciplinado" },
		],
	},
	{
		id: 32,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Ávido" },
			{ key: "I", label: "Empolgado" },
			{ key: "S", label: "Fiel" },
			{ key: "C", label: "Minucioso" },
		],
	},
	{
		id: 33,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Pragmático" },
			{ key: "I", label: "Envolvente" },
			{ key: "S", label: "Paciente" },
			{ key: "C", label: "Objetivo" },
		],
	},
	{
		id: 34,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Veloz" },
			{ key: "I", label: "Descontraído" },
			{ key: "S", label: "Compreensivo" },
			{ key: "C", label: "Pontual" },
		],
	},
	{
		id: 35,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Confiável" },
			{ key: "I", label: "Generoso" },
			{ key: "S", label: "Silencioso" },
			{ key: "C", label: "Observador" },
		],
	},
	{
		id: 36,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Pronto" },
			{ key: "I", label: "Encantador" },
			{ key: "S", label: "Gentil" },
			{ key: "C", label: "Cauteloso" },
		],
	},
	{
		id: 37,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Forte" },
			{ key: "I", label: "Empolgado" },
			{ key: "S", label: "Delicado" },
			{ key: "C", label: "Técnico" },
		],
	},
	{
		id: 38,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Convicto" },
			{ key: "I", label: "Simples" },
			{ key: "S", label: "Paciente" },
			{ key: "C", label: "Racional" },
		],
	},
	{
		id: 39,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Persistente" },
			{ key: "I", label: "Falante" },
			{ key: "S", label: "Contido" },
			{ key: "C", label: "Preciso" },
		],
	},
	{
		id: 40,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Inflexível" },
			{ key: "I", label: "Estimulante" },
			{ key: "S", label: "Diplomático" },
			{ key: "C", label: "Calculista" },
		],
	},
	{
		id: 41,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Resoluto" },
			{ key: "I", label: "Amigável" },
			{ key: "S", label: "Estável" },
			{ key: "C", label: "Criterioso" },
		],
	},
	{
		id: 42,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Produtivo" },
			{ key: "I", label: "Gentil" },
			{ key: "S", label: "Harmonioso" },
			{ key: "C", label: "Analítico" },
		],
	},
	{
		id: 43,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Determinado" },
			{ key: "I", label: "Conectado" },
			{ key: "S", label: "Equilibrado" },
			{ key: "C", label: "Rígido" },
		],
	},
	{
		id: 44,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Assertivo" },
			{ key: "I", label: "Engraçado" },
			{ key: "S", label: "Afável" },
			{ key: "C", label: "Planejador" },
		],
	},
	{
		id: 45,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Prático" },
			{ key: "I", label: "Flexível" },
			{ key: "S", label: "Comedido" },
			{ key: "C", label: "Certinho" },
		],
	},
	{
		id: 46,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Decisivo" },
			{ key: "I", label: "Social" },
			{ key: "S", label: "Fiel" },
			{ key: "C", label: "Precavido" },
		],
	},
	{
		id: 47,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Enérgico" },
			{ key: "I", label: "Conversador" },
			{ key: "S", label: "Contido" },
			{ key: "C", label: "Organizado" },
		],
	},
	{
		id: 48,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Ativo" },
			{ key: "I", label: "Agradável" },
			{ key: "S", label: "Tolerante" },
			{ key: "C", label: "Objetivo" },
		],
	},
	{
		id: 49,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Impulsivo" },
			{ key: "I", label: "Comunicativo" },
			{ key: "S", label: "Calado" },
			{ key: "C", label: "Formal" },
		],
	},
	{
		id: 50,
		text: "Qual desses adjetivos mais representa você?",
		options: [
			{ key: "D", label: "Disciplinado" },
			{ key: "I", label: "Encantador" },
			{ key: "S", label: "Compreensivo" },
			{ key: "C", label: "Sistemático" },
		],
	},
];

// Resultados do DISC
const DISC_RESULTS = {
	D: {
		title: "Dominância (D): O Executor",
		characteristics: "Foco em resultados, rapidez na tomada de decisões, assertividade, competitividade.",
		howToUse:
			"Explore sua capacidade de liderança e habilidade de resolver problemas rapidamente. Seja direto e objetivo, especialmente em negociações ou situações que pedem decisões rápidas.",
		care: "Evite ser excessivamente autoritário ou impaciente, especialmente com perfis mais detalhistas ou emotivos.",
	},
	I: {
		title: "Influência (I): O Comunicador",
		characteristics: "Extrovertido, persuasivo, entusiasmado, foca em conexões e inspiração.",
		howToUse:
			"Utilize sua energia e empatia para engajar pessoas, motivar equipes e criar relacionamentos duradouros. Sua habilidade em envolver os outros é valiosa em vendas e apresentações.",
		care: "Cuidado para não ser visto como superficial ou disperso. Esteja atento a detalhes importantes em tarefas.",
	},
	S: {
		title: "Estabilidade (S): O Apoio",
		characteristics: "Leal, paciente, calmo, busca harmonia e estabilidade.",
		howToUse:
			"Use sua empatia e confiabilidade para construir um ambiente de trabalho cooperativo. Sua paciência é essencial para resolver conflitos e apoiar equipes.",
		care: "Evite resistir demais às mudanças ou se sobre carregar ao dizer 'sim' a tudo. Aprenda a lidar com situações que exigem mais rapidez.",
	},
	C: {
		title: "Conformidade (C): O Analítico",
		characteristics: "Detalhista, perfeccionista, focado em qualidade, cumpre regras e padrões.",
		howToUse:
			"Mostre sua capacidade de análise e atenção aos detalhes para tomar decisões bem fundamentadas. Seu foco em qualidade é ideal para projetos complexos.",
		care: "Não deixe o perfeccionismo paralisar suas ações. Aprenda a aceitar soluções 'suficientemente boas' quando necessário.",
	},
};

module.exports = { DISC_QUESTIONS, DISC_RESULTS };
