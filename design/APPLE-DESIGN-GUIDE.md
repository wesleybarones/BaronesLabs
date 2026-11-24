# Guia de Design no estilo Apple — Barones Labs

Resumo de estudo de https://developer.apple.com/design/ e do **Human Interface
Guidelines (HIG)**, versão atual (linguagem **Liquid Glass**, iOS/macOS 27).
Objetivo: aplicar os princípios da Apple na identidade e nas interfaces da
Barones Labs. Tokens prontos para uso em [`apple-tokens.css`](./apple-tokens.css).

---

## 1. O que existe no site da Apple

| Recurso | Para que serve | Link |
| --- | --- | --- |
| **Human Interface Guidelines** | As regras: cor, tipografia, layout, materiais, componentes | developer.apple.com/design/human-interface-guidelines |
| **Apple Design Resources** | UI Kits oficiais (Figma/Sketch) de iOS 27, macOS 27, watchOS, visionOS; templates de ícone; bezels de aparelhos (mockups) | developer.apple.com/design/resources |
| **SF Symbols 27** | +7.000 ícones em 9 pesos e 3 escalas, alinhados com a fonte | developer.apple.com/sf-symbols |
| **Icon Composer** | Cria ícones de app em camadas com Liquid Glass | developer.apple.com/icon-composer |
| **Fontes** | SF Pro, SF Compact, SF Mono, New York | developer.apple.com/fonts |
| **Vídeos WWDC** | "Meet Liquid Glass", "Get to know the new design system", "Design foundations from idea to interface" | developer.apple.com/videos/design |

**Atalho prático:** o UI Kit *iOS and iPadOS 27* no Figma Community
(figma.com/community/file/1651309003795292092) tem todos os componentes prontos
— é o jeito mais rápido de prototipar telas no padrão Apple.

---

## 2. Princípio central: Liquid Glass

Liquid Glass é o material translúcido que forma uma **camada funcional**
(navegação, barras, botões) que **flutua sobre o conteúdo**.

Regras do HIG:

1. **Nunca use vidro na camada de conteúdo.** Vidro é para controles e
   navegação (tab bar, toolbar, sidebar, menus). Cards e fundos de conteúdo usam
   materiais "standard" (blur simples) ou cores sólidas.
2. **Use com moderação.** Poucos elementos de vidro, só os mais importantes.
3. **Duas variantes:**
   - **Regular** — desfoca e ajusta luminosidade; use quando há texto ou fundo
     complexo (alertas, sidebars, popovers). É o padrão.
   - **Clear** — muito translúcido; só sobre **mídia rica** (foto/vídeo).
     Se o fundo for claro, adicione uma **camada escura de 35%** atrás.
4. **Vidro não tem cor própria** — ele pega a cor do que está atrás.
   Para destacar a ação principal, **tinja o fundo do botão** (não o texto) com
   a cor de destaque. **Só um botão colorido por grupo.**
5. Conteúdo de fundo (imagem/vídeo) deve **se estender por baixo** das barras,
   ocupando a tela inteira.

> Para a Barones Labs: o vídeo `Man_wearing_futuristic_sunglasses…mp4` e as
> imagens de fundo são candidatos perfeitos para **hero em tela cheia com
> navegação em vidro "clear"** por cima.

---

## 3. Cor

- **Cada cor tem um significado só.** Se a cor da marca indica "clicável",
  não use a mesma cor em texto não-clicável.
- **Sempre forneça versão clara, escura e de alto contraste** de cada cor.
- **Não dependa só de cor** para transmitir informação (acessibilidade).
- Em apps com fundo colorido, prefira barras **monocromáticas**; em apps com
  conteúdo neutro, a **cor da marca como accent** funciona muito bem.
- Use cores semânticas (label, secondaryLabel, separator…) — nunca reaproveite
  uma cor semântica para outra função.

### Cores de sistema (valores atuais do HIG)

| Cor | Claro | Escuro |
| --- | --- | --- |
| Red | `#FF383C` | `#FF4245` |
| Orange | `#FF8D28` | `#FF9230` |
| Yellow | `#FFCC00` | `#FFD600` |
| Green | `#34C759` | `#30D158` |
| Mint | `#00C8B3` | `#00DAC3` |
| Teal | `#00C3D0` | `#00D2E0` |
| Cyan | `#00C0E8` | `#3CD3FE` |
| Blue | `#0088FF` | `#0091FF` |
| Indigo | `#6155F5` | `#6D7CFF` |
| Purple | `#CB30E0` | `#DB34F2` |
| Pink | `#FF2D55` | `#FF375F` |
| Brown | `#AC7F5E` | `#B78A66` |

### Cinzas (iOS)

| Nome | Claro | Escuro |
| --- | --- | --- |
| Gray | `#8E8E93` | `#8E8E93` |
| Gray 2 | `#AEAEB2` | `#636366` |
| Gray 3 | `#C7C7CC` | `#48484A` |
| Gray 4 | `#D1D1D6` | `#3A3A3C` |
| Gray 5 | `#E5E5EA` | `#2C2C2E` |
| Gray 6 | `#F2F2F7` | `#1C1C1E` |

Hierarquia de fundo: **primário** (tela), **secundário** (grupos dentro da
tela), **terciário** (grupos dentro de grupos).

---

## 4. Tipografia

- Fonte do sistema: **San Francisco (SF Pro)**; serifada complementar:
  **New York**. Na web, use a pilha `-apple-system, BlinkMacSystemFont,
  system-ui` — renderiza SF nos aparelhos Apple.
  ⚠️ A licença da SF Pro **não permite** hospedá-la num site; para outras
  plataformas use um fallback como **Inter** (muito próxima).
- **Evite pesos leves** (Ultralight/Thin/Light). Prefira Regular, Medium,
  Semibold, Bold.
- **Poucas famílias tipográficas.** Hierarquia vem de peso, tamanho e cor.
- Tamanho padrão de texto: **17 pt** (mínimo 11 pt) no iOS; 13 pt no macOS.

### Escala padrão (iOS, tamanho "Large")

| Estilo | Peso | Tamanho | Entrelinha |
| --- | --- | --- | --- |
| Large Title | Regular (Bold enfatizado) | 34 | 41 |
| Title 1 | Regular | 28 | 34 |
| Title 2 | Regular | 22 | 28 |
| Title 3 | Regular | 20 | 25 |
| Headline | Semibold | 17 | 22 |
| Body | Regular | 17 | 22 |
| Callout | Regular | 16 | 21 |
| Subhead | Regular | 15 | 20 |
| Footnote | Regular | 13 | 18 |
| Caption 1 | Regular | 12 | 16 |
| Caption 2 | Regular | 11 | 13 |

### Tracking (espaçamento entre letras) da SF Pro

Texto de corpo fica **levemente apertado**, títulos grandes **levemente
abertos**: 13pt −0.08 · 15pt −0.23 · 17pt −0.43 · 20pt −0.45 · 22pt −0.26 ·
28pt +0.38 · 34pt +0.40 · 48pt +0.35 · 64pt +0.22 · 80pt+ 0.
(No browser com SF nativa, o ajuste óptico é automático; aplique o tracking só
com fontes de fallback ou em mockups.)

---

## 5. Layout

- **Ordem por importância:** o mais importante em cima e à esquerda.
- **Alinhamento** sinaliza relação; **recuo** sinaliza subordinação.
- **Agrupe** com espaço negativo, formas de container ou separadores.
- **Revelação progressiva:** menus, seções expansíveis, scroll — não mostre
  tudo de uma vez.
- **Separe controles do conteúdo** com vidro + *scroll edge effect* (desfoque
  na borda), não com uma faixa de cor sólida atrás da barra.
- **Respeite as safe areas** (notch, Dynamic Island, barras).
- Layout responsivo por **espaço disponível** (compact/regular), não por tipo
  de aparelho. Mesma funcionalidade em todos os tamanhos.
- Área mínima de toque: **44×44 pt**.
- Suporte a texto maior (Dynamic Type): componentes devem crescer/empilhar.

---

## 6. Checklist para cada tela da Barones Labs

- [ ] Navegação/ações principais em vidro; conteúdo **sem** vidro
- [ ] Apenas **um** botão com cor de destaque por grupo
- [ ] Funciona em modo claro, escuro e alto contraste
- [ ] Texto ≥ 11pt, sem pesos leves, contraste adequado
- [ ] Máximo 2 famílias tipográficas
- [ ] Fundo de mídia estendido até as bordas, por baixo das barras
- [ ] Alvos de toque ≥ 44pt
- [ ] Respeita `prefers-reduced-transparency` / `prefers-contrast`
- [ ] Nada que imite marca, logo ou ícones da Apple (usar só o **estilo**)

---

## 7. Próximos passos sugeridos

1. Definir a **cor de accent** da Barones Labs a partir do logo e gerar as
   variantes claro/escuro/alto contraste.
2. Montar a landing page com hero em vídeo + navegação em Liquid Glass usando
   `apple-tokens.css`.
3. (Opcional) Redesenhar o ícone no **Icon Composer** em camadas, para ter
   versão Liquid Glass do ícone da marca.
