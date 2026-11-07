// JSON-LD gerado a partir do conteúdo (site.js + config.js) no build.
import { config } from '../config.js';
import { depoimentos, faq, pacotes, seo, alcance } from '../content/site.js';

const url = config.siteUrl;
const id = (s) => `${url}/#${s}`;

export function buildSchema() {
  const offers = [
    ...pacotes.plans.map((p) => ({
      '@type': 'Offer',
      name: `Pacote ${p.waName}`,
      description: `${p.pitch} ${p.delivery}.`,
      price: p.price.toFixed(2),
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: `${url}/#pricing`,
      seller: { '@id': id('business') },
    })),
    {
      '@type': 'Offer',
      name: pacotes.signature.name,
      description: pacotes.signature.pitch,
      price: pacotes.signature.price.toFixed(2),
      priceCurrency: 'BRL',
      availability: 'https://schema.org/LimitedAvailability',
      url: `${url}/#pricing`,
      seller: { '@id': id('business') },
    },
    {
      '@type': 'Offer',
      name: pacotes.maintenance.title,
      description: pacotes.maintenance.text,
      price: '87.00',
      priceCurrency: 'BRL',
      priceSpecification: { '@type': 'UnitPriceSpecification', price: '87.00', priceCurrency: 'BRL', unitCode: 'MON' },
      seller: { '@id': id('business') },
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': id('business'),
        name: config.brand,
        description: seo.description,
        url,
        image: `${url}${config.assets.og}`,
        logo: `${url}${config.assets.logo}`,
        telephone: `+${config.whatsapp.number}`,
        priceRange: 'R$ 497 – R$ 5.997',
        address: { '@type': 'PostalAddress', addressLocality: 'Niterói', addressRegion: 'RJ', addressCountry: 'BR' },
        geo: { '@type': 'GeoCoordinates', latitude: alcance.marker.lat, longitude: alcance.marker.lon },
        areaServed: [
          { '@type': 'City', name: 'Niterói' },
          { '@type': 'City', name: 'Rio de Janeiro' },
          { '@type': 'Country', name: 'Brasil' },
        ],
        sameAs: [config.instagram.url, config.google.reviewsUrl],
        founder: { '@type': 'Person', name: 'Wesley Barones' },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: depoimentos.rating.toFixed(1),
          reviewCount: depoimentos.count,
          bestRating: '5',
          worstRating: '1',
        },
        review: depoimentos.items.map((r) => ({
          '@type': 'Review',
          author: { '@type': 'Person', name: r.name },
          datePublished: r.isoDate,
          reviewBody: r.text,
          reviewRating: { '@type': 'Rating', ratingValue: String(r.stars), bestRating: '5' },
        })),
        makesOffer: offers,
      },
      {
        '@type': 'WebSite',
        '@id': id('website'),
        url,
        name: config.brand,
        inLanguage: 'pt-BR',
        publisher: { '@id': id('business') },
      },
      {
        '@type': 'FAQPage',
        '@id': id('faq'),
        mainEntity: faq.items.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
}
