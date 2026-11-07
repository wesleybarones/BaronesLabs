// Configurações gerais do site. Edite aqui contatos, URLs e mensagens do WhatsApp.

export const config = {
  siteUrl: 'https://baroneslabs.com.br',
  brand: 'Barones Labs',

  whatsapp: {
    number: '5521990296352',
    display: '+55 21 99029-6352',
    messages: {
      default: 'Olá! Vim pelo site da Barones Labs e quero um orçamento.',
      // {NOME} é substituído pelo nome do pacote
      package: 'Olá! Vim pelo site da Barones Labs e quero o pacote {NOME}.',
      maintenance: 'Olá! Vim pelo site da Barones Labs e quero saber da manutenção mensal.',
    },
  },

  instagram: {
    handle: '@wesleybarones',
    url: 'https://instagram.com/wesleybarones',
  },

  google: {
    reviewsUrl: 'https://www.google.com/maps?cid=14365799348690095596',
  },

  // Imagens da marca (em public/). Troque os arquivos mantendo os nomes ou ajuste os caminhos.
  assets: {
    logo: '/brand/logo-720.webp',
    logoSrcSet: '/brand/logo-360.webp 360w, /brand/logo-720.webp 720w',
    symbol: '/brand/symbol-480.webp',
    // Foto do herói (óculos futurista) em 3 tamanhos para o srcset
    avatar: '/brand/wesley-avatar-780.webp',
    avatarSrcSet: '/brand/wesley-avatar-520.webp 520w, /brand/wesley-avatar-780.webp 780w, /brand/wesley-avatar-1040.webp 1040w',
    // Foto da seção "Quem está por trás"
    portrait: '/brand/wesley.webp',
    og: '/og-baroneslabs-v3-1200x630.jpg',
  },

};

export const waLink = (msg = config.whatsapp.messages.default) =>
  `https://wa.me/${config.whatsapp.number}?text=${encodeURIComponent(msg)}`;

export const waPackage = (name) =>
  waLink(config.whatsapp.messages.package.replace('{NOME}', name));

export const waMaintenance = () => waLink(config.whatsapp.messages.maintenance);
