# Tracking progetto Studio App

## Scopo
Applicazione web responsive per la gestione degli appuntamenti di uno studio di psicologia, utilizzabile da Android, iOS e PC.

## Decisioni

| Data | Decisione | Motivazione |
| --- | --- | --- |
| 2026-08-20 | Realizzare una web app responsive/PWA | Un'unica applicazione accessibile da telefono e computer |
| 2026-08-20 | Usare Next.js con TypeScript e App Router | Base moderna per interfaccia e backend web |
| 2026-08-20 | Sviluppare prima un prototipo locale | Validare flussi e interfaccia senza usare dati reali |
| 2026-08-20 | Usare solo dati fittizi nella prima fase | I dati dei pazienti sono dati sanitari e richiedono protezioni adeguate |
| 2026-08-20 | Rimandare WhatsApp Business e email automatiche | Richiedono consenso, configurazioni esterne e valutazioni privacy |

## Azioni completate

- Verificata la presenza di Windows PowerShell 5.1.
- Verificati Node.js `v24.19.0`, npm `11.17.0`, npx e VS Code.
- Installato Git `2.55.0.windows.3` tramite `winget`.
- Creato il progetto Next.js TypeScript in `C:\Users\lucap\studio-app`.
- Abilitati TypeScript, Tailwind CSS, ESLint, App Router, `src/` e Turbopack.
- Installate le dipendenze iniziali con npm.
- Inizializzato il repository Git locale.
- Verificato ESLint con esito positivo.
- Sostituito il template iniziale con una dashboard responsive.
- Aggiunti dati demo per appuntamenti, pazienti recenti e indicatori dello studio.
- Aggiunta navigazione locale tra le sezioni della dashboard.
- Corretta una graffa CSS in eccesso in `src/app/globals.css` che impediva la compilazione in Chrome/Turbopack.
- Verificata la build di produzione con esito positivo (`npm run build`).
- Aggiunto modulo locale per inserire un paziente con nome, cognome, telefono ed email.
- Aggiunta rimozione dei pazienti demo tramite il menu azioni.
- Collegato il contatore dei pazienti allo stato della pagina.
- Aggiunta persistenza dei pazienti tramite `localStorage` del browser.
- Verificata la build dopo la persistenza con esito positivo (`npm run build`).
- Aggiunta modifica dei pazienti esistenti tramite il modulo contatto.
- Verificata la build dopo la modifica pazienti con esito positivo (`npm run build`).
- Reso interattivo il calendario con selezione del giorno.
- Aggiunto modulo per creare appuntamenti con giorno, paziente, orario e tipo.
- Aggiunta persistenza locale degli appuntamenti tramite `localStorage`.
- Verificata la build dopo il calendario con esito positivo (`npm run build`).
- Aggiunta modifica degli appuntamenti tramite modulo precompilato.
- Aggiunta cancellazione degli appuntamenti con conferma.
- Verificata la build dopo modifica e cancellazione appuntamenti con esito positivo (`npm run build`).
- Ordinati gli appuntamenti dell'agenda per orario crescente, indipendentemente dall'ordine di inserimento.
- Verificata la build dopo l'ordinamento con esito positivo (`npm run build`).
- Verificato `db:generate` con `npm.cmd` e schema Prisma con esito positivo.
- Installati `@prisma/adapter-better-sqlite3` e `better-sqlite3` per collegare Prisma 7 a SQLite.
- Creato singleton server-side Prisma in `src/lib/prisma.ts`.
- Creato endpoint `GET/POST /api/patients` con validazione di nome e cognome.
- Verificato endpoint con dati fittizi: `GET 200` e `POST 201`.
- Verificata build dopo l'API con esito positivo (`npm run build`).
- Creato endpoint dinamico `PUT/DELETE /api/patients/[id]`.
- Collegata la UI pazienti alle API quando il server e disponibile, mantenendo `localStorage` come fallback temporaneo.
- Verificato ciclo CRUD API su record fittizio: `PUT 200` e `DELETE 204`.
- Verificata build dopo il collegamento UI-API con esito positivo (`npm run build`).
- Creato endpoint CRUD `/api/appointments` e `/api/appointments/[id]`.
- Collegati gli appuntamenti ai pazienti tramite relazione Prisma.
- Verificato ciclo CRUD appuntamenti con record temporanei: `POST 201`, `PUT 200`, `DELETE 204`.
- Rimossi i dati temporanei usati per la verifica delle API.
- Verificata build dopo le API appuntamenti con esito positivo (`npm run build`).
- Collegata la UI agenda alle API appuntamenti.
- Aggiunta migrazione automatica dei dati demo da `localStorage` quando il database e vuoto.
- Mantenuto fallback `localStorage` se le API non sono disponibili.
- Verificato ordinamento API con due record temporanei: `08:15,17:30`.
- Rimossi anche i record temporanei usati per il test UI agenda.
- Verificata build dopo il collegamento completo agenda con esito positivo (`npm run build`).
- Installati Prisma `7.9.1` e `@prisma/client`.
- Configurato SQLite locale con `DATABASE_URL="file:./dev.db"`.
- Definiti i modelli Prisma `Patient` e `Appointment` con relazione paziente-appuntamento.
- Creata e applicata la migrazione iniziale `20260820112203_init`.
- Generato il client Prisma TypeScript.
- Aggiunti gli script npm `db:generate` e `db:migrate`.
- Validati schema Prisma e build applicazione con esito positivo.
- Installato `bcryptjs` per la verifica delle password.
- Aggiunta autenticazione locale con cookie HTTP-only firmato, login, sessione e logout.
- Aggiunto `.env.local` con credenziali esclusivamente demo, escluso da Git.
- Protetta la dashboard: senza sessione viene mostrata la schermata di accesso.
- Verificata autenticazione: credenziali errate `401`, login `200`, sessione `200`, logout `200`.
- Verificata build dopo autenticazione con esito positivo (`npm run build`).
- Corrette le chiavi React della lista pazienti usando l'ID univoco del database invece del nome.
- Rimossi due record demo duplicati `Test Database` creati dai test API.
- Corretto il caricamento fallback per evitare aggiornamenti di stato sincroni dentro un effect.
- Verificati ESLint e build dopo la correzione con esito positivo.
- Ripristinata cancellazione pazienti nella UI con conferma esplicita.
- Collegata la cancellazione paziente all'endpoint `DELETE /api/patients/[id]`.
- Verificati ESLint e build dopo il ripristino con esito positivo.
- Rimosso un duplicato di Luca Preve rimasto dai test precedenti.
- Aggiunto controllo API anti-duplicazione su nome/cognome, email o telefono.
- Aggiunto messaggio UI specifico per duplicato (`409`).
- Verificato anti-duplicazione: primo inserimento `201`, secondo identico `409`.
- Verificata build dopo la correzione duplicati con esito positivo.
- Rimossi quattro record `Test Database` residui dai test precedenti.
- Creato pannello completo "Gestisci pazienti" separato dal modulo nuovo paziente.
- Aggiunta ricerca libera per nome, email e telefono.
- Aggiunti filtri per consenso email e consenso WhatsApp.
- Aggiunte azioni modifica, cancellazione e nuovo paziente nel pannello.
- Aggiunto layout responsive del gestore pazienti.
- Verificati ESLint e build dopo il gestore con esito positivo.
- Confermato comportamento sessione demo: cookie HTTP-only persistente per 8 ore anche dopo la chiusura del browser.
- Aggiunti al paziente i consensi separati per email e WhatsApp.
- Creata e applicata la migrazione `20260820115855_patient_contact_consents`.
- Aggiunti i consensi al modulo paziente e alle API create/modifica.
- Verificati Prisma generate, ESLint e build dopo i consensi con esito positivo.
- Risolto errore `500` nel salvataggio consensi: il server dev usava un client Prisma precedente alla migrazione.
- Riavviato Next.js e verificato salvataggio consensi con `POST 201`.
- Rimosso il record demo usato per la verifica.
- Verificate `DATABASE_URL` e `DIRECT_URL` in `.env.local` senza esporre i segreti.
- Preparato Prisma al provider PostgreSQL Supabase con `DIRECT_URL` per le migrazioni.
- Adeguata configurazione Prisma 7: `DIRECT_URL` e usato da `prisma.config.ts`, senza `directUrl` nello schema.
- Validati schema PostgreSQL e client Prisma con esito positivo.
- Corretto caricamento Prisma CLI per dare precedenza a `.env.local` rispetto a `.env`.
- Applicato lo schema PostgreSQL a Supabase con `prisma db push`.
- Sostituito adapter runtime SQLite con `@prisma/adapter-pg` e `pg`.
- Verificata API pazienti su Supabase con `GET 200`.
- Verificati build e lint con configurazione Supabase.
- Escluso anche `dev.db` dal versionamento.
- Verificato che non esista ancora un remote GitHub configurato.
- Collegato il remote GitHub `KonteMannoX/studio-di-psicologia`.
- Corretto avatar dei nuovi pazienti aggiungendo la classe `avatar-amber` mancante.
- Verificati ESLint e build dopo la correzione avatar con esito positivo.
- Cambiato il nome visualizzato dell'app da "Studio calma" a "Studio di Psicologia".
- Aggiornati marchio UI, titolo pagina, descrizione metadata e documentazione di pubblicazione.
- Scelto percorso di pubblicazione `Supabase PostgreSQL + Vercel` per la sincronizzazione tra dispositivi.
- Creato `Doc/Deployment.md` con procedura e variabili necessarie.

## Stato attuale

Dashboard demo disponibile in locale. La cartella `C:\Users\lucap\StudioApp` precedente e stata eliminata; il progetto si trova in `C:\Users\lucap\studio-app`.

Il database Supabase PostgreSQL e collegato alla UI per pazienti e appuntamenti. La dashboard richiede ora autenticazione locale. Le chiavi delle liste sono basate sugli ID database. La UI ricade su `localStorage` se il server non risponde. Le credenziali e il segreto in `.env.local` sono solo da demo e vanno sostituiti prima di qualsiasi uso reale.

La build di produzione e stata avviata, ma il terminale non ha restituito un esito finale completo; va ripetuta prima della prima funzionalita.

Su Windows questa installazione blocca il wrapper `npm.ps1` per la Execution Policy. Usare `npm.cmd` oppure il percorso completo del progetto, ad esempio `npm.cmd --prefix C:\Users\lucap\studio-app run build`.

Dopo una migrazione Prisma o una rigenerazione del client, riavviare il server `npm.cmd --prefix C:\Users\lucap\studio-app run dev` per caricare il client aggiornato.

## Prossimi passi

1. Rafforzare autenticazione e gestione segreti per produzione.
2. Valutare database condiviso in ambiente server per PC, Android e iOS.
3. Valutare integrazione Google Calendar dopo la persistenza condivisa.
4. Progettare promemoria email e WhatsApp Business usando i consensi registrati.

## Blocco operativo corrente

Il progetto Supabase e le risorse Vercel richiedono un account esterno. Fino alla loro creazione il progetto resta su SQLite locale e non deve ricevere dati reali.

### Promemoria sicurezza sessione

Prima dell'uso reale valutare una scadenza piu breve della sessione e/o una scelta esplicita "Ricordami". Per i dati sanitari, la sessione persistente dopo la chiusura del browser deve essere una decisione consapevole di sicurezza e privacy.

## Regola di aggiornamento

Aggiornare questo file dopo ogni scelta tecnica importante, installazione, modifica funzionale o verifica significativa.
