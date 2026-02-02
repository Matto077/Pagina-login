// ================= REGISTRAZIONE =================
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('pw').value;
  const dbType = document.getElementById('dbType').value;

  if (!username || !email || !password) {
    alert('Compila tutti i campi');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, dbType })
    });

    const data = await res.json();
    alert(data.message);
  } catch (err) {
    console.error(err);
    alert('Errore registrazione');
  }

  document.getElementById('username').value = '';
  document.getElementById('email').value = '';
  document.getElementById('pw').value = '';
});

// ================= LOGIN =================
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPw').value;
  const dbType = document.getElementById('loginDbType').value;

  if (!username || !password) {
    alert('Inserisci username e password');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, dbType })
    });

    const data = await res.json();
    alert(data.message);
  } catch (err) {
    console.error(err);
    alert('Errore login');
  }
});