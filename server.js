const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mysql = require("mysql2");
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');


const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "himma_db",
  port: 3306
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use("/", express.static("./website"));

app.post('/submit', (req, res) => {
  const {firstName, lastName, workEmail, phoneNumber, companyName, role, brochure } = req.body;

  const sql = 'INSERT INTO brochures (firstName, lastName, workEmail, phoneNumber, companyName, role, brochureType) VALUES (?, ?, ?, ?, ?, ?, ?)';
  pool.query(sql, [firstName, lastName, workEmail, phoneNumber, companyName, role, brochure], (err, result) => {
      if (err) throw err;
      console.log('Data inserted:', result);

  });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});