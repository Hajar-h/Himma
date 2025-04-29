const express = require("express");
const { body, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;


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
app.use('/brochures', express.static(path.join(__dirname, 'website', 'brochures')));




//Backend validation
const validateBrochure = [
  body('firstName')
    .trim()
    .escape()
    .isString().isLength({ min: 2, max: 25 }).withMessage('First name must be 2–25 letters.'),
  
  body('lastName')
    .trim()
    .escape()
    .isString().isLength({ min: 2, max: 25 }).withMessage('Last name must be 2–25 letters.'),
  
  body('workEmail')
    .trim()
    .normalizeEmail()
    .isEmail().withMessage('Enter a valid email address.'),
  
  body('phoneNumber')
    .optional()
    .trim()
    .isLength({ min: 7, max: 15 })
    .isNumeric().withMessage('Phone must be 7–15 digits.'),
  
  body('companyName')
    .trim()
    .escape()
    .isAlphanumeric().isLength({ min: 2, max: 50 }).withMessage('Company name must be 2–50 characters.'),
  
  body('role')
    .trim()
    .escape()
    .notEmpty().withMessage('Role is required.'),
  
  body('brochure')
    .notEmpty().withMessage('Brochure selection is required.')
];





//handle form submission
app.post('/submit', validateBrochure, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, workEmail, phoneNumber, companyName, role, brochure } = req.body;

  const sql = 'INSERT INTO brochures (firstName, lastName, workEmail, phoneNumber, companyName, role, brochureType) VALUES (?, ?, ?, ?, ?, ?, ?)';
  pool.query(sql, [firstName, lastName, workEmail, phoneNumber, companyName, role, brochure], (err, result) => {


    if (err) throw err;
    console.log('Data inserted:', result);

    const brochureUrl = `/brochures/${brochure}`;
    res.status(200).json({
      firstName,
      lastName,
      brochureUrl  
    });
  });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});