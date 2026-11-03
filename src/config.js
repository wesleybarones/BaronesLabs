/* ═══════════════════════════════════════════
   BARONES LABS · CONFIGURAÇÃO DO SITE
   Edite aqui: número, links e projetos.
   ═══════════════════════════════════════════ */

// Número do WhatsApp no formato internacional, só dígitos (ex.: 5521999998888).
// TROCAR: substitua [SEU_NUMERO] pelo seu DDD + número.
export const WHATSAPP_NUMBER = '5521990296352'
export const WHATSAPP_DISPLAY = '+55 21 99029-6352'

export const INSTAGRAM_HANDLE = 'wesleybarones'
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`

// Foto do Wesley (coloque o arquivo em /public e informe o caminho, ex.: '/wesley.jpg').
// Enquanto estiver vazio, aparece o placeholder estilizado.
import wesleyPhoto from './assets/wesley.jpg'
export const ABOUT_PHOTO = wesleyPhoto

/*
  PORTFÓLIO
  Para adicionar um projeto, copie um objeto e preencha:
  - id: identificador único (usado nas traduções do segmento em src/i18n/translations.js → portfolio.segments)
  - name: nome exibido
  - url: link do site no ar (vazio = botão desativado)
  - desktop / mobile: prints em /public (proporção 16:10 e 9:19.5). Vazio = placeholder "PREVIEW".
  - accent: cor de destaque do placeholder
*/
export const PROJECTS = [
  {
    id: 'lizano',
    name: 'Lizano',
    url: '',
    desktop: '',
    mobile: '',
    accent: '#E8C9A0',
  },
  {
    id: 'papeldeparederj',
    name: 'papeldeparederj',
    url: '',
    desktop: '',
    mobile: '',
    accent: '#9FE3C8',
  },
]

export function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
