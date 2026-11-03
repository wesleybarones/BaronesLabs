import { Helmet } from 'react-helmet-async'
import { useLang } from '../i18n/LangContext'
import { OG_IMAGE, SITE_URL } from '../config'

/**
 * Head tags per language (title, description, canonical, Open Graph, Twitter).
 * The site is a single page at "/", so there is one canonical URL for every language.
 * index.html ships the same tags (Portuguese) marked data-rh="true", so crawlers that
 * don't run JavaScript still read them, and Helmet replaces them instead of duplicating.
 */
export default function Seo() {
  const { t } = useLang()
  const m = t.meta
  const url = `${SITE_URL}/`
  return (
    <Helmet>
      <html lang={m.htmlLang} />
      <title>{m.title}</title>
      <meta name="description" content={m.description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Barones Labs" />
      <meta property="og:locale" content={m.ogLocale} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={m.ogTitle} />
      <meta property="og:description" content={m.description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:secure_url" content={OG_IMAGE} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={m.imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={m.ogTitle} />
      <meta name="twitter:description" content={m.description} />
      <meta name="twitter:image" content={OG_IMAGE} />
      <meta name="twitter:image:alt" content={m.imageAlt} />
    </Helmet>
  )
}
