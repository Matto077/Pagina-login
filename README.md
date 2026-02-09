# Pagina-login

## Breve descrizione
Il programma permette a un utente di registrare un account, loggarsi in esso e scegliere il tipo di atabase sui cui crearlo.

## Linguaggi utilizzati
- HTML
- JAVASCRIPT

## Repository
Il programma è scaricabile da qui: https://github.com/Matto077/Pagina-login.git

## Requisiti programma
Il programma per funzionare correttamente ha bisogno di:
- DOCKER e DOCKER COMPOSE (per costruire le immagini del programma).
- CONNESSIONE A INTERNET (per scaricare le immagini di docker).
- NGROk (per far si che l'email di attivazione funzioni su qualsiasi dispositivo).

NOTA: 
- Crea un file .env nella cartella del programma, all'interno mettici NGROK_AUTHTOKEN=tuo_authoken_NGROK.
- C'è un altro file chiamato docker-compose.yml, trova la voce NGROK_AUTHTOKEN: e sostituisci quello che c'è dopo i due punti con il tuo authoken di NGROK.

L'authtoken di NGROK si ottiene registrandosi al sito ufficiale di [NGROK](https://ngrok.com/), una volta registrato c'è un elenco a sinista, in alto alla lista 
ci sara una voce tuo authtoken, una volta cliccata ci sara una lunga parola non leggibile, premi l'occhio a destra del riquadro della parola e ti uscirà 
l'authtoken.

## Funzionalità
- Registrazione di account con nome, e-mail e password.
- Login con nome e password.
- Possibilità di cambiare database su cui ci si registra e su cui ci si logga.

## Come avviare il programma
- Apri sul terminale la cartella del progetto e digita il comando
```bash
docker compose up
```
poi premi invio, docker costruirà il container del programma e lo farà
partire (per verificare che stia effettivamente funzionando digitare "docker ps").
- Apri l'index.html del programma sul browser e funzionerà tutto.

Se vuoi fermare docker puoi farlo con questo comando:
```bash
sudo docker compose down -v
```
però i database si resetteranno e non saranno piu raggiungibili, quindi
dal programma non potrai più registrarti o loggarti. Per far ripartire tutto ridigita il comando "docker compose up".

## Autore
Mattia Grandi-Matto77