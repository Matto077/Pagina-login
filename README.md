# Pagina-login


README – Sistema di Login & Registrazione
Descrizione

Questo progetto è un sistema di registrazione e login che funziona con MySQL e PostgreSQL.
Il programma è progettato per partire automaticamente su un altro PC utilizzando Docker, senza bisogno di configurazioni manuali complesse.

Il sistema invia anche email di attivazione per confermare gli account.

Requisiti

Docker e Docker Compose
 installati sul PC.

Connessione a Internet per scaricare le immagini Docker.

Email Gmail valida per l’invio delle email di attivazione (già configurata nel codice).

Installazione e avvio

Copia l’intera cartella del progetto sul nuovo computer.

Apri il terminale nella cartella del progetto.

Avvia tutti i servizi con Docker Compose:

docker-compose up -d


Questo comando farà partire:

Il server Node.js (app)

Il database MySQL (db_mysql)

Il database PostgreSQL (db_postgres)

Ngrok per creare un link accessibile dall’esterno (ngrok)

Dopo alcuni secondi, il server sarà attivo su http://localhost:3000 e i database saranno pronti.

Funzionamento

L’utente può registrarsi scegliendo il database (MySQL o Postgres).

Dopo la registrazione, viene inviata automaticamente un’email con il link di attivazione.

Una volta attivato l’account, l’utente può effettuare il login.

Tutto il processo funziona senza intervento manuale, grazie a Docker e alla configurazione dei servizi.

Struttura del progetto

index.html: interfaccia di registrazione e login.

script.js: logica front-end per gestire registrazione e login.

server.js: server Node.js che gestisce le richieste, le email e la connessione ai database.

docker-compose.yml: definizione dei servizi per l’avvio automatico su qualsiasi PC.

package.json & package-lock.json: dipendenze Node.js.

Avvio automatico su un altro PC

Basta eseguire docker-compose up -d e il progetto parte da solo.

Non è necessario modificare nulla nel codice o nei database.

Ngrok crea un link pubblico temporaneo per testare l’attivazione delle email da remoto.

Note importanti

Non modificare i file principali (server.js, docker-compose.yml) per evitare errori di avvio.

I dati dei database vengono salvati in volumi Docker (mysql_data e postgres_data) per non perderli al riavvio dei container.

Se il server non parte subito, attendere qualche secondo: MySQL e PostgreSQL potrebbero impiegare tempo a inizializzarsi.