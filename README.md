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
| `foto/` | Le 11 foto del carosello (camere, bagni, spazi comuni), ritagliate in formato verticale |
| `scripts/build-availability.mjs` | Legge il calendario Google e produce `disponibilita.json` |
| `scripts/check-ratings.mjs` | Controlla che `punteggi.json` sia scritto bene |
| `.github/workflows/disponibilita.yml` | Ogni ora aggiorna il calendario sul ramo `dati` e controlla `punteggi.json` |
| `.github/workflows/promemoria-punteggi.yml` | Il primo di ogni mese apre una segnalazione per ricordarti di aggiornare i punteggi |
| `CNAME` | Dominio di GitHub Pages (`www.roomsaddecriature.it`) |
| `robots.txt`, `sitemap.xml` | Indicazioni per Google |
| `favicon*`, `apple-touch-icon.png`, `android-chrome-*` | Icone del sito |
| `logoB&b.png`, `logoB&b_noBg.png` | Logo originale, ad alta risoluzione (non usato dalla pagina) |

Sul ramo `dati` ci sono due file, che non esistono su `main`: `disponibilita.json` (scritto dall'automatismo ogni ora, non toccarlo) e `punteggi.json` (lo modifichi tu, vedi sezione 5).

---

## 2. La pagina

Sezioni, dall'alto:

1. **Intestazione:** logo, nome, **CIN**, selettore lingua IT/EN/ES.
2. **Presentazione:** titolo, frase d'apertura, logo grande e, sotto, i punteggi di Booking e Airbnb: il numero di Booking dentro una **stella** gialla e quello di Airbnb dentro una **medaglia a onde** azzurra, con accanto il nome della piattaforma e il numero di recensioni, e sotto il mese di aggiornamento (vedi sezione 5). Toccando un punteggio si apre la pagina delle recensioni.
3. **Contatti:** WhatsApp, Telegram, Signal, email e Instagram, appesi a un filo come il bucato dei vicoli napoletani (su tablet vanno su due righe, su telefono su tre). Il numero di telefono è lo stesso per WhatsApp, Telegram e Signal.
4. **Le nostre stanze:** carosello 3D con 11 foto, in quest'ordine: camere, bagni, corridoio e angolo ristoro.
5. **In ogni camera:** servizi inclusi.
6. **Disponibilità:** l'ospite sceglie arrivo e partenza e vede quante camere restano (vedi sezione 4).
7. **Noi siamo qui:** indirizzo, distanze, mappa.
8. **Da sapere:** arrivo, partenza, bambini, animali, fumo.
9. **Recensioni:** una striscia sottile con i loghi di Google, Booking e Airbnb, che portano alle recensioni.
10. **Footer:** copyright e CIN.

I loghi di Google, Booking.com e Airbnb sono icone di [Simple Icons](https://simpleicons.org) (licenza CC0) inserite nel codice come immagini vettoriali; i marchi appartengono ai rispettivi proprietari.

In più, un pulsante **WhatsApp fisso** compare quando i contatti in alto escono dallo schermo, con un messaggio già scritto nella lingua scelta.

**Effetti 3D** (tutti spenti se il sistema ha "riduci movimento"):
- il logo si inclina seguendo il mouse e fluttua piano;
- la stella e la medaglia dei punteggi ruotano un poco al passaggio del mouse;
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
| Punteggi | **non nel codice**: si modificano in `punteggi.json` sul ramo `dati` (sezione 5). Il testo delle frasi è nelle chiavi `scoreScale`, `scoreReviews`, `scoreLabel`, `asOf` |
| Loghi delle piattaforme | sprite SVG all'inizio del `<body>` (`#lg-google`, `#lg-booking`, `#lg-airbnb`), usati nella striscia delle recensioni. Il testo per i lettori di schermo è nella chiave `revOn` |
| Telefono, email, Instagram | link nella sezione contatti (`.cloths`: WhatsApp `wa.me/…`, Telegram `t.me/+…`, Signal `signal.me/#p/+…`) e `waMsg`; in più nel JSON-LD in cima |
| Indirizzo | chiave `addr` (HTML e 3 lingue) e JSON-LD in cima |
| Colori | variabili `:root` all'inizio dello `<style>` |

### Aggiungere o cambiare una foto

1. Copia il file (meglio JPG, circa 1000 px di altezza, sotto 150 KB) in `foto/`. Il carosello è **verticale** (larghezza:altezza circa 7:10): ritaglia prima le foto orizzontali sulla parte che conta, altrimenti vengono tagliate ai lati.
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
- In alto ci sono due campi, **Arrivo** e **Partenza**: quello da compilare è evidenziato e si riempie scegliendo i giorni sul calendario, prima l'arrivo e poi la partenza, senza istruzioni scritte. Un giorno completo non si può scegliere come arrivo; come partenza sì, perché è il giorno in cui si parte. La partenza si può scegliere solo finché c'è almeno una camera libera per tutte le notti. La ✕ accanto ai campi azzera la scelta, e toccare un campo lo ripulisce.
- Quando le date sono complete compare, sotto il calendario, la risposta ("10–14 novembre · 4 notti · 2 camere libere") e il pulsante **Chiedi queste date su WhatsApp**, con il messaggio già scritto (date, notti, lingua). Finché le date non sono scelte, quella barra è nascosta. Per i lettori di schermo c'è un annuncio con lo stesso testo.
- Su schermo largo si vedono due mesi affiancati, su telefono uno. Si naviga con le frecce o con la tastiera (frecce per muoversi tra i giorni, Invio per scegliere).
- Il calendario non è vincolante: la conferma resta tua.

### Come segnare le prenotazioni sul calendario

Nel calendario Google **"Rooms Add'e Criature"** (solo quello, non quello personale) **un evento = una prenotazione**, dal giorno di arrivo al giorno di partenza.

**Il titolo dice a quale camera appartiene.** Formato consigliato: `Cognome - Camera 1`. Tutti i casi sotto sono stati provati con lo script:

| Titolo | Cosa blocca |
|---|---|
| `Rossi - Camera 1` · `Stanza 1` · `Camera n°1` · `Room 1` | solo la Camera 1 |
| `Rossi - Camera 2` · `Camera due` (e le stesse varianti con 2) | solo la Camera 2 |
| `Rossi - entrambe` · `tutte le camere` · `both` | tutte e due |
| `Rossi - Camera 1 e Camera 2` · `Camera 1 + Camera 2` · `Camera 1 e 2` · `Camera 1/2` · `Camera 1 + 2` · `Camere 1, 2` · `Camera 1 & 2` · `Camera uno e due` | tutte e due |
| `Rossi` (nessun numero di camera) | **tutte e due**, per prudenza |
| `Camera 12` · `C1 Rossi` | numero non riconosciuto: **tutte e due** |
| `Rossi - camera 2 persone` · `Rossi 2 ospiti` · `camera 1 notte` | "2 persone", "2 ospiti", "1 notte" **non sono numeri di camera**: se non c'è un altro numero, **tutte e due** |
| `Rossi - Camera 1 - 2 ospiti` · `Camera 2 - 3 notti` · `Camera 1 con 2 adulti` | solo la camera indicata: gli ospiti e le notti si ignorano |

Maiuscole e minuscole non contano. Il numero di camera conta solo come **1 o 2**.

Altre regole:

- **Le notti.** Una prenotazione dal 12 al 15 occupa le notti del 12, 13 e 14: il **15, giorno di partenza, risulta libero**. Gli eventi "tutto il giorno" funzionano così in modo naturale. Un evento con orario (per esempio 10 marzo alle 14:00, 13 marzo alle 10:00) conta per giorno di calendario, nel fuso di Roma: occupa le notti del 10, 11 e 12. Un evento di poche ore nella stessa giornata occupa **quella notte**.
- Gli eventi **annullati**, **già finiti** e oltre i 18 mesi vengono ignorati.
- Gli eventi **ricorrenti** vengono contati una sola volta (il log lo segnala).
- **Due eventi sulla stessa notte bloccano entrambe le camere**, qualunque sia il titolo: di solito sono una Camera 1 e una Camera 2, e anche se i titoli non lo dicono la notte risulta completa. Vale pure se i titoli sono uguali (due eventi nella stessa camera sarebbero una doppia prenotazione: per prudenza risultano occupate tutte e due). **Un cambio in giornata non conta**: se un ospite parte il 15 e un altro arriva il 15 non condividono nessuna notte, quindi non si blocca niente.
- Se c'è **un evento senza numero di camera**, blocca entrambe le camere: è voluto, meglio "occupato" che "libero" per errore. Il log dell'automatismo dice quanti sono, senza i titoli.

### Come ragiona il calendario, passo per passo

**1. Da Google al file (lo script, ogni ora)**

1. Controlla che il calendario si chiami "Rooms Add'e Criature". Se no, si ferma e non scrive niente.
2. Scarta gli eventi annullati, già finiti o oltre i 18 mesi.
3. Per ogni evento calcola le **notti occupate**: dalla data di inizio a quella di fine **esclusa**.
4. Dal titolo decide a **quale camera** appartiene (tabella sopra). Nessun numero riconosciuto = entrambe.
5. Cerca le notti in cui ci sono **due eventi insieme**, anche con camere diverse o senza camera: quelle notti blocca **entrambe** le camere. Un cambio in giornata non conta.
6. Per ogni camera unisce i periodi che si toccano o si sovrappongono (12–15 e 15–17 diventano 12–17).
7. Salva su `disponibilita.json` **solo intervalli di date** per camera, mai titoli o nomi.

**2. Dal file all'ospite (la pagina)**

Le due camere sono identiche, quindi per ogni notte la pagina conta solo **quante camere sono libere** (2, 1 o 0). Da qui:

- **Colore del giorno:** bianco = 2 libere, giallo = 1 libera, a righe blu = completo (0). "Il giorno" è la notte che inizia quel giorno.
- **Arrivo:** si può scegliere un giorno solo se quella notte c'è almeno 1 camera libera. Un giorno "completo" non si può scegliere come arrivo.
- **Partenza:** si può scegliere dal giorno dopo l'arrivo fino al primo giorno oltre il quale **nessuna camera** resterebbe libera per tutte le notti. Il giorno di partenza può anche essere "completo": è il giorno in cui si parte.
- **Risposta ("n camere libere"):** quante camere sono libere per **tutte** le notti del soggiorno. "2 camere libere" vuol dire che entrambe sono libere dall'arrivo alla partenza.
- Le camere **non vengono assegnate** all'ospite: "1 camera libera" non dice quale delle due.
- Se i dati hanno più di 72 ore, la pagina non mostra giorni liberi (vedi "Misure di sicurezza").

Esempio. La Camera 1 è occupata dal 15 al 19 novembre (notti 15, 16, 17, 18), la Camera 2 è libera:

| Arrivo | Partenza | Cosa succede |
|---|---|---|
| 10 nov | 14 nov | 2 camere libere (nessuna notte occupata) |
| 13 nov | 16 nov | **1 camera libera**: la Camera 1 è occupata dal 15, resta la 2 |
| 15 nov (giallo) | 18 nov | 1 camera libera, solo la Camera 2 |
| 19 nov | 21 nov | 2 camere libere: la Camera 1 si libera il 19, giorno di partenza dell'ospite precedente |

Se invece **tutte e due** fossero occupate dal 12 al 14: il 12 e il 13 sono "completo" e non si possono scegliere come arrivo, il 14 è libero come arrivo, e chi arriva l'11 può partire al massimo il 12.

**3. Cosa il sistema non fa**

- Non importa le prenotazioni di Booking e Airbnb: vanno segnate a mano.
- Non tiene conto del numero di ospiti né degli orari di arrivo e partenza.
- Non distingue una doppia prenotazione sulla stessa camera da due prenotazioni su camere diverse: in entrambi i casi la notte risulta **completa**, senza avvisi.
- La disponibilità è **indicativa**: la conferma resta tua.

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
| Un giorno risulta "Completo" ma una camera è libera | Ci sono **due eventi sulla stessa notte** (magari la stessa prenotazione inserita due volte, o una prenotazione e un promemoria): bloccano entrambe le camere. Cerca l'evento in più nel calendario |
| Un giorno risulta libero ma non lo è | La prenotazione arriva da Booking o Airbnb e non è stata segnata a mano sul calendario, oppure l'ultimo aggiornamento è di meno di un'ora fa |

### Limiti da conoscere

- La disponibilità è **indicativa**: riflette solo ciò che segni sul calendario. Le prenotazioni di Booking e Airbnb vanno inserite a mano (o importate nel calendario).
- L'aggiornamento non è istantaneo: circa un'ora, più la cache.
- Non c'è prenotazione online: il pulsante porta a WhatsApp, e la conferma la dai tu.

---

## 5. Punteggi di Booking e Airbnb

I punteggi **non si aggiornano da soli**: né Airbnb né Booking offrono un modo ufficiale per leggere il punteggio di una scheda, e leggere le loro pagine con un programma è fragile e contrario ai loro termini d'uso. Per questo stanno in un file che si modifica a mano, in un minuto, **senza toccare il codice** e senza commit su `main`.

### Il file

`punteggi.json` sul ramo `dati`:

```json
{
  "updated": "2026-10",
  "booking": { "score": 9.8,  "scale": 10, "reviews": 139 },
  "airbnb":  { "score": 4.99, "scale": 5,  "reviews": 69 }
}
```

- `updated`: mese dell'ultimo controllo, nel formato `AAAA-MM`. Compare sul sito ("Punteggi aggiornati a ottobre 2026") accanto ai punteggi.
- `score`: il punteggio **con il punto**, non con la virgola (`9.8`). `scale`: la scala (10 per Booking, 5 per Airbnb). `reviews`: il numero di recensioni, intero.
- La pagina scrive i numeri nel formato della lingua ("9,8" in italiano, "9.8" in inglese).

### Come si aggiorna

1. Leggi punteggio e numero di recensioni sulle schede di Booking.com e Airbnb.
2. Apri `https://github.com/porofoskini/roomsaddecriature/edit/dati/punteggi.json`.
3. Cambia i numeri e `updated`.
4. **Commit changes**, lasciando "Commit directly to the dati branch".

Entro 5 minuti (cache) il sito mostra i nuovi numeri.

### Promemoria e controlli

- **Promemoria mensile.** Il primo di ogni mese il workflow `Promemoria punteggi` apre una segnalazione (issue) "Aggiorna i punteggi di Booking e Airbnb" con i valori attuali e il link per modificare. Ti arriva per email. Chiudila quando hai finito; finché è aperta non ne apre un'altra.
- **Controllo di forma.** Ogni ora l'automatismo del calendario esegue `scripts/check-ratings.mjs`. Se il file ha un errore (una virgola di troppo, il punteggio scritto con la virgola, un numero mancante) l'esecuzione diventa **rossa** e ti arriva l'avviso con il motivo. Se il file è valido ma vecchio di più di 45 giorni, c'è solo un avviso giallo.
- **Numeri di riserva.** Se il file manca, è rotto o non si legge, la pagina mostra gli ultimi numeri scritti in `index.html` (costante `RATINGS_FALLBACK`) con la loro data: non resta mai vuota e non mostra mai numeri incoerenti. Quando cambi i punteggi di molto, conviene aggiornare anche `RATINGS_FALLBACK`.

### Perché c'è la data

Mostrare un punteggio vecchio come se fosse attuale può essere considerato pubblicità ingannevole. La data accanto ai numeri è la protezione più semplice.

### Se qualcosa non va

| Sintomo | Causa e rimedio |
|---|---|
| Il sito mostra ancora i vecchi numeri | Cache di circa 5 minuti: aspetta e ricarica con Ctrl+F5. Se persiste, controlla che il commit sia sul ramo **dati** e non su `main` |
| L'esecuzione di "Aggiorna disponibilità" è rossa al passo "Controlla il file dei punteggi" | Il file ha un errore: il messaggio dice quale. Correggilo da GitHub, oppure ripristina la versione precedente dalla cronologia del file |
| Il file non esiste ancora | Va creato sul ramo `dati` con il formato qui sopra: fino ad allora il sito usa i numeri di riserva |
| La segnalazione mensile non arriva | Controlla che il workflow `Promemoria punteggi` sia attivo in Actions e che tu segua il repo (Watch) |

---

## 6. Pubblicazione

- Il sito è servito da GitHub Pages dal ramo `main`; il dominio è nel file `CNAME`.
- `main` è protetto da regole (modifiche solo tramite pull request, ramo bloccato): chi ha il permesso di aggirarle può fare push diretto, e GitHub stampa un avviso "locked branch" anche quando il push riesce.
- Dopo un push l'aggiornamento online arriva in uno o due minuti. Se vedi ancora la versione vecchia, svuota la cache del browser (Ctrl+F5).

### Google e condivisione

Nell'`<head>` di `index.html`: titolo e descrizione nelle tre lingue (si aggiornano al cambio lingua), indirizzo canonico, anteprima per WhatsApp e social (`img/og.jpg`) e dati strutturati `BedAndBreakfast` (nome, indirizzo, coordinate, contatti, orari, servizi, profili). Non contiene valutazioni, perché i punteggi di altri siti non vanno dichiarati come propri.

`sitemap.xml` ha una data `lastmod`: aggiornala se cambi la pagina in modo importante.

---

## 7. Promemoria periodici

| Cosa | Quando | Dove |
|---|---|---|
| Punteggi Booking e Airbnb | Ogni mese (ti arriva una segnalazione su GitHub) | `punteggi.json` sul ramo `dati` (sezione 5) |
| Servizi, regole, distanze | Se cambiano | sezioni "In ogni camera", "Noi siamo qui" e "Da sapere" |
| Traduzioni | Quando aggiungi testo | dizionario `T`, tre lingue |
| Esecuzioni dell'automatismo | Ogni tanto | scheda Actions: verde? Se rosso, vedi la tabella sopra |
| Attività nel repo | Almeno ogni 2 mesi | GitHub disattiva i workflow pianificati dopo 60 giorni senza attività |
| Indirizzo iCal | Se reimposti il calendario in Google | secret `CALENDAR_ICS_URL` |

---

## 8. Cosa è stato fatto e perché

- **Direzione del design:** blu maiolica, giallo tufo, rosso pomodoro, verde. Titoli in Alfa Slab One, come l'insegna di una bottega; testo in Nunito Sans. Il filo con i panni dei contatti nasce dal bucato del logo e dei vicoli di Napoli.
- **Logo e foto:** il logo è quello originale (`logoB&b_noBg.png`), ottimizzato da 800 KB a 96 KB in WebP. Le foto vengono dalla scheda Booking del B&B, ricompresse.
- **Contenuti veri:** servizi, regole, indirizzo, distanze e orari vengono dalla scheda Booking; il CIN è `IT063049C2UUTMPOCJ`. Il voto Airbnb (4,99 su 5) riguarda la scheda Airbnb "Stanze Aggiungi e Crea", una sola camera.
- **Responsive e accessibilità:** provato a 390 px e a 1280 px senza scroll orizzontale; link "Vai al contenuto", focus visibile, descrizioni delle foto, effetti spenti con "riduci movimento", contrasti controllati.
- **Perché il calendario passa dal ramo `dati`:** `main` richiede pull request e non permette push al bot di GitHub. Un ramo separato, escluso dalle regole, evita pull request ogni ora e non sporca la cronologia del sito.
- **Perché un evento senza camera blocca entrambe:** un errore di battitura nel titolo deve mostrare "occupato", mai "libero", per non causare doppie prenotazioni.
- **Perché arrivo e partenza sono due campi grandi:** il calendario non deve spiegarsi a parole. Il campo da riempire è evidenziato, e la risposta (date, notti, camere libere) compare solo quando le date sono complete, con il pulsante WhatsApp già compilato.
- **Perché il numero sta dentro una forma (stella per Booking, medaglia a onde per Airbnb) e i loghi solo nella striscia in fondo:** il numero è la prova più forte e deve restare piccolo e leggibile accanto al nome della piattaforma; i loghi servono a riconoscere dove si aprono le recensioni.
- **Perché due eventi sulla stessa notte bloccano entrambe le camere:** con due sole camere, due prenotazioni insieme le riempiono; di solito una è la 1 e l'altra la 2, ma il titolo può essere scritto in modo diverso o sbagliato. Si guardano le notti e non i giorni, così un cambio in giornata non fa risultare tutto occupato.
- **Perché i titoli sono letti con tolleranza:** `Camera 1 e 2` e `Camera 1/2` sono modi naturali di scrivere "tutte e due", mentre `camera 2 persone` non è la camera 2. Sbagliare in questi due casi faceva risultare libera una camera occupata, che è l'errore più costoso.
- **Perché i punteggi stanno in un file con la data:** non c'è un modo affidabile e consentito per leggerli in automatico da Booking e Airbnb; tenerli in un file separato li rende modificabili in un minuto senza toccare il sito, e la data li rende onesti anche se ti dimentichi di aggiornarli.
