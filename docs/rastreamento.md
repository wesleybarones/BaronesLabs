# Rastreamento (pacote Signature): baroneslabs.com.br

A medição do site passa toda pelo Google Tag Manager (GTM). O site só faz duas coisas:

1. carrega o container do GTM, com o Consent Mode v2 começando tudo como "negado";
2. manda os eventos para o `dataLayer`.

GA4, Pixel da Meta e Google Ads são configurados **dentro do GTM**, e não no código.

## Como ligar

1. No Vercel, abra o projeto **barones-labs** → Settings → Environment Variables.
2. Crie a variável `VITE_GTM_ID` com o ID do container (ex.: `GTM-ABC1234`), para os ambientes Production e Preview.
3. Faça um novo deploy (Redeploy).

Sem essa variável, nada é carregado e o banner de cookies não aparece.

## Arquivos

| Arquivo | O que faz |
|---|---|
| `src/lib/tracking.js` | Consent Mode v2, carga do GTM (depois do `load`, quando o navegador fica ocioso), cliques nos CTAs e rolagem de 75% |
| `src/components/ConsentBanner.jsx` | Banner de cookies (PT/EN/ES), com os botões Aceitar e Recusar no mesmo peso |
| `src/start.jsx` | Chama `initTracking()` |
| `src/App.jsx` | Mostra o `<ConsentBanner />` |
| `src/components/WhatsAppFloat.jsx` | `data-track-section="whatsapp_float"` no botão flutuante |

Os cliques são capturados por **um único ouvinte** no documento, pelo endereço do link. Assim, um botão novo de WhatsApp ou Instagram entra na medição sem precisar de código. Para forçar o nome da seção de um botão, use o atributo `data-track-section="nome"`.

## Plano de eventos

| Ação no site | Evento no dataLayer / GA4 | Meta | Google Ads |
|---|---|---|---|
| Visualização de página | `page_view` (Tag do Google) | `PageView` | remarketing |
| Clique em qualquer link de WhatsApp | `click_whatsapp` | `Contact` | **Conversão principal** |
| Clique em telefone (`tel:`) | `click_phone` (ainda não há link de telefone no site) | `Contact` | Secundária |
| Clique no Instagram / redes | `click_social` | personalizado `ClickSocial` | não |
| Rolagem de 75% | `scroll_75` | personalizado `Scroll75` | não |
| Aceite / recusa de cookies | `consent_granted` / `consent_denied` | não | não |

O site não tem formulário, então não há `generate_lead`.

**Parâmetros enviados em cada evento:**
- `event_id`: único por clique; vai no Pixel e na API de Conversões para deduplicar.
- `page_location`.
- `language`: `pt`, `en` ou `es`.
- `button_text`.
- `section`: `header`, `hero`, `portfolio`, `reach`, `goal`, `pricing`, `about`, `final`, `footer` ou `whatsapp_float`.
- `link_url`: sem o texto da mensagem.
- `social_network`: só no `click_social`.

## Configuração no GTM (passo a passo)

### Variáveis (Variáveis da camada de dados)
`event_id`, `button_text`, `section`, `language`, `link_url`, `social_network`, `percent_scrolled`

### Acionadores (Evento personalizado)
- `CE - click_whatsapp`
- `CE - click_social`
- `CE - click_phone`
- `CE - scroll_75`

### Tags
1. **Tag do Google: GA4.** ID `G-…` da propriedade *baroneslabs.com.br (562317916)*. Acionador: Initialization - All Pages.
2. **GA4 Evento** para cada acionador acima, com o mesmo nome do evento e os parâmetros `button_text`, `section`, `language`, `link_url` (e `social_network` ou `percent_scrolled`, conforme o evento).
3. **Pixel da Meta.** Use o modelo da Galeria "Facebook Pixel" (ou HTML personalizado) com o ID do Pixel:
   - base `PageView` em All Pages;
   - `Contact` no `click_whatsapp`, com `eventID = {{event_id}}`;
   - `ClickSocial` e `Scroll75` como eventos personalizados.
   - Nas configurações de consentimento da tag, exija `ad_storage`.
4. **Google Ads.**
   - Vinculador de conversões em All Pages.
   - Acompanhamento de conversões no `click_whatsapp`, com o ID e o rótulo da ação "WhatsApp" da conta **444-868-9988**.
   - Tag de remarketing em All Pages.

   Fonte única: a conversão principal do Ads vem **da tag do Ads no GTM**. Não importe a mesma conversão do GA4, para não contar duas vezes.

**Consent Mode:** o site envia o `default` (tudo `denied`) e o `update` ao aceitar. Nas tags do Google, mantenha a "verificação de consentimento integrada". Nas da Meta, exija `ad_storage`.

**SPA:** o site tem uma página só (`/`, e `/portfolio` cai na mesma página). Por isso não é preciso acionador de "Alteração no histórico".

### Publicação
Nome da versão: `v1 - Signature - setup inicial`.

## Testes feitos no código (08/11/2026, com o ID falso GTM-TESTE01)

Os testes rodaram no Chromium, em computador (1366px) e celular (390px).

- O banner aparece. "Aceitar" grava `bl-consent=granted` e envia o `consent update` com tudo como `granted`.
- O Consent Mode começa com `ad_storage`, `analytics_storage`, `ad_user_data` e `ad_personalization` como `denied`.
- O `gtm.js` é pedido uma vez só, depois do carregamento da página.
- Eventos recebidos, com seção e texto corretos:
  - `click_whatsapp`: header, hero, portfolio, reach, goal, pricing (5), final e footer;
  - `click_social`: about e footer;
  - `scroll_75`: uma vez.
- Sem `VITE_GTM_ID`: nenhuma requisição ao GTM, nenhum evento e nenhum banner.

**Falta testar depois que o GTM existir:**
- Tag Assistant;
- DebugView do GA4;
- Testar eventos da Meta;
- status da conversão no Ads.

## Pendências

- Criar o container GTM e informar o ID (`VITE_GTM_ID`).
- ID de medição `G-…` do fluxo Web da propriedade 562317916.
- ID do Pixel (conjunto de dados) e verificação do domínio no Business Manager.
- API de Conversões: configurar pelo Gerenciador de Eventos (gateway ou integração sem código), usando o `event_id`.
- Ação de conversão "WhatsApp" no Google Ads 444-868-9988. A conta avisou em 04/11 que a forma de pagamento foi recusada.
- GA4: retenção de 14 meses, filtro de tráfego interno, e marcar `click_whatsapp` como evento principal.
- LGPD: o site ainda não tem página de Política de Privacidade. É recomendado criar uma e colocar o link no banner.
