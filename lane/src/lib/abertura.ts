/** A abertura completa aparece na primeira vez que o app é aberto no dia (horário de Brasília). */
export const CHAVE_ABERTURA = "lane-abertura-dia";
export const hojeSP = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());

export function marcarAberturaVista() {
  try { localStorage.setItem(CHAVE_ABERTURA, hojeSP()); } catch { /* sem armazenamento: mostra de novo, sem problema */ }
}

/** Roda no <head>, antes da primeira pintura: se a abertura já foi vista hoje, nem desenha o fundo dela. */
export const SCRIPT_ABERTURA = `try{var d=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo'}).format(new Date());if(localStorage.getItem('${CHAVE_ABERTURA}')===d)document.documentElement.setAttribute('data-sem-abertura','')}catch(e){}`;
