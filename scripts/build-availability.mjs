// Legge il calendario Google "Rooms Add'e Criature" (indirizzo iCal segreto) e scrive
// disponibilita.json con i soli intervalli di NOTTI occupate per camera.
// Nessun titolo, nome o dettaglio finisce nel file.
//
// Regole del calendario:
//  - il calendario letto deve chiamarsi "Rooms Add'e Criature", altrimenti lo script si ferma
//    (così non si pubblica per errore un calendario personale);
//  - nel titolo di ogni prenotazione c'è "Camera 1" o "Camera 2" (anche "Stanza 1", "Room 2");
//  - "entrambe", "tutte" o "both" blocca tutte e due le camere;
//  - un evento senza camera riconoscibile blocca ENTRAMBE le camere (meglio "occupato" che
//    "libero" per errore); il log ne dice solo il numero;
//  - un evento da A a B occupa le notti da A a B escluso: il giorno di partenza resta libero.
//
// Uso:  CALENDAR_ICS_URL=https://... node scripts/build-availability.mjs
// Prova locale:  ICS_FILE=prova.ics node scripts/build-availability.mjs

import { readFile, writeFile } from "node:fs/promises";

const OUT = process.env.OUT_FILE || "disponibilita.json";
const MONTHS_AHEAD = 18;
const ROOMS = ["1", "2"];
const TZ = "Europe/Rome";

const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ });
const pad = (n) => String(n).padStart(2, "0");

function addDays(iso, n) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function unfold(text) {
  return text.replace(/\r?\n[ \t]/g, "");
}

function unescapeText(s) {
  return s.replace(/\\n/gi, " ").replace(/\\([,;\\])/g, "$1");
}

// Restituisce la data (AAAA-MM-GG) del valore iCal, nel fuso del B&B.
function toDay(value, params) {
  if (/VALUE=DATE(?!-)/i.test(params) || /^\d{8}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  }
  const m = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/);
  if (!m) return null;
  if (m[7] === "Z") {
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
    return dayFmt.format(d);
  }
  return `${m[1]}-${m[2]}-${m[3]}`; // ora locale già nel fuso del calendario
}

function parseEvents(ics) {
  const events = [];
  const blocks = unfold(ics).split("BEGIN:VEVENT").slice(1);
  for (const block of blocks) {
    const body = block.split("END:VEVENT")[0];
    const ev = { summary: "", start: null, end: null, cancelled: false, recurring: false };
    for (const line of body.split(/\r?\n/)) {
      const i = line.indexOf(":");
      if (i < 0) continue;
      const [name, ...p] = line.slice(0, i).split(";");
      const params = p.join(";");
      const value = line.slice(i + 1).trim();
      switch (name.toUpperCase()) {
        case "SUMMARY": ev.summary = unescapeText(value); break;
        case "DTSTART": ev.start = toDay(value, params); break;
        case "DTEND": ev.end = toDay(value, params); break;
        case "STATUS": ev.cancelled = /CANCELLED/i.test(value); break;
        case "RRULE": ev.recurring = true; break;
        default:
      }
    }
    events.push(ev);
  }
  return events;
}

function roomsOf(summary) {
  if (/\b(entrambe|entrambi|tutte|tutti|both|ambas)\b/i.test(summary)) return ROOMS;
  const found = new Set();
  for (const m of summary.matchAll(/\b(?:camera|stanza|room|habitaci[oó]n)\s*(?:n[°o.]?\s*)?([12])(?!\d)/gi)) {
    found.add(m[1]);
  }
  return [...found];
}

function merge(ranges) {
  ranges.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  const out = [];
  for (const r of ranges) {
    const last = out[out.length - 1];
    if (last && r[0] <= last[1]) { if (r[1] > last[1]) last[1] = r[1]; }
    else out.push([r[0], r[1]]);
  }
  return out;
}

async function loadIcs() {
  if (process.env.ICS_FILE) return readFile(process.env.ICS_FILE, "utf8");
  const url = process.env.CALENDAR_ICS_URL;
  if (!url) throw new Error("Manca CALENDAR_ICS_URL (o ICS_FILE per una prova locale).");
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Calendario non raggiungibile: HTTP ${res.status}`);
  const text = await res.text();
  if (!text.includes("BEGIN:VCALENDAR")) throw new Error("La risposta non è un calendario iCal.");
  return text;
}

const today = dayFmt.format(new Date());
const horizonDate = new Date();
horizonDate.setUTCMonth(horizonDate.getUTCMonth() + MONTHS_AHEAD);
const horizon = dayFmt.format(horizonDate);

const ics = await loadIcs();

// Controllo di sicurezza: deve essere il calendario del B&B, non un altro.
const calName = (unfold(ics).match(/^X-WR-CALNAME[^:]*:(.*)$/im) || [])[1];
const normalize = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[^a-z]/g, "");
if (!normalize(calName).includes("addecriature")) {
  throw new Error(
    `Il calendario letto si chiama "${calName ? unescapeText(calName.trim()) : "(senza nome)"}", ` +
    `non "Rooms Add'e Criature". Controlla l'indirizzo iCal nel segreto CALENDAR_ICS_URL. Nessun file scritto.`
  );
}

const events = parseEvents(ics);

const ranges = Object.fromEntries(ROOMS.map((r) => [r, []]));
let unassigned = 0, recurring = 0, used = 0;

for (const ev of events) {
  if (ev.cancelled || !ev.start) continue;
  let to = ev.end && ev.end > ev.start ? ev.end : addDays(ev.start, 1);
  if (to <= today || ev.start >= horizon) continue; // passato o oltre l'orizzonte
  let rooms = roomsOf(ev.summary);
  if (!rooms.length) { unassigned++; rooms = ROOMS; }
  if (ev.recurring) recurring++;
  used++;
  for (const r of rooms) ranges[r].push([ev.start < today ? today : ev.start, to > horizon ? horizon : to]);
}

const result = {
  updated: new Date().toISOString(),
  rooms: Object.fromEntries(ROOMS.map((r) => [r, merge(ranges[r])])),
};

await writeFile(OUT, JSON.stringify(result, null, 2) + "\n");

console.log(`Calendario: "${unescapeText(calName.trim())}". Eventi letti: ${events.length}; usati: ${used}.`);
if (unassigned) console.log(`Attenzione: ${unassigned} eventi senza "Camera 1/2" nel titolo: bloccano entrambe le camere.`);
if (recurring) console.log(`Attenzione: ${recurring} eventi ricorrenti contati una volta sola.`);
for (const r of ROOMS) console.log(`Camera ${r}: ${result.rooms[r].length} periodi occupati.`);
