# Rooms Add'e Criature – sito del B&B

Sito web del B&B **Rooms Add'e Criature** (Materdei, Napoli): pagina unica, statica, in italiano, inglese e spagnolo, pubblicata con GitHub Pages su `www.roomsaddecriature.it`.

- **Cosa mostra:** contatti, foto, servizi delle camere, calendario delle disponibilità, posizione, regole di soggiorno, punteggi e link alle recensioni.
- **Come è fatto:** un solo `index.html` con stile e script dentro, nessun framework e nessuna build. Da fuori usa solo Google Fonts e la mappa di OpenStreetMap.
- **Ramo di lavoro:** sempre `main`. Il ramo `dati` è scritto solo dall'automatismo del calendario (vedi sotto) e non va toccato a mano.

---

## 1. Struttura del repo

| Percorso | A cosa serve |
|---|---|
| `index.html` | L'intera pagina: HTML, CSS, JavaScript e traduzioni |
| `img/` | Logo (`logo.webp`/`logo.png`, versione piccola `logo-small.*`), bandiere delle lingue, immagine per le anteprime social (`og.jpg`) |
| `foto/` | Le 7 foto del carosello |
| `scripts/build-availability.mjs` | Legge il calendario Google e produce `disponibilita.json` |
| `.github/workflows/disponibilita.yml` | Esegue lo script ogni ora e salva il risultato sul ramo `dati` |
| `CNAME` | Dominio di GitHub Pages (`www.roomsaddecriature.it`) |
| `robots.txt`, `sitemap.xml` | Indicazioni per Google |
| `favicon*`, `apple-touch-icon.png`, `android-chrome-*` | Icone del sito |
| `logoB&b.png`, `logoB&b_noBg.png` | Logo originale, ad alta risoluzione (non usato dalla pagina) |

Sul ramo `dati` c'è un solo file, `disponibilita.json`. Non esiste su `main`.

---

## 2. La pagina

Sezioni, dall'alto:

1. **Intestazione:** logo, nome, **CIN**, selettore lingua IT/EN/ES.
2. **Presentazione:** titolo, frase d'apertura, punteggi Booking e Airbnb, logo grande.
3. **Contatti:** WhatsApp, Telegram, email e Instagram, appesi a un filo come il bucato dei vicoli napoletani.
4. **Le nostre stanze:** carosello 3D con 7 foto.
5. **In ogni camera:** servizi inclusi.
6. **Disponibilità:** l'ospite sceglie arrivo e partenza e vede quante camere restano (vedi sezione 4).
7. **Noi siamo qui:** indirizzo, distanze, mappa.
8. **Da sapere:** arrivo, partenza, bambini, animali, fumo.
9. **Cosa dicono gli ospiti:** link a Google, Booking, Airbnb.
10. **Footer:** copyright e CIN.

In più, un pulsante **WhatsApp fisso** compare quando i contatti in alto escono dallo schermo, con un messaggio già scritto nella lingua scelta.

**Effetti 3D** (tutti spenti se il sistema ha "riduci movimento"):
- il logo si inclina seguendo il mouse e fluttua piano;
- i panni dei contatti oscillano all'ingresso e si inclinano al passaggio del mouse;
- il carosello delle foto ruota in prospettiva;
- il cambio mese del calendario gira come una pagina;
- mappa, servizi, "Da sapere" e recensioni entrano con un breve ribaltamento allo scroll.

### Lingue

La lingua parte da quella del browser (italiano, spagnolo, altrimenti inglese) e la scelta viene ricordata (`localStorage`, chiave `lang`). In `index.html` il testo italiano è scritto nell'HTML; le tre lingue stanno nell'oggetto `T`, nello `<script>` in fondo al file. Ogni elemento traducibile ha `data-i18n="chiave"`.

> Le traduzioni inglese e spagnola sono state scritte senza revisione di un madrelingua. Conviene farle leggere.

---

## 3. Come si modifica

Per ogni modifica di testo vanno aggiornati **due posti**: l'HTML (italiano) e il dizionario `T` nelle tre lingue (`it`, `en`, `es`). Cerca la chiave con `Ctrl+F`.

| Cosa | Dove |
|---|---|
| Servizi delle camere | chiavi `sv0`…`sv7` (HTML e le 3 lingue) |
| Distanze | `n0`…`n7` per i nomi; i metri stanno in `data-m="150"` sull'HTML, il formato (m/km, virgola o punto) è automatico |
| Da sapere | `k0t`/`k0d`…`k4t`/`k4d` (titolo e testo di ogni voce) |
| Calendario (testi) | `availSub`, `hint1`, `hint2`, `rooms2`, `rooms1`, `full`, `askStay`, `waStay`, `noData` e le altre chiavi del blocco "Disponibilità" |
| CIN | in due punti: sotto il nome in alto (`<small>` dentro `.brand`) e nel footer. Non è nelle traduzioni: è lo stesso in tutte le lingue |
| Anno del copyright | chiave `copy` (HTML e 3 lingue). Oggi: 2023 |
| Punteggi | chiavi `rn1`, `rn2`, `rating`, `ratingAb`, `revB`, `revA` (HTML e 3 lingue). **A mano**: vanno aggiornati se cambiano |
| Telefono, email, Instagram | link nella sezione contatti (`.cloths`) e `waMsg`; in più nel JSON-LD in cima |
| Indirizzo | chiave `addr` (HTML e 3 lingue) e JSON-LD in cima |
| Colori | variabili `:root` all'inizio dello `<style>` |

### Aggiungere o cambiare una foto

1. Copia il file (meglio JPG, circa 1000 px di altezza, sotto 150 KB) in `foto/`.
2. In `index.html`, nella sezione `.stage`, aggiungi un `<button class="card">` come gli altri, con `width` e `height` reali.
3. Aggiungi la descrizione nell'array `p` di **tutte e tre** le lingue, **nello stesso ordine** delle foto.
4. Se tocchi le prime foto, ricorda che la prima viene caricata subito, le altre solo quando servono.

### Anteprima in locale

```bash
cd roomsaddecriature
python3 -m http.server 8000      # poi apri http://127.0.0.1:8000
```

In locale la pagina cerca `disponibilita.json` accanto a `index.html` (sul sito vero lo legge dal ramo `dati`). Per provare il calendario senza toccare Google:

```bash
ICS_FILE=prova.ics OUT_FILE=disponibilita.json node scripts/build-availability.mjs
```

`prova.ics` è un calendario iCal di prova con `X-WR-CALNAME:Room's Add'e Criature`. **Non committare** il `disponibilita.json` di prova.

---

## 4. Calendario delle disponibilità

### Come funziona

```
Google Calendar          GitHub Actions (ogni ora)            Pagina del sito
"Rooms Add'e Criature" → scripts/build-availability.mjs  →  ramo "dati"  →  legge il file
(indirizzo iCal segreto)   scrive solo le notti occupate     disponibilita.json   da raw.githubusercontent.com
```

1. Il workflow `Aggiorna disponibilità` parte **ogni ora al minuto 17** (GitHub può ritardare di 5-15 minuti) o a mano da Actions > Run workflow.
2. Lo script scarica il calendario usando il secret `CALENDAR_ICS_URL` e lo trasforma in periodi di notti occupate per camera.
3. Il passo successivo salva `disponibilita.json` sul ramo `dati`, solo se qualcosa è cambiato oppure se l'ultimo salvataggio ha più di 12 ore.
4. La pagina legge il file (cache circa 5 minuti) e disegna il calendario, da oggi per **15 mesi** (`MONTHS_SHOWN` in `index.html`). Lo script scrive dati fino a 18 mesi.

### Cosa vede l'ospite

Le due camere sono **identiche**, quindi il calendario non parla di "Camera 1/2": conta quante ne restano.

- Ogni giorno è **bianco** (2 camere libere), **giallo** (1 camera libera) o **a righe blu** (completo). Il giorno passato è sbiadito.
- L'ospite tocca il **giorno di arrivo** e poi il **giorno di partenza**. Un giorno completo non si può scegliere come arrivo; come partenza sì, perché è il giorno in cui si parte. La partenza si può scegliere solo finché c'è almeno una camera libera per tutte le notti.
- Sotto il calendario compare la risposta ("13–16 ottobre · 3 notti · 1 camera libera") e il pulsante **Chiedi queste date su WhatsApp**, con il messaggio già scritto (date, notti, lingua). "Cambia date" azzera la scelta.
- Su schermo largo si vedono due mesi affiancati, su telefono uno. Si naviga con le frecce o con la tastiera (frecce per muoversi tra i giorni, Invio per scegliere).
- Il calendario non è vincolante: la conferma resta tua.

### Come segnare le prenotazioni sul calendario

Nel calendario Google **"Rooms Add'e Criature"** (solo quello, non quello personale):

- **Il titolo deve contenere "Camera 1" o "Camera 2"**, ad esempio `Rossi - Camera 1`. Vanno bene anche `Stanza 1`, `Room 2`. Maiuscole e minuscole non contano.
- **`entrambe`, `tutte` o `both`** nel titolo blocca tutte e due le camere.
- **Un evento senza numero di camera blocca entrambe le camere.** È voluto: meglio "occupato" che "libero" per errore. Il log dell'automatismo dice quanti sono, senza i titoli.
- **Le notti.** Una prenotazione dal 12 al 15 occupa le notti del 12, 13 e 14: il **15, giorno di partenza, risulta libero**. Gli eventi "tutto il giorno" funzionano così in modo naturale.
- Gli eventi **annullati**, **passati** e oltre i 18 mesi vengono ignorati.
- Gli eventi **ricorrenti** vengono contati una sola volta (il log lo segnala).

### Prima configurazione

1. In Google Calendar, nelle impostazioni del calendario "Rooms Add'e Criature", sezione "Integra calendario", copia l'**Indirizzo segreto in formato iCal** (non quello pubblico). Non va mai incollato in chat, nei commit o nei log.
2. Su GitHub: Settings > Secrets and variables > Actions > **New repository secret**, nome `CALENDAR_ICS_URL`, valore l'indirizzo. Deve essere un *Repository secret*, non una variabile né un *environment*.
3. Il ramo `dati` deve esistere (creato una volta a mano, perché una regola vieta di creare rami al bot) e **non deve essere coperto dalle regole di protezione**: in Settings > Rules > Rulesets, nel ruleset che protegge i rami, aggiungi `dati` come esclusione.
4. Scheda Actions > "Aggiorna disponibilità" > **Run workflow**. Deve diventare verde e il ramo `dati` deve avere `disponibilita.json` con `updated` valorizzato.

### Misure di sicurezza

- **Controllo del nome.** Lo script si ferma se il calendario letto non si chiama "Rooms Add'e Criature" (ignora apostrofi e maiuscole). Così un indirizzo sbagliato non pubblica mai i tuoi impegni personali. Se rinomini il calendario, il controllo va aggiornato in `scripts/build-availability.mjs` (cerca `addecriature`).
- **Privacy.** Il repo è pubblico: in `disponibilita.json` finiscono solo intervalli di date, mai titoli, nomi o note. Nei log l'indirizzo del calendario non compare mai.
- **Dati vecchi.** Se il file manca o ha più di 72 ore (`MAX_AGE_H` in `index.html`), la pagina **non mostra giorni liberi**: scrive "Il calendario non è disponibile in questo momento. Scrivici e ti rispondiamo subito" con il pulsante WhatsApp.

### Se qualcosa non va

| Sintomo o messaggio | Causa e rimedio |
|---|---|
| `Manca CALENDAR_ICS_URL` | Il secret non esiste o ha un nome diverso, o è stato messo in "Environments" invece che in "Repository secrets" |
| `HTTP 404` / `HTTP 403` | L'indirizzo è incompleto, pubblico invece che segreto, o è stato reimpostato in Google. Copialo di nuovo: il messaggio dice cosa non torna |
| `Il calendario letto si chiama "…"` | Hai incollato l'indirizzo di un altro calendario |
| `La risposta non è un calendario iCal` | Hai incollato un link di condivisione o l'ID, non l'indirizzo iCal |
| `Cannot create ref due to creations being restricted` | Il ramo `dati` non esiste: crealo a mano (vedi Prima configurazione, punto 3) |
| `Cannot update this protected ref` | `dati` è coperto da una regola: escludilo dal ruleset |
| La pagina dice "il calendario non è disponibile" | Dati assenti o con più di 72 ore. Controlla Actions: l'ultima esecuzione è verde? I workflow pianificati si disattivano dopo 60 giorni senza attività nel repo: va riattivato da Actions |
| Un giorno risulta "Completo" o "1 camera libera" senza motivo | C'è un evento senza "Camera 1/2" nel titolo, che blocca entrambe le camere |
| Un giorno risulta libero ma non lo è | La prenotazione arriva da Booking o Airbnb e non è stata segnata a mano sul calendario, oppure l'ultimo aggiornamento è di meno di un'ora fa |

### Limiti da conoscere

- La disponibilità è **indicativa**: riflette solo ciò che segni sul calendario. Le prenotazioni di Booking e Airbnb vanno inserite a mano (o importate nel calendario).
- L'aggiornamento non è istantaneo: circa un'ora, più la cache.
- Non c'è prenotazione online: il pulsante porta a WhatsApp, e la conferma la dai tu.

---

## 5. Pubblicazione

- Il sito è servito da GitHub Pages dal ramo `main`; il dominio è nel file `CNAME`.
- `main` è protetto da regole (modifiche solo tramite pull request, ramo bloccato): chi ha il permesso di aggirarle può fare push diretto, e GitHub stampa un avviso "locked branch" anche quando il push riesce.
- Dopo un push l'aggiornamento online arriva in uno o due minuti. Se vedi ancora la versione vecchia, svuota la cache del browser (Ctrl+F5).

### Google e condivisione

Nell'`<head>` di `index.html`: titolo e descrizione nelle tre lingue (si aggiornano al cambio lingua), indirizzo canonico, anteprima per WhatsApp e social (`img/og.jpg`) e dati strutturati `BedAndBreakfast` (nome, indirizzo, coordinate, contatti, orari, servizi, profili). Non contiene valutazioni, perché i punteggi di altri siti non vanno dichiarati come propri.

`sitemap.xml` ha una data `lastmod`: aggiornala se cambi la pagina in modo importante.

---

## 6. Promemoria periodici

| Cosa | Quando | Dove |
|---|---|---|
| Punteggi Booking e Airbnb | Quando cambiano di molto | `rn1`, `rn2`, `rating`, `ratingAb`, `revB`, `revA` |
| Servizi, regole, distanze | Se cambiano | sezioni "In ogni camera", "Noi siamo qui" e "Da sapere" |
| Traduzioni | Quando aggiungi testo | dizionario `T`, tre lingue |
| Esecuzioni dell'automatismo | Ogni tanto | scheda Actions: verde? Se rosso, vedi la tabella sopra |
| Attività nel repo | Almeno ogni 2 mesi | GitHub disattiva i workflow pianificati dopo 60 giorni senza attività |
| Indirizzo iCal | Se reimposti il calendario in Google | secret `CALENDAR_ICS_URL` |

---

## 7. Cosa è stato fatto e perché

- **Direzione del design:** blu maiolica, giallo tufo, rosso pomodoro, verde. Titoli in Alfa Slab One, come l'insegna di una bottega; testo in Nunito Sans. Il filo con i panni dei contatti nasce dal bucato del logo e dei vicoli di Napoli.
- **Logo e foto:** il logo è quello originale (`logoB&b_noBg.png`), ottimizzato da 800 KB a 96 KB in WebP. Le foto vengono dalla scheda Booking del B&B, ricompresse.
- **Contenuti veri:** servizi, regole, indirizzo, distanze e orari vengono dalla scheda Booking; il CIN è `IT063049C2UUTMPOCJ`. Il voto Airbnb (4,99 su 5) riguarda la scheda Airbnb "Stanze Aggiungi e Crea", una sola camera.
- **Responsive e accessibilità:** provato a 390 px e a 1280 px senza scroll orizzontale; link "Vai al contenuto", focus visibile, descrizioni delle foto, effetti spenti con "riduci movimento", contrasti controllati.
- **Perché il calendario passa dal ramo `dati`:** `main` richiede pull request e non permette push al bot di GitHub. Un ramo separato, escluso dalle regole, evita pull request ogni ora e non sporca la cronologia del sito.
- **Perché un evento senza camera blocca entrambe:** un errore di battitura nel titolo deve mostrare "occupato", mai "libero", per non causare doppie prenotazioni.
