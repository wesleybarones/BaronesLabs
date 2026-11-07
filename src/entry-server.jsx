// Entrada usada só no build para pré-renderizar o HTML (SEO: conteúdo real no HTML).
import { renderToString } from 'react-dom/server';
import App from './App.jsx';

export { buildSchema } from './seo/schema.js';
export const render = () => renderToString(<App />);
