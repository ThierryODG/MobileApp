const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fachatbd'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected...');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.query(query, [email, password], (err, results) => {
    if (err) {
      res.status(500).send(err);
    }
    if (results.length > 0) {
      res.send({ success: true, user: results[0] });
    } else {
      res.send({ success: false, message: 'Invalid credentials' });
    }
  });
});

app.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  const query = `INSERT INTO users (email, password, name) VALUES (?, ?, ?)`;
  db.query(query, [email, password, name], (err, results) => {
    if (err) {
      res.status(500).send(err);
    }
    res.send({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
