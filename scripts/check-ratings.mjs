// Controlla punteggi.json (sul ramo "dati"): se ha un errore, fa fallire l'esecuzione
// così GitHub ti avvisa; la pagina nel frattempo usa i numeri di riserva.
//
// Formato del file:
//   {
//     "updated": "2026-10",                       <- mese dell'ultimo aggiornamento (AAAA-MM o AAAA-MM-GG)
//     "booking": { "score": 9.8,  "scale": 10, "reviews": 139 },
//     "airbnb":  { "score": 4.99, "scale": 5,  "reviews": 69 }
//   }
//
// Uso:  PUNTEGGI_FILE=punteggi.json node scripts/check-ratings.mjs
// Esito: 0 = ok (o file assente / non aggiornato da tempo: solo avviso), 1 = file con errori.

import { readFile } from "node:fs/promises";

const FILE = process.env.PUNTEGGI_FILE || "punteggi.json";
const STALE_DAYS = 45;

const warn = (msg) => console.log(`::warning::${msg}`);
const fail = (msg) => { console.log(`::error::${msg}`); process.exit(1); };

let text;
try {
  text = await readFile(FILE, "utf8");
} catch {
  warn(`${FILE} non esiste ancora: la pagina usa i punteggi di riserva scritti in index.html.`);
  process.exit(0);
}

let j;
try {
  j = JSON.parse(text);
} catch (e) {
  fail(`${FILE} non è un JSON valido (${e.message}). Di solito manca o avanza una virgola o una virgolette. Correggilo da GitHub, oppure ripristina la versione precedente dalla cronologia del file.`);
}

const errors = [];
for (const [key, name] of [["booking", "Booking.com"], ["airbnb", "Airbnb"]]) {
  const x = j[key];
  if (!x || typeof x !== "object") { errors.push(`manca la sezione "${key}" (${name})`); continue; }
  if (typeof x.scale !== "number" || x.scale <= 0) errors.push(`${key}.scale deve essere un numero maggiore di 0 (es. 10 per Booking, 5 per Airbnb)`);
  if (typeof x.score !== "number" || x.score <= 0) errors.push(`${key}.score deve essere un numero maggiore di 0 (scrivi 9.8 con il punto, non con la virgola)`);
  else if (typeof x.scale === "number" && x.score > x.scale) errors.push(`${key}.score (${x.score}) è maggiore della scala (${x.scale})`);
  if (!Number.isInteger(x.reviews) || x.reviews < 0) errors.push(`${key}.reviews deve essere un numero intero (es. 139)`);
}
if (typeof j.updated !== "string" || !/^\d{4}-\d{2}(-\d{2})?$/.test(j.updated)) {
  errors.push(`"updated" deve essere un mese nel formato AAAA-MM (es. 2026-10)`);
}
if (errors.length) fail(`${FILE}: ${errors.join("; ")}.`);

const d = new Date((j.updated.length === 7 ? j.updated + "-01" : j.updated) + "T00:00:00Z");
const days = Math.floor((Date.now() - d.getTime()) / 864e5);
if (days < -31) fail(`"updated" (${j.updated}) è nel futuro.`);
console.log(`Punteggi ok: Booking ${j.booking.score}/${j.booking.scale} (${j.booking.reviews}), Airbnb ${j.airbnb.score}/${j.airbnb.scale} (${j.airbnb.reviews}), aggiornati a ${j.updated}.`);
if (days > STALE_DAYS) warn(`I punteggi sono aggiornati a ${j.updated}, più di ${STALE_DAYS} giorni fa: controlla Booking e Airbnb.`);
