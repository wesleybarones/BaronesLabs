/* ═══════════════════════════════════════════
   BARONES LABS · CONFIGURAÇÃO DO SITE
   Edite aqui: número, links e projetos.
   ═══════════════════════════════════════════ */

// Número do WhatsApp no formato internacional, só dígitos (ex.: 5521999998888).
// TROCAR: substitua [SEU_NUMERO] pelo seu DDD + número.
// Endereço definitivo do site (usado em canonical, Open Graph, sitemap e dados estruturados).
export const SITE_URL = 'https://baroneslabs.com.br'
export const OG_IMAGE = `${SITE_URL}/og-baroneslabs-luz-1200x630.jpg`

export const WHATSAPP_NUMBER = '5521990296352'
export const WHATSAPP_DISPLAY = '+55 21 99029-6352'

export const INSTAGRAM_HANDLE = 'wesleybarones'
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`

// Foto do Wesley (src/assets/wesley.webp).
// Enquanto estiver vazio, aparece o placeholder estilizado.
import wesleyPhoto from './assets/wesley.webp'
export const ABOUT_PHOTO = wesleyPhoto

/*
  Avaliações reais do Perfil da Empresa no Google (copiadas do Google, sem edição).
  Para adicionar outra: copie nome, data e texto exatamente como estão no Google.
*/
export const GOOGLE_REVIEWS_URL = 'https://www.google.com/maps?cid=14365799348690095596'
export const GOOGLE_RATING = { score: '5,0', count: 7 }
export const REVIEWS = [
  {
    name: 'Isabelle Senna',
    stars: 5,
    when: 'nov. 2026',
    text: 'Que empresa de respeito! Desde o primeiro contato senti segurança. Profissional muito atencioso, competente e entregou muito mais do que eu esperava em apenas 48 horas. Recomendo de olhos fechados.',
  },
  {
    name: 'Darleide Ferreira',
    stars: 5,
    when: 'nov. 2026',
    text: 'Empresa de confiança, trabalho muito bom',
  },
]

/*
  PORTFÓLIO
  Para adicionar um projeto, copie um objeto e preencha:
  - id: identificador único (usado nas traduções do segmento em src/i18n/translations.js → portfolio.segments)
  - name: nome exibido
  - url: link do site no ar (vazio = botão desativado)
  - desktop / mobile: prints em src/assets/portfolio (proporção 16:10 e 9:19.5), importados acima. Vazio = placeholder "PREVIEW".
  - accent: cor de destaque do placeholder
*/
import lizanoDesktop from './assets/portfolio/lizano-desktop.webp'
import lizanoMobile from './assets/portfolio/lizano-mobile.webp'
import papelDesktop from './assets/portfolio/papeldeparederj-desktop.webp'
import papelMobile from './assets/portfolio/papeldeparederj-mobile.webp'

export const PROJECTS = [
  {
    id: 'lizano',
    name: 'Lizano',
    url: 'https://www.lizano.com.br',
    desktop: lizanoDesktop,
    mobile: lizanoMobile,
    accent: '#E8C9A0',
  },
  {
    id: 'papeldeparederj',
    name: 'Papel de Parede RJ',
    url: 'https://www.papeldeparederj.com.br',
    desktop: papelDesktop,
    mobile: papelMobile,
    accent: '#D9B26A',
  },
]

export function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
