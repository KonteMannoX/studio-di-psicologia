# Pubblicazione online

## Obiettivo
Rendere Studio di Psicologia accessibile da PC, Android e iOS mantenendo un database condiviso.

## Scelta tecnica

- Database: Supabase PostgreSQL.
- Hosting applicazione: Vercel.
- ORM: Prisma.
- Autenticazione: da rafforzare prima di dati reali.

## Procedura prevista

1. Creare un progetto Supabase in una regione UE.
2. Recuperare le connection string PostgreSQL del progetto.
3. Aggiornare Prisma da SQLite a PostgreSQL.
4. Applicare lo schema sul database remoto.
5. Configurare `DATABASE_URL` come variabile segreta locale e Vercel.
6. Eseguire la build (che genera automaticamente il client Prisma) e verificare pazienti/appuntamenti da PC e telefono.
7. Pubblicare su Vercel con HTTPS.
8. Configurare dominio, backup, accessi e policy di conservazione.

## Stato pre-pubblicazione

- Build e lint locali superati.
- `.env` e `.env.local` esclusi da Git.
- Database SQLite locale escluso da Git.
- Nessun repository remoto GitHub ancora collegato.
- Repository remoto configurato: `https://github.com/KonteMannoX/studio-di-psicologia.git`.
- Il primo commit e il push sono ancora da eseguire.
- Lo script `build` esegue prima `prisma generate`, necessario perché `src/generated/prisma` e esclusa da Git e viene ricreata durante il deploy Vercel.

## Variabili necessarie

Da impostare solo negli environment variables locali/Vercel, mai nel repository:

```text
DATABASE_URL
DIRECT_URL
AUTH_SECRET
STUDIO_LOGIN_EMAIL
STUDIO_PASSWORD_HASH
```

## Stato

Le variabili `DATABASE_URL` e `DIRECT_URL` sono state configurate in `.env.local`. Prisma CLI usa `DIRECT_URL`; l'app usa `DATABASE_URL`. Entrambe devono essere presenti anche nell'ambiente Vercel che verra pubblicato. Lo schema e stato applicato al progetto Supabase con `prisma db push`. L'API pazienti risponde correttamente dal database remoto. Le variabili di autenticazione da configurare su Vercel sono `AUTH_SECRET`, `STUDIO_LOGIN_EMAIL` e `STUDIO_PASSWORD_HASH`; l'hash della password e stato generato localmente e inserito su Vercel. Il prossimo passo e avviare il deploy. I dati presenti sono ancora dati di prova; non inserire dati reali durante questa fase.

## Nota sicurezza

La connection string e i segreti non devono essere condivisi in chat, commit o screenshot. Prima dell'uso professionale servono autenticazione piu robusta, backup, controllo accessi e valutazione GDPR.
