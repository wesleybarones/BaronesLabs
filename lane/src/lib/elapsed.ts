export type Parts = {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  second: number;
};

export const TZ = "America/Sao_Paulo";

/** Relógio de parede de uma data num fuso (padrão: São Paulo). */
export function wallClock(d: Date, tz: string = TZ): Parts {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", second: "numeric",
    hourCycle: "h23",
  });
  const get = (t: string) => Number(f.formatToParts(d).find((x) => x.type === t)?.value);
  return {
    year: get("year"), month: get("month"), day: get("day"),
    hour: get("hour"), minute: get("minute"), second: get("second"),
  };
}

const toMs = (p: Parts) => Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);

/** Soma meses mantendo o horário; dia vira o último do mês quando não existe (31 → 28/fev). */
function addMonths(p: Parts, n: number): Parts {
  const total = p.year * 12 + (p.month - 1) + n;
  const year = Math.floor(total / 12);
  const month = (total % 12) + 1;
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return { ...p, year, month, day: Math.min(p.day, last) };
}

/** Tempo decorrido em calendário (anos, meses, dias, h, min, s), nunca negativo. */
export function elapsed(from: Parts, to: Parts): Parts {
  const zero = { year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0 };
  if (toMs(to) <= toMs(from)) return zero;
  let months = (to.year - from.year) * 12 + (to.month - from.month);
  while (months > 0 && toMs(addMonths(from, months)) > toMs(to)) months--;
  let rest = Math.floor((toMs(to) - toMs(addMonths(from, months))) / 1000);
  const day = Math.floor(rest / 86400); rest %= 86400;
  const hour = Math.floor(rest / 3600); rest %= 3600;
  const minute = Math.floor(rest / 60);
  return { year: Math.floor(months / 12), month: months % 12, day, hour, minute, second: rest % 60 };
}
