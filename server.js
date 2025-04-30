const express = require("express");
const { body, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

//MySQL2 pool configuration
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


// Serve everything in /website at the web root:
app.use(express.static(path.join(__dirname, "website")));


app.use(
  "/assets",
  express.static(path.join(__dirname, "website", "assets"))
);
app.use(
  "/brochures",
  express.static(path.join(__dirname, "website", "brochures"))
);

//Brochure form back-end validation 
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
  body("role")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Role is required."),
  body("brochure")
    .notEmpty()
    .withMessage("Brochure selection is required.")
];

app.post("/submit", validateBrochure, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  const {
    firstName, lastName, workEmail, phoneNumber,  companyName,   role, brochure
  } = req.body;

  const sql =
    "INSERT INTO brochures (firstName, lastName, workEmail, phoneNumber, companyName, role, brochureType) VALUES (?, ?, ?, ?, ?, ?, ?)";
  pool.query(
    sql,
    [firstName, lastName, workEmail, phoneNumber, companyName, role, brochure],
    (err, result) => {
      if (err) {
        console.error("Brochure DB error:", err);
        return res.status(500).json({ success: false, message: "Database error!" });
      }
      console.log("Brochure data inserted:", result);

      const brochureUrl = `/brochures/${brochure}`;
      res.status(200).json({
        success: true,
        firstName,
        lastName,
        brochureUrl
      });
    }
  );
});

//Contact us form back-end validation 
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
    .withMessage("Company name must be 2–50 letters, numbers, and spaces only."),
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
  body("notARobot").custom(value => {
    if (value !== true && value !== "true") {
      throw new Error("Please confirm you're not a robot.");
    }
    return true;
  })
];

app.post("/submit-form", validateContactUs, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  const {
    ask, subject, message, title, firstName, lastName, dob, gender, language, country, company, email
  } = req.body;
  const phone = req.body.phone || null;

  const sql = `
    INSERT INTO contact_us
      (ask, subject, message, title,
       firstName, lastName, dob, gender, language, country,company, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `;
  const params = [ask, subject, message, title, firstName, lastName, 
    dob, gender, language, country, company, phone, email
  ];

  pool.query(sql, params, (err, result) => {
    if (err) {
      console.error("Contact Us DB error:", err);
      return res.status(500).json({ success: false, message: "Database error!" });
    }
    console.log("Contact Us data inserted:", result);
    res.json({ success: true, message: "Form submitted successfully!", email });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});