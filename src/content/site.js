// =====================================================================
//  CONTEÚDO DO SITE — Barones Labs
//  Todo o texto da página mora aqui. Editar este arquivo nunca exige
//  mexer nas animações (timelines).
//
//  Convenção de títulos: palavras entre *asteriscos* recebem o destaque
//  ciano com duplo contorno magenta. Ex.: "Construindo *Negócios.*"
// =====================================================================

export const nav = [
  { label: 'Projetos', href: '#portfolio' },
  { label: 'Como funciona', href: '#process' },
  { label: 'Pacotes', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export const boot = { text: 'INICIALIZANDO_', skip: 'pular →' };

export const hud = {
  coords: 'LAT −22.90 · LON −43.17',
  system: 'SYS.V2.6 // BL-HQ00 · HOME',
  id: 'ID · W.BARONES ONLINE',
};

export const hero = {
  status: 'Disponível para novos projetos',
  kicker: 'Criação de landing pages em Niterói-RJ',
  title: 'Conectando pessoas. Construindo *Negócios.*',
  sub: 'Landing pages com visual de agência, prontas em até 48h. Domínio, hospedagem e WhatsApp inclusos, sem dor de cabeça técnica.',
  ctaPrimary: 'Quero meu site',
  ctaSecondary: 'Ver projetos',
  proofs: [
    { id: 'proof-48h', text: 'Entrega 48h–7 dias' },
    { id: 'proof-alt', text: '3 alterações grátis' },
    { id: 'proof-gar', text: 'Garantia 7 dias' },
  ],
  chips: ['CARREGAR 0,8s', 'MOBILE ✓', 'SEO ✓'],
  neon: ['projetos', 'do zero'],
  scroll: 'role',
};

export const marquee = [
  'Landing pages',
  'Barbearias',
  'Lojas',
  'Semijoias',
  'Profissionais liberais',
  'Restaurantes',
  'Infoprodutores',
];

export const diagnostico = {
  label: '// 01_DIAGNÓSTICO',
  title: 'Transforme audiência em *clientes*',
  sub: 'Se você se reconhece em algum destes pontos, o problema não é o seu produto. É a vitrine.',
  items: [
    'Já esperou mais de 1 mês por um site',
    'Já pagou por um site e o profissional sumiu',
    'Acha que site é caro, demorado e complicado',
    'O concorrente parece mais profissional que você',
  ],
  scanning: 'Recalibrando a vitrine…',
  fixed: 'corrigido',
  ok: 'Sistema OK',
};

export const solucao = {
  label: '// 02_SOLUÇÃO',
  title: 'A Barones Labs resolve isso em *3 frentes.*',
  pillars: [
    {
      tag: 'Velocidade',
      title: 'Seu site no ar em até 48h.',
      text: 'Sem meses de espera nem reuniões intermináveis. Você aprova, eu publico.',
    },
    {
      tag: 'Visual premium',
      title: 'Cara de agência, preço de profissional autônomo.',
      text: 'Design sob medida, animações modernas e cada detalhe pensado para passar confiança no primeiro segundo.',
    },
    {
      tag: 'Tudo incluso',
      title: 'Domínio, hospedagem, WhatsApp, formulário e mapa.',
      text: 'Você não precisa entender nada de tecnologia. Eu configuro tudo e entrego funcionando.',
    },
  ],
  widget: {
    timerLabel: 'Tempo até o site no ar',
    timerValue: '48',
    timerUnit: 'horas',
    timerStatus: 'Em produção',
    build: ['Grid', 'Tipografia', 'Imagens', 'Animação', 'Publicado'],
    checklist: ['Domínio', 'Hospedagem', 'Botão de WhatsApp', 'Formulário', 'Mapa', 'Site no ar'],
  },
  tunnel: 'Conectando você ao seu cliente',
};

// ---------------------------------------------------------------------
//  PROJETOS
//  - url: null  → mostra "Link em breve" com botão desativado
//  - shots: { desktop, mobile } → caminhos de prints reais (opcional).
//    Sem prints, é gerado um mockup no estilo da marca usando `mock`.
// ---------------------------------------------------------------------
export const projetos = {
  label: '// 03_PROJETOS',
  title: 'Projetos *no ar.*',
  sub: 'Sites reais, de negócios reais. Arraste ou role para navegar.',
  cta: 'Ver site',
  soon: 'Link em breve',
  items: [
    {
      id: 'lizano',
      name: 'Lizano',
      category: 'Marca de semijoias',
      accent: '#E8C9A0',
      url: 'https://www.lizano.com.br',
      shots: { desktop: '/brand/portfolio/lizano-desktop.webp', mobile: '/brand/portfolio/lizano-mobile.webp' },
      mock: {
        bg: '#F7F1EA', fg: '#2B2420', accent: '#E8C9A0', soft: '#EADBC8',
        headingFont: '"Playfair Display", Georgia, serif', bodyFont: 'Inter, sans-serif',
        logo: 'LIZANO', nav: ['Coleções', 'Anéis', 'Colares', 'Contato'],
        headline: 'Brilho que acompanha você', cta: 'Ver coleção', layout: 'jewel',
      },
    },
    {
      id: 'papelrj',
      name: 'Papel de Parede RJ',
      category: 'Papel de parede · Rio de Janeiro',
      accent: '#D9B26A',
      url: 'https://www.papeldeparederj.com.br',
      shots: { desktop: '/brand/portfolio/papeldeparederj-desktop.webp', mobile: '/brand/portfolio/papeldeparederj-mobile.webp' },
      mock: {
        bg: '#15130F', fg: '#F3EDE4', accent: '#D9B26A', soft: '#2A251C',
        headingFont: '"Playfair Display", Georgia, serif', bodyFont: 'Inter, sans-serif',
        logo: 'PAPEL DE PAREDE RJ', nav: ['Catálogo', 'Instalação', 'Orçamento'],
        headline: 'Transforme sua parede em um dia', cta: 'Pedir orçamento', layout: 'pattern',
      },
    },
    {
      id: 'flix',
      name: 'FLIX Barbershop',
      category: 'Barbearia por assinatura em Icaraí, Niterói',
      description: 'Flix Club: corte e barba ilimitados a partir de R$ 89,90/mês. Mais de 500 avaliações 5 estrelas no Google.',
      accent: '#C8964E',
      url: 'https://flix-barbershop.vercel.app',
      shots: null,
      mock: {
        bg: '#0B0A09', fg: '#F3EDE4', accent: '#C8964E', soft: '#1A1713',
        headingFont: 'Anton, Impact, sans-serif', italicFont: '"Playfair Display", Georgia, serif',
        bodyFont: 'Inter, sans-serif',
        logo: 'FLIX', nav: ['Club', 'Serviços', 'Agendar'],
        headline: 'CORTE & BARBA', headlineItalic: 'ilimitados', price: 'R$ 89,90/mês',
        cta: 'Assinar o Flix Club', layout: 'barber',
      },
    },
    {
      id: 'salvage',
      name: 'Salvage Certificadora',
      category: 'Certificação naval · Rio de Janeiro',
      description: 'Vistoria e certificação de embarcações de Mar Aberto e Navegação Interior em nome da Autoridade Marítima Brasileira. Organização Reconhecida pela Marinha do Brasil, certificando com excelência desde 2016.',
      accent: '#00317B',
      url: null,
      paused: true,
      shots: null,
      mock: {
        bg: '#01122A', fg: '#EAF2FF', accent: '#78B0F0', soft: '#00317B',
        headingFont: 'Archivo, "Arial Black", sans-serif', bodyFont: '"IBM Plex Sans", Inter, sans-serif',
        logo: 'SALVAGE', nav: ['Serviços', 'Certificações', 'Contato'],
        headline: 'Certificação naval com excelência', cta: 'Solicitar vistoria', layout: 'naval',
      },
    },
    {
      id: 'cantinho',
      name: 'Cantinho da Paz',
      category: 'Loja de artigos religiosos católicos · Alcântara, São Gonçalo-RJ',
      description: 'Terços, livros e artigos devocionais com atendimento acolhedor. Nota 4,5 no Google, com 51 avaliações.',
      accent: '#8FA8C8',
      url: null,
      shots: null,
      mock: {
        bg: '#F4F6FA', fg: '#23324A', accent: '#8FA8C8', soft: '#DCE4EF',
        headingFont: '"Playfair Display", Georgia, serif', bodyFont: 'Inter, sans-serif',
        logo: 'Cantinho da Paz', nav: ['Terços', 'Livros', 'Visite'],
        headline: 'Fé que acolhe, artigos que inspiram', cta: 'Falar no WhatsApp', layout: 'serene',
      },
    },
  ],
  final: {
    tag: 'Próxima vaga',
    title: 'Seu projeto aqui.',
    text: 'A próxima vitrine pode ser a do seu negócio.',
    cta: 'Reservar minha vaga',
  },
};

export const alcance = {
  label: '// 04_ALCANCE',
  title: 'Do Rio de Janeiro *para o mundo.*',
  text: 'Atendimento 100% online. Seu site pronto para vender onde o seu cliente estiver.',
  points: ['100% online', 'Atendimento direto comigo', 'Sites em até 3 idiomas (Premium)'],
  cta: 'Falar comigo',
  hint: 'arraste para girar',
  marker: { label: 'NITERÓI-RJ', lat: -22.9, lon: -43.17 },
};

export const paraQuem = {
  label: '// 05_PARA_QUEM',
  title: 'Feito para quem vende pelo *WhatsApp e Instagram.* E para quem quer existir além das redes sociais.',
  sub: 'Pra quem já tem site e quer um melhor, e pra quem nunca teve.',
  items: [
    { icon: 'briefcase', title: 'Profissionais liberais', text: 'Autoridade instantânea para quem pesquisa seu nome.' },
    { icon: 'scissors', title: 'Barbearias & salões', text: 'Agenda cheia com o cliente chegando direto no seu WhatsApp.' },
    { icon: 'rocket', title: 'Empreendedores digitais', text: 'Página de vendas rápida, bonita e feita para converter.' },
    { icon: 'utensils', title: 'Restaurantes', text: 'Cardápio, localização e pedido a um toque de distância.' },
  ],
};

export const missao = {
  label: '// MISSÃO',
  title: 'Meu objetivo é colocar *dinheiro no seu bolso.*',
  text: 'Site bonito é só o começo. Cada página é pensada para transformar visita em conversa no WhatsApp, e conversa em venda.',
  points: ['WhatsApp em toda a página', 'Carrega rápido até no 4G', 'Texto pensado para vender'],
  cta: 'Quero vender mais',
};

export const processo = {
  label: '// 06_PROCESSO',
  title: 'Do primeiro contato ao *site no ar*',
  steps: [
    { title: 'Conversa no WhatsApp', text: 'Você me conta sobre o seu negócio, seus clientes e o que quer alcançar.' },
    { title: 'Proposta e pagamento', text: 'Você escolhe o pacote e a forma de pagar que fica melhor para você.' },
    { title: 'Criação', text: 'Seu site fica pronto em 48h a 7 dias, conforme o pacote.' },
    { title: 'Ajustes e lançamento', text: 'Até 3 alterações grátis e seu site no ar, com domínio e tudo funcionando.' },
  ],
};

// ---------------------------------------------------------------------
//  PACOTES — `waName` é o nome usado na mensagem do WhatsApp.
//  `price`/`cash` em reais (número) para JSON-LD; `priceLabel` é o texto.
// ---------------------------------------------------------------------
export const pacotes = {
  label: '// 07_PACOTES',
  title: 'Escolha *seu pacote.*',
  sub: 'Preço fechado, sem surpresas. Tudo o que você precisa para estar online já está incluso.',
  plans: [
    {
      id: 'fast', name: 'FAST', waName: 'Fast',
      price: 497, priceLabel: 'R$ 497', cashLabel: 'R$ 472 à vista',
      delivery: 'entrega em 48h',
      pitch: 'Para quem precisa estar online rápido.',
      features: ['Landing page enxuta', 'Animações básicas', 'Ajuste do seu texto', '1 idioma', 'Domínio + hospedagem', 'WhatsApp, formulário e mapa', '3 alterações grátis'],
      cta: 'Quero o Fast',
    },
    {
      id: 'pro', name: 'PROFISSIONAL', waName: 'Profissional',
      price: 1397, priceLabel: 'R$ 1.397', cashLabel: 'R$ 1.327 à vista',
      delivery: 'entrega em 3 a 5 dias',
      pitch: 'Para negócios que querem vender pelo site.',
      features: ['Landing completa com mais seções', 'Animações modernas', 'Copy escrita para você', '1 idioma', 'Domínio + hospedagem', 'WhatsApp, formulário e mapa', '3 alterações grátis'],
      cta: 'Quero o Profissional',
    },
    {
      id: 'premium', name: 'PREMIUM', waName: 'Premium', featured: true,
      badge: 'Mais escolhido',
      price: 1497, priceLabel: 'R$ 1.497', cashLabel: 'R$ 1.422 à vista',
      delivery: 'entrega em até 7 dias',
      nudge: 'Só R$ 100 a mais que o Profissional',
      pitch: 'Para marcas que querem impressionar.',
      features: ['Design exclusivo', 'Animações avançadas e experiência imersiva', 'Copy estratégica de conversão', 'Até 3 idiomas (PT/EN/ES)', 'Domínio + hospedagem', 'WhatsApp, formulário e mapa', '3 alterações grátis + prioridade', 'Bônus: e-book "Feche vendas pelo WhatsApp"'],
      cta: 'Quero o Premium',
    },
  ],
  payments: ['5% de desconto à vista', 'Parcelado no cartão', 'ou 50% na entrada e 50% na entrega'],
  signature: {
    label: '// Edição assinada',
    name: 'BARONES SIGNATURE', waName: 'Barones Signature',
    price: 5997, priceLabel: 'R$ 5.997', installments: 'ou em até 12x no cartão',
    slots: '2 vagas por mês',
    delivery: 'entrega em 15 a 21 dias',
    pitch: 'O site mais completo que eu entrego: experiência de cinema, sistema de vendas e acompanhamento comigo.',
    features: [
      'Hero em vídeo interativo, feito para a sua marca',
      'Site completo com até 7 páginas',
      'Animações 3D e experiência imersiva sob medida',
      'Copy estratégica em até 3 idiomas',
      'Painel de contatos com a origem de cada cliente',
      'Pixel Meta, Google Analytics e conversões do Google Ads',
      'Perfil da Empresa no Google configurado e otimizado',
      'Kit visual e vídeo de lançamento para as redes',
      '3 meses de manutenção + relatório mensal',
      'Reunião de estratégia e roteiros de WhatsApp sob medida',
      'Os dois e-books bônus',
      'Suporte prioritário direto comigo',
    ],
    cta: 'Quero uma vaga',
  },
  maintenance: {
    title: 'Manutenção mensal',
    price: 'R$ 87/mês',
    text: 'Atualizações de fotos, preços e textos, e suporte direto comigo.',
    cta: 'Saber mais',
  },
};

export const garantia = {
  label: '// GARANTIA + BÔNUS',
  title: 'Risco zero. *E ainda tem bônus.*',
  seal: { big: '7 DIAS', small: 'Garantia' },
  guarantee: {
    title: 'Satisfação ou seu dinheiro de volta.',
    text: 'Se em até 7 dias após a entrega você não estiver satisfeito, devolvo 100% do valor. Simples assim.',
    fine: 'pedido em até 7 dias · reembolso em até 90 dias',
  },
  bonus: {
    title: 'E-books bônus para vender mais.',
    text: 'Guias práticos da Barones Labs para o seu site começar a trazer clientes desde o primeiro dia.',
    books: [
      { vol: 'VOL.01', title: 'Como divulgar seu site', text: 'Do link na bio ao Google: 30 dias para levar clientes até o seu site.', badge: 'Todos os pacotes', color: '#00F0FF' },
      { vol: 'VOL.02', title: 'Feche vendas pelo WhatsApp', text: 'Roteiros prontos para transformar conversa em venda, no WhatsApp e no telefone.', badge: 'Exclusivo Premium', color: '#E040D8' },
    ],
  },
};

export const sobre = {
  label: '// QUEM ESTÁ POR TRÁS',
  title: 'Prazer, *Wesley Barones.*',
  paragraphs: [
    'Eu crio sites que fazem negócios crescerem. Cada projeto da Barones Labs nasce de uma conversa direta comigo, sem intermediários, sem atendimento robótico.',
    'Meu foco é simples: entrega rápida, com acabamento de agência, e um site que traz resultado de verdade para quem vende pelo WhatsApp e pelo Instagram.',
  ],
  stats: [
    { label: 'Atendimento', value: 'Direto comigo' },
    { label: 'Prazo', value: '48h–7 dias' },
    { label: 'Atuação', value: 'Niterói-RJ e 100% online' },
  ],
  cta: 'Siga no Instagram',
};

// ---------------------------------------------------------------------
//  DEPOIMENTOS — copiados do Google sem edição. Só entram avaliações com
//  comentário. `business` é opcional.
// ---------------------------------------------------------------------
export const depoimentos = {
  label: '// 08_DEPOIMENTOS',
  title: 'Quem já tem um site *Barones Labs.*',
  rating: 5.0,
  ratingLabel: '5,0',
  count: 7,
  seeAll: 'Ver todas no Google',
  items: [
    {
      name: 'Iury Ferreira', business: 'Papel de Parede RJ', stars: 5, date: 'nov. 2026', isoDate: '2026-11-01',
      text: 'Amei o meu site, sou um dos donos da microempresa Papel de parede rj e precisava muito de um site com a minha cara e a Baroneslabs me deu isso!!! Muito top o trabalho realizado, meu site ficou dinâmico, interativa, fácil de mexer, fácil do público entender o que eu queria explicar, não ficou pesado, muito pelo contrário ficou muito suave de mexer, muito Boom !!! Estou super satisfeito mesmo!!! Eu recomendo fácil!!!! A atenção dada pra fazer o site do seu jeito é surreal, excelente profissional!!!!',
    },
    {
      name: 'Brenda Elis', stars: 5, date: 'nov. 2026', isoDate: '2026-11-01',
      text: 'Excelente profissional! O Wesley realiza um trabalho impecável, com muita dedicação, competência e compromisso. É nítido o cuidado e a qualidade em cada detalhe. Além de ser atencioso, demonstra muito profissionalismo e respeito pelos clientes. Recomendo de olhos fechados! Sucesso sempre, Wesley!',
    },
    {
      name: 'Isabelle Senna', stars: 5, date: 'nov. 2026', isoDate: '2026-11-01',
      text: 'Que empresa de respeito! Desde o primeiro contato senti segurança. Profissional muito atencioso, competente e entregou muito mais do que eu esperava em apenas 48 horas. Recomendo de olhos fechados.',
    },
    { name: 'Darleide Ferreira', stars: 5, date: 'nov. 2026', isoDate: '2026-11-01', text: 'Empresa de confiança, trabalho muito bom' },
    { name: 'Bruno Henrique Almeida Brandão', stars: 5, date: 'nov. 2026', isoDate: '2026-11-01', text: 'Muito bom' },
  ],
};

export const faq = {
  label: '// 09_FAQ',
  title: 'Dúvidas *frequentes.*',
  items: [
    { q: 'Preciso entender de tecnologia?', a: 'Não. Você conversa comigo pelo WhatsApp e eu cuido de tudo, do domínio ao site no ar.' },
    { q: 'O domínio fica no meu nome?', a: 'Sim, o site e o domínio são seus. O primeiro ano está incluso; a renovação a partir do segundo ano fica por sua conta.' },
    { q: 'E se eu quiser mudar algo depois?', a: 'Você tem 3 alterações grátis após a entrega. Depois disso, pode contratar a manutenção mensal de R$ 87.' },
    { q: 'Como funciona o pagamento?', a: 'À vista com 5% de desconto, parcelado no cartão (com juros da operadora) ou 50% na entrada e 50% na entrega.' },
    { q: 'Em quanto tempo meu site fica pronto?', a: 'Depende do pacote: Fast em 48h, Profissional em 3 a 5 dias, Premium em até 7 dias e Signature em 15 a 21 dias, contando a partir do envio das informações.' },
    { q: 'E se eu não gostar do resultado?', a: 'Você tem garantia de 7 dias após a entrega. Se não estiver satisfeito, devolvo 100% do valor, com reembolso em até 90 dias.' },
  ],
};

export const ctaFinal = {
  title: 'Conectando pessoas. Construindo *Negócios.*',
  text: 'Chama no WhatsApp e tenha seu site no ar em até 48h.',
  cta: 'Quero meu site agora',
};

export const footer = {
  tagline: 'Estúdio de landing pages. Visual de agência, entrega rápida, atendimento direto.',
  navTitle: 'Navegação',
  contactTitle: 'Contato',
  status: 'System online',
  backToTop: 'Voltar ao topo',
  copyright: '© Barones Labs. Todos os direitos reservados.',
};

export const floating = { tooltip: 'Fale comigo' };

export const seo = {
  title: 'Barones Labs | Conectando pessoas. Construindo Negócios.',
  description: 'Landing pages com visual de agência em Niterói-RJ, no ar em até 48h, com domínio, hospedagem e WhatsApp inclusos. Peça seu orçamento agora pelo WhatsApp.',
};
