const express = require("express");
const { body, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming requests
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, and images)
app.use("/", express.static(path.join(__dirname, "Website", "html")));
app.use("/css", express.static(path.join(__dirname, "Website", "css")));
app.use("/js", express.static(path.join(__dirname, "Website", "js")));
app.use("/assets", express.static(path.join(__dirname, "Website", "assets")));
app.use("/brochures", express.static(path.join(__dirname, "Website", "brochures")));

// MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "himma_db",
  port: 3306,
});

// Validation for brochure form
const validateBrochure = [
  body("firstName")
    .trim()
    .escape()
    .isLength({ min: 2, max: 25 })
    .withMessage("First name must be 2–25 letters."),
  body("lastName")
    .trim()
    .escape()
    .isLength({ min: 2, max: 25 })
    .withMessage("Last name must be 2–25 letters."),
  body("workEmail")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Enter a valid email address."),
  body("phoneNumber")
    .optional()
    .trim()
    .isLength({ min: 7, max: 15 })
    .isNumeric()
    .withMessage("Phone must be 7–15 digits."),
  body("companyName")
    .trim()
    .escape()
    .isAlphanumeric()
    .isLength({ min: 2, max: 50 })
    .withMessage("Company name must be 2–50 characters."),
  body("role").trim().escape().notEmpty().withMessage("Role is required."),
  body("brochure").notEmpty().withMessage("Brochure selection is required."),
];

// Handle brochure form submission
app.post("/submit", validateBrochure, (req, res) => {
  const {
    firstName,
    lastName,
    workEmail,
    phoneNumber,
    companyName,
    role,
    brochure,
  } = req.body;

  const insertSql =
    "INSERT INTO brochures (firstName, lastName, workEmail, phoneNumber, companyName, role, brochureType) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const insertParams = [
    firstName,
    lastName,
    workEmail,
    phoneNumber,
    companyName,
    role,
    brochure,
  ];

  pool.query(insertSql, insertParams, (err, result) => {
    if (err) {
      console.error("Brochure insert error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // retrieve firstName and lastName via SELECT
    const selectSql = "SELECT firstName, lastName FROM brochures WHERE id = ?";
    pool.query(selectSql, [result.insertId], (err2, rows) => {
      if (err2) {
        console.error("Brochure select error:", err2);
        return res.status(500).json({ message: "Database error" });
      }

      const { firstName: dbFirst, lastName: dbLast } = rows[0];
      const brochureUrl = `/brochures/${brochure}`;

      res.status(200).json({
        firstName: dbFirst,
        lastName: dbLast,
        brochureUrl,
      });
    });
  });
});

// Validation for contact us form
const validateContactUs = [
  body("ask").notEmpty().withMessage("Query type is required."),
  body("subject").notEmpty().withMessage("Subject is required."),
  body("message")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Message cannot be empty."),
  body("title").notEmpty().withMessage("Title is required."),
  body("firstName")
    .trim()
    .escape()
    .isLength({ min: 2, max: 25 })
    .withMessage("First name must be 2–25 letters."),
  body("lastName")
    .trim()
    .escape()
    .isLength({ min: 2, max: 25 })
    .withMessage("Last name must be 2–25 letters."),
  body("dob").notEmpty().withMessage("Date of birth is required."),
  body("gender").notEmpty().withMessage("Gender is required."),
  body("language").notEmpty().withMessage("Language is required."),
  body("country").notEmpty().withMessage("Country is required."),
  body("company")
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .matches(/^[A-Za-z0-9 ]{2,50}$/)
    .withMessage(
      "Company name must be 2–50 letters, numbers, or spaces."
    ),
  body("phone")
    .optional()
    .trim()
    .isLength({ min: 7, max: 15 })
    .isNumeric()
    .withMessage("Phone must be 7–15 digits."),
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Enter a valid email address."),
  body("notARobot").custom((value) => {
    if (value !== true && value !== "true") {
      throw new Error("Please confirm you're not a robot.");
    }
    return true;
  }),
];

// Handle contact us form submission
app.post("/submit-form", validateContactUs, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  const {
    ask,
    subject,
    message,
    title,
    firstName,
    lastName,
    dob,
    gender,
    language,
    country,
    company,
    email,
  } = req.body;
  const phone = req.body.phone || null;

  const insertSql =
    "INSERT INTO contact_us (ask, subject, message, title, firstName, lastName, dob, gender, language, country, company, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const insertParams = [
    ask,
    subject,
    message,
    title,
    firstName,
    lastName,
    dob,
    gender,
    language,
    country,
    company,
    phone,
    email,
  ];

  pool.query(insertSql, insertParams, (err, result) => {
    if (err) {
      console.error("Contact Us DB error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // retrieve email via SELECT
    const selectSql = "SELECT email FROM contact_us WHERE id = ?";
    pool.query(selectSql, [result.insertId], (err2, rows) => {
      if (err2) {
        console.error("Contact Us select error:", err2);
        return res.status(500).json({ message: "Database error" });
      }

      const { email: dbEmail } = rows[0];
      res.json({
        success: true,
        message: "Form submitted successfully!",
        email: dbEmail,
      });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});