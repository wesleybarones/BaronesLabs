// Definição dos cursores do enxame e registro das instâncias montadas.
// `mobile: true` → continua ativo em telas < 768px (no mobile só 2 cursores).

export const CURSORS = [
  { id: 'wesley', label: 'W.BARONES', color: '#00F0FF', mobile: true },
  { id: 'ui', label: 'UI.BOT', color: '#8AB6F7', mobile: false },
  { id: 'copy', label: 'COPY.BOT', color: '#E040D8', mobile: false },
  { id: 'deploy', label: 'DEPLOY.BOT', color: '#02AFBB', mobile: true },
];

const instances = new Map();

export const registerCursor = (id, api) => (api ? instances.set(id, api) : instances.delete(id));
export const getCursor = (id) => instances.get(id);
export const activeCursors = () => [...instances.values()];
