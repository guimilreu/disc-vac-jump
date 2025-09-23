// Dados do teste VAC - 20 perguntas
const VAC_QUESTIONS = [
  {
    id: 1,
    text: "Quando eu não tenho nada para fazer à noite prefiro:",
    options: [
      { tag: "V", label: "Ver televisão, ler jornal ou revista" },
      { tag: "A", label: "Ouvir música e/ ou conversar com alguém" },
      { tag: "K", label: "Relaxar o corpo, fazer uma caminhada" }
    ]
  },
  {
    id: 2,
    text: "Quando ouço uma música:",
    options: [
      { tag: "V", label: "Faço logo uma imagem do cantor ou do tema da música" },
      { tag: "A", label: "Presto bem atenção na melodia e na letra" },
      { tag: "K", label: "Não consigo deixar de batucar com os pés ou mãos" }
    ]
  },
  {
    id: 3,
    text: "Quando penso em alguém que gosto muito, logo me lembro:",
    options: [
      { tag: "V", label: "De sua imagem" },
      { tag: "A", label: "Do som da sua voz" },
      { tag: "K", label: "Do calor da sua mão/ corpo" }
    ]
  },
  {
    id: 4,
    text: "Quando eu me lembro de um lugar que eu gosto, recordo primeiro:",
    options: [
      { tag: "V", label: "Da paisagem" },
      { tag: "A", label: "Dos sons que eu ouvi lá" },
      { tag: "K", label: "Das sensações que o local me proporciona" }
    ]
  },
  {
    id: 5,
    text: "Entendo e executo melhor uma tarefa quando:",
    options: [
      { tag: "V", label: "Me passarem por escrito o que eu devo fazer" },
      { tag: "A", label: "Alguém me explica detalhadamente como fazer" },
      { tag: "K", label: "Sinto que sou capaz de fazer o que de mim esperam" }
    ]
  },
  {
    id: 6,
    text: "Para eu tomar uma decisão:",
    options: [
      { tag: "V", label: "Visualizo todas as possibilidades antes de me decidir" },
      { tag: "A", label: "Ouço todo os argumentos, prós e contras, conversando comigo mesmo" },
      { tag: "K", label: "Peso prós e contras, sentindo qual a melhor escolha" }
    ]
  },
  {
    id: 7,
    text: "Minha preferência é por:",
    options: [
      { tag: "V", label: "Fotografia, pintura, leitura, desenhos, filmes, ver televisão, olhar as coisas" },
      { tag: "A", label: "Música, instrumentos musicais, concertos sinfônicos, sininhos" },
      { tag: "K", label: "Jogar bola, fazer trabalhos artesanais, fazer massagem" }
    ]
  },
  {
    id: 8,
    text: "Quando vou comprar uma roupa:",
    options: [
      { tag: "V", label: "Imagino-me usando a roupa" },
      { tag: "A", label: "Penso no que as pessoas vão dizer quando me virem de roupa nova" },
      { tag: "K", label: "Sinto o tecido, o caimento, o conforto" }
    ]
  },
  {
    id: 9,
    text: "Quando faço dieta, ginástica ou algo para melhorar meu físico, fico satisfeito quando:",
    options: [
      { tag: "V", label: "Olho-me no espelho e me vejo melhor do que antes" },
      { tag: "A", label: "Ouço as pessoas comentarem sobre mim" },
      { tag: "K", label: "Sinto meu corpo mais firme e em boa forma" }
    ]
  },
  {
    id: 10,
    text: "Quando faço contas normalmente verifico a resposta:",
    options: [
      { tag: "V", label: "Olhando os números para ver se estão corretos" },
      { tag: "A", label: "Contando os números baixinhos" },
      { tag: "K", label: "Contando nos dedos" }
    ]
  },
  {
    id: 11,
    text: "Na praia, o que mais me agrada:",
    options: [
      { tag: "V", label: "O visual da areia, do sol, da cor da água, das pessoas" },
      { tag: "A", label: "O som das ondas o sopro do vento, o burburinho das pessoas" },
      { tag: "K", label: "A sensação da areia nos pés, da água no corpo, do calor do sol, o cheiro do mar" }
    ]
  },
  {
    id: 12,
    text: "Para eu dormir, é mais importante que:",
    options: [
      { tag: "V", label: "O quarto esteja com a luminosidade adequada" },
      { tag: "A", label: "O quarto esteja silencioso ou com sons suaves" },
      { tag: "K", label: "A cama esteja bem confortável" }
    ]
  },
  {
    id: 13,
    text: "Se eu precisar ir a algum lugar e não souber exatamente onde fica, prefiro:",
    options: [
      { tag: "V", label: "Localizar-me olhando um guia de ruas ou até mesmo um mapa" },
      { tag: "A", label: "Perguntar a alguém onde fica o lugar" },
      { tag: "K", label: "Seguir a minha intuição que sempre me conduz ao caminho certo" }
    ]
  },
  {
    id: 14,
    text: "É mais fácil perceber quando uma pessoa está mentindo:",
    options: [
      { tag: "V", label: "Olhando a expressão facial da pessoa enquanto fala" },
      { tag: "A", label: "Pelo tom da voz" },
      { tag: "K", label: "Pela sensação que me dá de que algo não vai bem" }
    ]
  },
  {
    id: 15,
    text: "Quando me aproximo de uma planta com flores, gosto de:",
    options: [
      { tag: "V", label: "Apreciar o cuidado e o colorido das flores" },
      { tag: "A", label: "Comentar sobre sua beleza" },
      { tag: "K", label: "Tocá-la e sentir seu perfume" }
    ]
  },
  {
    id: 16,
    text: "Comunico mais facilmente o que se passa comigo:",
    options: [
      { tag: "V", label: "Pelo modo como me visto" },
      { tag: "A", label: "Pelo tom da minha voz" },
      { tag: "K", label: "Pelos sentimentos que compartilho" }
    ]
  },
  {
    id: 17,
    text: "Quando assisto a um jogo de futebol ou de qualquer outro esporte o que mais me chama a atenção:",
    options: [
      { tag: "V", label: "São os times correndo, o movimento de armação das jogadas" },
      { tag: "A", label: "São os gritos e a cantoria das torcidas" },
      { tag: "K", label: "É a emoção de sentir as pessoas torcendo" }
    ]
  },
  {
    id: 18,
    text: "Quando não gosto de uma pessoa, desagrada-me quando:",
    options: [
      { tag: "V", label: "Percebo que ela se aproxima de mim" },
      { tag: "A", label: "Ela começa a falar comigo" },
      { tag: "K", label: "Sinto que ela está por perto" }
    ]
  },
  {
    id: 19,
    text: "Sei que estou indo bem profissionalmente quando:",
    options: [
      { tag: "V", label: "Vejo-me mudando para um local de trabalho mais confortável" },
      { tag: "A", label: "Ouço alguém elogiando meu trabalho" },
      { tag: "K", label: "Sinto-me satisfeito fazendo meu trabalho" }
    ]
  },
  {
    id: 20,
    text: "Pela manhã eu realmente gosto de acordar:",
    options: [
      { tag: "V", label: "E rapidamente olhar a paisagem, o sol, o orvalho" },
      { tag: "A", label: "Com o som do despertador ou de alguém me chamando" },
      { tag: "K", label: "Espreguiçando-me ou com alguém me tocando" }
    ]
  }
];

// Resultados do VAC
const VAC_RESULTS = {
  V: {
    title: "Perfil Visual",
    learning: "Observando gráficos, imagens, esquemas, mapas mentais, vídeos e materiais visuais bem organizados. Gosta de ver para entender. Costuma associar ideias a cores, formatos e estrutura.",
    strengths: "Boa memória visual, organização estética e clareza, pensamento estruturado e facilidade com leitura de ambientes, mapas, apresentações e apresentações visuais.",
    care: "Pode se desconcentrar com ambientes visuais confusos. Tende a não absorver tão bem conteúdos puramente falados. Precisa de recursos visuais para engajar."
  },
  A: {
    title: "Perfil Auditivo",
    learning: "Ouvindo explicações, participando de conversas, palestras, áudios, músicas ou podcasts. Gosta de dialogar para entender. Precisa ouvir para processar e memorizar.",
    strengths: "Comunicação clara e boa escuta. Capacidade de memorizar frases, nomes e conversas com facilidade. Pode ser um excelente facilitador de grupos, palestrante ou vendedor por telefone.",
    care: "Ambientes barulhentos podem causar distração. Conteúdos escritos podem ser menos eficazes se não forem lidos em voz alta ou discutidos."
  },
  K: {
    title: "Perfil Cinestésico",
    learning: "Fazendo, manipulando, testando, praticando. Gosta de experimentar para entender. Precisa colocar a mão na massa.",
    strengths: "Ação, energia, execução e vivência prática. Facilidade com habilidades manuais, movimento e resolução prática de problemas. Pode ser excelente em campo, produção, atendimento e simulações práticas.",
    care: "Pode se entediar com longas aulas teóricas. Precisa se movimentar, interagir ou manipular algo para fixar o conteúdo."
  }
};

module.exports = { VAC_QUESTIONS, VAC_RESULTS };
