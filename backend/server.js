// ================= SERVER =================
const express = require('express');
const mysql = require('mysql2');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// ================= EMAIL =================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mattiagrandi2009@gmail.com', 
    pass: 'cyuogitjsekvyfvt'
  }
});

// ================= MYSQL =================
const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'db_mysql',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'pass123',
  database: process.env.MYSQL_DATABASE || 'Mysql'
};

let db;
function connectMySQL() {
  db = mysql.createConnection(mysqlConfig);
  db.connect((err) => {
    if (err) {
      console.log("Errore connessione MySQL, riprovo tra 5 secondi:", err);
      setTimeout(connectMySQL, 5000); 
      return;
    }
    console.log("MySQL connesso");

    db.query(`
      CREATE TABLE IF NOT EXISTS utenti (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT false,
        activation_token VARCHAR(255)
      )
    `, (err) => {
      if (err) console.log("Errore creazione tabella MySQL:", err);
      else console.log("Tabella utenti MySQL pronta");
    });
  });
}

// ================= POSTGRES =================
const pgClient = new Client({
  host: process.env.POSTGRES_HOST || 'db_postgres',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'pass123',
  database: process.env.POSTGRES_DB || 'postgresdb',
  port: 5432
});

async function connectPostgres() {
  try {
    await pgClient.connect();
    console.log("Postgres connesso");

    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS utenti (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT false,
        activation_token VARCHAR(255)
      )
    `);
    console.log("Tabella utenti Postgres pronta");
  } catch (err) {
    console.log("Errore connessione Postgres, riprovo tra 5 secondi:", err);
    setTimeout(connectPostgres, 5000);
  }
}

// ================= REGISTRAZIONE =================
app.post('/register', async (req, res) => {
  const { username, email, password, dbType } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Inserisci tutti i campi" });
  }

  const token = uuidv4();

  const sendMail = async (userEmail, token) => {
    const link = `https://unnimble-nonserviceably-knox.ngrok-free.dev/activate/${token}`;
    try {
      await transporter.sendMail({
        from: 'mattiagrandi2009@gmail.com',
        to: userEmail,
        subject: 'Attiva il tuo account',
        html: `<a href="${link}">Clicca qui per attivare il tuo account</a>`
      });
      console.log('Email inviata a', userEmail);
    } catch (err) {
      console.log('Errore invio email:', err);
    }
  };

  if (dbType === 'mysql') {
    db.query(
      `INSERT INTO utenti(username,email,password,activation_token) VALUES (?,?,?,?)`,
      [username, email, password, token],
      async (err) => {
        if (err) {
          console.log("Errore inserimento MySQL:", err);
          return res.status(500).json({ message: "Errore DB MySQL" });
        }
        await sendMail(email, token);
        res.json({ message: 'Email di attivazione inviata' });
      }
    );
  } else if (dbType === 'postgres') {
    try {
      await pgClient.query(
        `INSERT INTO utenti(username,email,password,activation_token) VALUES($1,$2,$3,$4)`,
        [username, email, password, token]
      );
      await sendMail(email, token);
      res.json({ message: 'Email di attivazione inviata' });
    } catch (err) {
      console.log("Errore inserimento Postgres:", err);
      res.status(500).json({ message: "Errore DB Postgres" });
    }
  } else {
    res.status(400).json({ message: "DB non valido" });
  }
});

// ================= ATTIVAZIONE =================
app.get('/activate/:token', async (req, res) => {
  const token = req.params.token;

  db.query(
    `UPDATE utenti SET active=true, activation_token=NULL WHERE activation_token=?`,
    [token],
    (err, result) => {
      if (result && result.affectedRows > 0)
        return res.send('Account MySQL attivato!');
    }
  );

  try {
    const r = await pgClient.query(
      `UPDATE utenti SET active=true, activation_token=NULL WHERE activation_token=$1`,
      [token]
    );
    if (r.rowCount > 0) return res.send('Account Postgres attivato!');
  } catch (err) {
    console.log("Errore attivazione Postgres:", err);
  }

  res.send('Token non valido');
});

// ================= LOGIN =================
app.post('/login', (req, res) => {
  const { usernameOrEmail, password, dbType } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({ message: "Inserisci username/email e password" });
  }

  if (dbType === 'mysql') {
    db.query(
      `SELECT * FROM utenti WHERE (username=? OR email=?) AND password=? AND active=true`,
      [usernameOrEmail, usernameOrEmail, password],
      (err, r) => {
        if (err) {
          console.log("Errore login MySQL:", err);
          return res.status(500).json({ message: "Errore DB MySQL" });
        }
        if (r.length > 0) res.json({ message: 'Login OK (MySQL)' });
        else res.status(401).json({ message: 'Account non attivo o dati errati' });
      }
    );
  } else if (dbType === 'postgres') {
    pgClient.query(
      `SELECT * FROM utenti WHERE (username=$1 OR email=$1) AND password=$2 AND active=true`,
      [usernameOrEmail, password],
      (err, r) => {
        if (err) {
          console.log("Errore login Postgres:", err);
          return res.status(500).json({ message: "Errore DB Postgres" });
        }
        if (r.rows.length > 0) res.json({ message: 'Login OK (Postgres)' });
        else res.status(401).json({ message: 'Account non attivo o dati errati' });
      }
    );
  } else {
    res.status(400).json({ message: "DB non valido" });
  }
});

// ================= START =================
(async () => {
  await connectMySQL();
  await connectPostgres();
  app.listen(PORT, () => {
    console.log(`Server attivo su http://localhost:${PORT}`);
  });
})();