const express = require("express");
const router = express.Router();
const db = require("../db/database.js");
const multer = require("multer");
const path = require("path");

const nodemailer = require("nodemailer");
const crypto = require("crypto");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    // Construct the file name and save only the file name, not the path
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({storage: storage});

const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Assuming the token is sent as a Bearer token
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add the user info to the request object
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
const bcrypt = require("bcrypt");
require("dotenv").config();
router.post("/login", async (req, res) => {
  const {email, password, rememberMe} = req.body;

  const query = "SELECT * FROM uzytkownik WHERE email = ?";
  const values = [email];
  db.query(query, values, (err, results) => {
    if (err) {
      console.error(err); // Log the error for server monitoring
      return res.status(500).json({error: "Error on the server."});
    }

    const user = results[0];
    if (!user || !bcrypt.compareSync(password, user.haslo)) {
      return res.status(401).json({error: "Invalid email or password."});
    }

    const expiresIn = rememberMe ? "7d" : "1h";
    const token = jwt.sign({userId: user.uzytkownik_id, email: user.email}, process.env.JWT_SECRET, {expiresIn});

    res.json({token});
  });
});
router.get("/check-email", (req, res) => {
  const emailToCheck = req.query.email;

  if (!emailToCheck) {
    return res.status(400).json({error: "Email parameter is required"});
  }

  const query = "SELECT COUNT(*) AS count FROM uzytkownik WHERE email = ?";
  const values = [emailToCheck];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error(err); // Log the error for server monitoring
      return res.status(500).json({error: "Database error"});
    }

    // If count is greater than 0, the email exists in the database
    const emailExists = results[0].count > 0;
    res.json({exists: emailExists});
  });
});

const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
router.post("/forgot", (req, res) => {
  const {email} = req.body;
  const token = crypto.randomBytes(20).toString("hex");

  const query = "SELECT * FROM uzytkownik WHERE email = ?";
  db.query(query, [email], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({message: "Internal server error during database query."});
      return;
    }

    if (result.length === 0) {
      res.status(400).json({message: "The email address is not associated with any account."});
      return;
    }

    const user = result[0];
    const updateQuery = `
      UPDATE uzytkownik
      SET reset_password_token = ?, reset_password_expires = ?
      WHERE uzytkownik_id = ?`;

    const expires = Date.now() + 3600000;
    const expiresDate = new Date(expires);

    db.query(updateQuery, [token, expiresDate, user.uzytkownik_id], (updateErr) => {
      if (updateErr) {
        console.error("Database update error:", updateErr);
        res.status(500).json({message: "Internal server error during database update."});
        return;
      }

      const resetUrl = `http://localhost:5173/reset-password/${token}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset Link",
        text: `You are receiving this because you have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      transporter.sendMail(mailOptions, (mailErr, info) => {
        if (mailErr) {
          console.error("Mail sending error:", mailErr);
          res.status(500).json({message: "Unable to send reset email."});
        } else {
          res.status(200).json({message: "A reset email has been sent to " + user.email + "."});
        }
      });
    });
  });
});

router.post("/reset-password", async (req, res) => {
  try {
    const {token, newPassword} = req.body;

    // Validate input (optional, but recommended)
    if (!token || !newPassword) {
      return res.status(400).json({message: "Missing token or new password."});
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const query = "UPDATE uzytkownik SET haslo = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE reset_password_token = ?";
    db.query(query, [hashedPassword, token], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({message: "Internal server error during database operation."});
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({message: "User not found or token invalid."});
      }

      res.status(200).json({message: "Password successfully updated."});
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({message: "Unexpected server error."});
  }
});

router.post("/register", (req, res) => {
  const {email, haslo, imie, nazwisko} = req.body;
  const hash = bcrypt.hashSync(haslo, 10);

  db.beginTransaction((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error starting transaction");
      return;
    }

    const queryUzytkownik = `
      INSERT INTO uzytkownik (imie, nazwisko, email, haslo)
      VALUES (?, ?, ?, ?);
    `;
    db.query(queryUzytkownik, [imie, nazwisko, email, hash], (err, resultUzytkownik) => {
      if (err) {
        db.rollback(() => {
          console.error(err);
          res.status(500).send("Error inserting into 'uzytkownik'");
          return;
        });
      }
      const uzytkownikId = resultUzytkownik.insertId;
      const queryDane = `
        INSERT INTO dane (email, uzytkownik_id)
        VALUES (?, ?);
      `;
      db.query(queryDane, [email, uzytkownikId], (err, resultDane) => {
        if (err) {
          db.rollback(() => {
            console.error(err);
            res.status(500).send("Error inserting into 'dane'");
            return;
          });
        }

        const daneId = resultDane.insertId;
        const updateUzytkownik = `
          UPDATE uzytkownik SET dane_id = ? WHERE uzytkownik_id = ?;
        `;
        db.query(updateUzytkownik, [daneId, uzytkownikId], (err) => {
          if (err) {
            db.rollback(() => {
              console.error(err);
              res.status(500).send("Error updating 'uzytkownik'");
              return;
            });
          }

          const queryOperatorzy = `
            INSERT INTO operatorzy (imie, nazwisko, stanowisko, dane_id, uzytkownik_id)
            VALUES (?, ?, ?, ?, ?);
          `;
          db.query(queryOperatorzy, [imie, nazwisko, "Właściciel", daneId, uzytkownikId], (err, resultOperatorzy) => {
            if (err) {
              db.rollback(() => {
                console.error(err);
                res.status(500).send("Error inserting into 'operatorzy'");
                return;
              });
            }

            db.commit((err) => {
              if (err) {
                db.rollback(() => {
                  console.error(err);
                  res.status(500).send("Error committing transaction");
                  return;
                });
              }

              res.status(201).json({
                operatorId: resultOperatorzy.insertId,
                daneId: daneId,
                uzytkownikId: uzytkownikId,
              });
            });
          });
        });
      });
    });
  });
});

router.delete("/pola/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;

  const query = "DELETE FROM dzialki WHERE dzialka_id = ? AND uzytkownik_id = ?";
  const values = [id, user];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error deleting the record");
      return;
    }
    res.status(200).send({message: "Record deleted successfully", id});
  });
});
router.put("/pola/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;
  const {nazwa, obreb, numer_ewidencyjny, area, polygon, uzytkownik_id} = req.body;

  const query = `
    UPDATE dzialki 
    SET nazwa = ?, obreb = ?, numer_ewidencyjny = ?, area = ?, polygon = ?, uzytkownik_id = ?
    WHERE dzialka_id = ? AND uzytkownik_id = ?
  `;
  const values = [nazwa, obreb, numer_ewidencyjny, area, polygon, uzytkownik_id, id, user];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error updating the record");
      return;
    }
    res.status(200).send({message: "Record updated successfully", id});
  });
});
router.post("/pola", authenticate, (req, res) => {
  const user = req.user.userId;
  const {nazwa, obreb, numer_ewidencyjny, area, polygon} = req.body;

  const query = "INSERT INTO dzialki (nazwa,obreb,numer_ewidencyjny,area,polygon,uzytkownik_id) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [nazwa, obreb, numer_ewidencyjny, area, polygon, user];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error saving the 'pole'");
      console.error(err);
      return;
    }
    res.status(201).json({id: result.insertId, ...req.body});
  });
});
router.get("/pola", authenticate, (req, res) => {
  const user = req.user.userId;
  const query = "SELECT d.*, u.uprawa FROM dzialki d LEFT JOIN uprawa u ON d.numer_ewidencyjny = u.numer_ewidencyjny WHERE d.uzytkownik_id=?";
  const values = [user];
  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});
router.get("/pola/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;

  const query = "SELECT * FROM dzialki WHERE dzialka_id = ? AND uzytkownik_id = ?";
  const values = [id, user];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.get("/polygons", authenticate, (req, res) => {
  const user = req.user.userId;

  const query = "SELECT polygon,numer_ewidencyjny FROM dzialki WHERE polygon IS NOT NULL AND uzytkownik_id = ?";
  const values = [user];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.get("/poly-uprawy", authenticate, (req, res) => {
  const user = req.user.userId;

  const query = "SELECT polygon FROM uprawa WHERE polygon IS NOT NULL AND uzytkownik_id = ?";
  const values = [user];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.get("/uprawy", authenticate, (req, res) => {
  const user = req.user.userId;
  const query = "SELECT * FROM uprawa WHERE uzytkownik_id = ?";
  const values = [user];
  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.get("/area", authenticate, (req, res) => {
  const user = req.user.userId;
  const query = "SELECT numer_ewidencyjny,area,polygon FROM dzialki WHERE uzytkownik_id = ?";
  const values = [user];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.post("/uprawy", authenticate, (req, res) => {
  const user = req.user.userId;
  const {numer_ewidencyjny, uprawa, powierzchnia_dzialki, powierzchnia_uprawy, polygon} = req.body;

  const query = "INSERT INTO uprawa (numer_ewidencyjny, uprawa, powierzchnia_dzialki, powierzchnia_uprawy, polygon,uzytkownik_id) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [numer_ewidencyjny, uprawa, powierzchnia_dzialki, powierzchnia_uprawy, polygon, user];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error saving the 'uprawa'");
      console.error(err);
      return;
    }
    res.status(201).json({id: result.insertId, ...req.body});
  });
});

router.delete("/uprawy/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;

  const query = "DELETE FROM uprawa WHERE uprawa_id = ? AND uzytkownik_id = ?";
  const values = [id, user];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error deleting the record");
      return;
    }
    res.status(200).send({message: "Record deleted successfully", id});
  });
});

router.put("/uprawy/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;
  const {numer_ewidencyjny, uprawa, powierzchnia_dzialki, powierzchnia_uprawy, polygon, uzytkownik_id} = req.body;

  const query = `
    UPDATE uprawa
    SET numer_ewidencyjny = ?, uprawa = ?, powierzchnia_dzialki = ?, powierzchnia_uprawy = ?,polygon = ?, uzytkownik_id = ?
    WHERE uprawa_id = ? AND uzytkownik_id = ?
  `;
  const values = [numer_ewidencyjny, uprawa, powierzchnia_dzialki, powierzchnia_uprawy, polygon, uzytkownik_id, id, user];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error updating the record");
      return;
    }
    res.status(200).send({message: "Record updated successfully", id});
  });
});

router.get("/uprawy/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;

  const query = "SELECT * FROM uprawa WHERE uprawa_id = ? AND uzytkownik_id = ?";
  const values = [id, user];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.get("/prace", authenticate, (req, res) => {
  const user = req.user.userId;
  const query = "SELECT * FROM postep_prac WHERE uzytkownik_id = ?";
  const values = [user];
  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.get("/operator", authenticate, (req, res) => {
  const user = req.user.userId;
  const query = "SELECT imie,nazwisko FROM operatorzy WHERE uzytkownik_id = ?";
  const values = [user];
  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.post("/prace", authenticate, (req, res) => {
  const user = req.user.userId;
  const {numer_ewidencyjny, praca, powierzchnia_dzialki, powierzchnia_pracy, polygon, data, operator} = req.body;

  const query =
    "INSERT INTO postep_prac (numer_ewidencyjny, praca, powierzchnia_dzialki, powierzchnia_pracy, polygon,data,operator,uzytkownik_id) VALUES (?, ?, ?, ?, ?,?,?,?)";
  const values = [numer_ewidencyjny, praca, powierzchnia_dzialki, powierzchnia_pracy, polygon, data, operator, user];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error saving the 'praca'");
      console.error(err);
      return;
    }
    res.status(201).json({id: result.insertId, ...req.body});
  });
});

router.delete("/prace/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;

  const query = "DELETE FROM postep_prac WHERE postep_prac_id = ? AND uzytkownik_id = ?";
  const values = [id, user];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error deleting the record");
      return;
    }
    res.status(200).send({message: "Record deleted successfully", id});
  });
});

router.get("/poly-prace/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;
  const query = "SELECT polygon FROM postep_prac WHERE postep_prac_id = ? AND uzytkownik_id = ?";
  const values = [id, user];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});
router.get("/poly-prace", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;
  const query = "SELECT polygon FROM postep_prac WHERE polygon IS NOT NULL AND uzytkownik_id = ?";
  const values = [id, user];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});
router.get("/maszyny", authenticate, (req, res) => {
  const user = req.user.userId;
  const query = "SELECT * FROM maszyny WHERE uzytkownik_id = ?";
  const values = [user];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.post("/maszyny", authenticate, upload.single("image"), (req, res) => {
  const user = req.user.userId;
  const {nazwa, rodzaj_maszyny, operator, rok_produkcji, szerokosc_robocza, masa, moc, data_przegladu, data_ubezpieczenia, ustawienia} = req.body;

  const img = req.file ? req.file.filename : null; // Save only the filename

  const query = `
    INSERT INTO maszyny (
      nazwa, rodzaj_maszyny, operator, rok_produkcji, szerokosc_robocza,
      masa, moc, data_przegladu, data_ubezpieczenia, ustawienia, img, uzytkownik_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [nazwa, rodzaj_maszyny, operator, rok_produkcji, szerokosc_robocza, masa, moc, data_przegladu, data_ubezpieczenia, ustawienia, img, user];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error saving the machine");
      return;
    }
    // Send back the ID of the new machine, along with the body data and the path of the uploaded image
    res.status(201).json({id: result.insertId, ...req.body, img});
  });
});

router.put("/maszyny/:id", authenticate, upload.single("image"), (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;
  const {nazwa, rodzaj_maszyny, operator, rok_produkcji, szerokosc_robocza, masa, moc, data_przegladu, data_ubezpieczenia, ustawienia} = req.body;

  let img;
  if (req.file) {
    const filename = req.file.filename; // This is just the filename part
    img = `/${filename}`; // This is the path you'll use in the <img> tag in your front end
  }

  const query = `
    UPDATE maszyny SET
      nazwa = ?, rodzaj_maszyny = ?, operator = ?, rok_produkcji = ?, szerokosc_robocza = ?,
      masa = ?, moc = ?, data_przegladu = ?, data_ubezpieczenia = ?, ustawienia = ?,
      img = COALESCE(?, img) WHERE maszyna_id = ? AND uzytkownik_id = ?
  `;
  const values = [nazwa, rodzaj_maszyny, operator, rok_produkcji, szerokosc_robocza, masa, moc, data_przegladu, data_ubezpieczenia, ustawienia, img, id, user];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error updating the machine");
      return;
    }
    res.status(200).json({message: "Machine updated successfully", id, img});
  });
});

router.delete("/maszyny/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;

  const query = "DELETE FROM maszyny WHERE maszyna_id = ? AND uzytkownik_id = ?";
  const values = [id, user];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error deleting the record");
      return;
    }
    res.status(200).send({message: "Record deleted successfully", id});
  });
});

router.get("/operatorzy", authenticate, (req, res) => {
  const user = req.user.userId;
  const query =
    "SELECT o.operator_id,o.imie,o.nazwisko,o.stanowisko,o.jednostka_rozliczeniowa,o.kwota_za_jednostke,o.img,o.uzytkownik_id,o.dane_id,d.ulica,d.numer_domu,d.kod_pocztowy,d.miejscowosc,d.kraj,d.wojewodztwo,d.email,d.telefon FROM operatorzy o JOIN dane d ON o.dane_id = d.dane_id WHERE o.uzytkownik_id = ? AND d.uzytkownik_id = ?";
  const values = [user, user];
  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});
router.post("/operatorzy", authenticate, upload.single("image"), (req, res) => {
  // Extract fields for the 'dane' table
  const user = req.user.userId;
  const {ulica, numer_domu, kod_pocztowy, miejscowosc, kraj, wojewodztwo, email, telefon} = req.body;

  // Start transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error starting transaction");
      return;
    }

    // Insert into 'dane' table
    const queryDane = `
      INSERT INTO dane (ulica, numer_domu, kod_pocztowy, miejscowosc, kraj, wojewodztwo, email, telefon, uzytkownik_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
    `;
    const valuesDane = [ulica, numer_domu, kod_pocztowy, miejscowosc, kraj, wojewodztwo, email, telefon, user];

    db.query(queryDane, valuesDane, (err, resultDane) => {
      if (err) {
        db.rollback(() => {
          console.error(err);
          res.status(500).send("Error inserting into 'dane'");
        });
        return;
      }

      const daneId = resultDane.insertId;

      // Extract fields for the 'operatorzy' table
      const {imie, nazwisko, stanowisko, jednostka_rozliczeniowa, kwota_za_jednostke} = req.body; // Add other fields from 'operatorzy' as needed
      const img = req.file ? req.file.filename : null; // Save only the filename

      // Insert into 'operatorzy' table
      const queryOperatorzy = `
        INSERT INTO operatorzy (imie, nazwisko, stanowisko, jednostka_rozliczeniowa,kwota_za_jednostke, dane_id, img, uzytkownik_id)
        VALUES (?, ?, ?, ?, ?,?,?,?)
      `;
      const valuesOperatorzy = [imie, nazwisko, stanowisko, jednostka_rozliczeniowa, kwota_za_jednostke, daneId, img, user];

      db.query(queryOperatorzy, valuesOperatorzy, (err, resultOperatorzy) => {
        if (err) {
          db.rollback(() => {
            console.error(err);
            res.status(500).send("Error inserting into 'operatorzy'");
          });
          return;
        }

        // If everything is successful, commit the transaction
        db.commit((err) => {
          if (err) {
            db.rollback(() => {
              console.error(err);
              res.status(500).send("Error committing transaction");
            });
            return;
          }

          // Send back the ID of the new operator and dane entry
          res.status(201).json({
            operatorId: resultOperatorzy.insertId,
            daneId: daneId,
            ...req.body,
            img,
          });
        });
      });
    });
  });
});
router.put("/operatorzy/:operatorId", authenticate, upload.single("image"), (req, res) => {
  const user = req.user.userId;
  const {operatorId} = req.params; // ID of the operatorzy to update
  const {
    // Fields for the 'dane' table
    ulica,
    numer_domu,
    kod_pocztowy,
    miejscowosc,
    kraj,
    wojewodztwo,
    email,
    telefon,
    // Fields for the 'operatorzy' table
    imie,
    nazwisko,
    stanowisko, // Add other fields from 'operatorzy' as needed
    jednostka_rozliczeniowa,
    kwota_za_jednostke,
    dane_id, // This should be provided in the body to know which 'dane' record to update
  } = req.body;

  let img;
  if (req.file) {
    const filename = req.file.filename; // This is just the filename part
    img = `/${filename}`; // This is the path you'll use in the <img> tag in your front end
  }

  // Start transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error starting transaction");
      return;
    }

    // Update 'dane' table
    const queryDane = `
      UPDATE dane
      SET ulica = ?, numer_domu = ?, kod_pocztowy = ?, miejscowosc = ?, kraj = ?, wojewodztwo = ?, email = ?, telefon = ?
      WHERE dane_id = ? AND uzytkownik_id = ?
    `;
    const valuesDane = [ulica, numer_domu, kod_pocztowy, miejscowosc, kraj, wojewodztwo, email, telefon, dane_id, user];

    db.query(queryDane, valuesDane, (err, resultDane) => {
      if (err) {
        db.rollback(() => {
          console.error(err);
          res.status(500).send("Error updating 'dane'");
        });
        return;
      }

      // Update 'operatorzy' table
      const queryOperatorzy = `
        UPDATE operatorzy
        SET imie = ?, nazwisko = ?, stanowisko = ? ,jednostka_rozliczeniowa = ?, kwota_za_jednostke = ?, img = COALESCE(?, img) 
        WHERE operator_id = ? AND uzytkownik_id = ?
      `;
      const valuesOperatorzy = [imie, nazwisko, stanowisko, jednostka_rozliczeniowa, kwota_za_jednostke, img, operatorId, user];

      db.query(queryOperatorzy, valuesOperatorzy, (err, resultOperatorzy) => {
        if (err) {
          db.rollback(() => {
            console.error(err);
            res.status(500).send("Error updating 'operatorzy'");
          });
          return;
        }

        // If everything is successful, commit the transaction
        db.commit((err) => {
          if (err) {
            db.rollback(() => {
              console.error(err);
              res.status(500).send("Error committing transaction");
            });
            return;
          }

          // Send back the ID of the updated operator and dane entry
          res.status(200).json({
            operatorId: operatorId,
            daneId: dane_id,
            ...req.body,
            img: img ? img : req.body.img, // If a new image was not uploaded, keep the old one
          });
        });
      });
    });
  });
});

router.delete("/operatorzy/:operatorId", authenticate, (req, res) => {
  const user = req.user.userId;
  const {operatorId} = req.params;

  // Start transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error starting transaction");
      return;
    }

    // Delete 'operatorzy' record
    const queryOperatorzy = "DELETE FROM operatorzy WHERE operator_id = ? AND uzytkownik_id = ?";
    const valuesOperatorzy = [operatorId, user];
    db.query(queryOperatorzy, valuesOperatorzy, (err, resultOperatorzy) => {
      if (err) {
        db.rollback(() => {
          console.error(err);
          res.status(500).send("Error deleting 'operatorzy' record");
        });
        return;
      }

      if (resultOperatorzy.affectedRows === 0) {
        db.rollback(() => {
          res.status(404).send("No 'operatorzy' record found with the given ID");
        });
        return;
      }

      // Get the 'dane_id' of the deleted 'operatorzy' record
      const daneId = req.body.dane_id;

      // Delete 'dane' record
      const queryDane = "DELETE FROM dane WHERE dane_id = ? AND uzytkownik_id = ?";
      const valuesDane = [daneId, user];
      db.query(queryDane, valuesDane, (err, resultDane) => {
        if (err) {
          db.rollback(() => {
            console.error(err);
            res.status(500).send("Error deleting 'dane' record");
          });
          return;
        }

        // If everything is successful, commit the transaction
        db.commit((err) => {
          if (err) {
            db.rollback(() => {
              console.error(err);
              res.status(500).send("Error committing transaction");
            });
            return;
          }

          res.status(200).send("Operator and related data successfully deleted");
        });
      });
    });
  });
});

router.get("/srodki", authenticate, (req, res) => {
  const user = req.user.userId;
  const query = "SELECT * FROM stan_magazynowy WHERE uzytkownik_id = ? AND typ = 'Środki ochrony roślin'";
  const values = [user];
  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});
router.get("/nawozy", authenticate, (req, res) => {
  const user = req.user.userId;
  const query = "SELECT * FROM stan_magazynowy WHERE uzytkownik_id = ? AND typ = 'Nawozy'";
  const values = [user];
  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});
router.get("/rosliny", authenticate, (req, res) => {
  const user = req.user.userId;
  const query = "SELECT * FROM stan_magazynowy WHERE uzytkownik_id = ? AND typ = 'Rośliny i odmiany'";
  const values = [user];
  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});
router.post("/magazyn", authenticate, (req, res) => {
  const user = req.user.userId;
  const {nazwa, typ, data_zakupu, cena_netto, cena_brutto, ilosc, jednostka_magazynowa, zalecana_dawka} = req.body;
  const wartosc = cena_netto * ilosc;

  const query =
    "INSERT INTO stan_magazynowy (nazwa,typ,data_zakupu,cena_netto,cena_brutto,ilosc,jednostka_magazynowa,wartosc,zalecana_dawka,uzytkownik_id) VALUES (?, ?, ?, ?, ?,?,?,?,?,?)";
  const values = [nazwa, typ, data_zakupu, cena_netto, cena_brutto, ilosc, jednostka_magazynowa, wartosc, zalecana_dawka, user];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error saving the 'magazyn'");
      console.error(err);
      return;
    }
    res.status(201).json({id: result.insertId, ...req.body});
  });
});

router.delete("/magazyn/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;

  const query = "DELETE FROM stan_magazynowy WHERE magazyn_id = ? AND uzytkownik_id = ?";
  const values = [id, user];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error deleting the record");
      return;
    }
    res.status(200).send({message: "Record deleted successfully", id});
  });
});

router.put("/magazyn/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;
  const {nazwa, typ, data_zakupu, cena_netto, cena_brutto, ilosc, jednostka_magazynowa, zalecana_dawka, uzytkownik_id} = req.body;
  const wartosc = cena_netto * ilosc;

  const query = `
    UPDATE stan_magazynowy 
    SET nazwa = ?, typ = ?, data_zakupu = ?, cena_netto = ?, cena_brutto = ?, ilosc = ?, jednostka_magazynowa = ?, wartosc = ?, zalecana_dawka = ?, uzytkownik_id = ?
    WHERE magazyn_id = ? AND uzytkownik_id = ?
  `;
  const values = [nazwa, typ, data_zakupu, cena_netto, cena_brutto, ilosc, jednostka_magazynowa, wartosc, zalecana_dawka, uzytkownik_id, id, user];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error updating the record");
      return;
    }
    res.status(200).send({message: "Record updated successfully", id});
  });
});

router.get("/magazyn/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;

  const query = "SELECT * FROM stan_magazynowy WHERE magazyn_id = ? AND uzytkownik_id = ?";
  const values = [id, user];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.get("/zbiory", authenticate, (req, res) => {
  const user = req.user.userId;
  const query = "SELECT * FROM zbiory WHERE uzytkownik_id = ?";
  const values = [user];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.delete("/zbiory/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;

  const query = "DELETE FROM zbiory WHERE zbiory_id = ? AND uzytkownik_id = ?";
  const values = [id, user];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error deleting the record");
      return;
    }
    res.status(200).send({message: "Record deleted successfully", id});
  });
});
router.get("/zbiory/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;

  const query = "SELECT * FROM zbiory WHERE zbiory_id = ? AND uzytkownik_id = ?";
  const values = [id, user];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.post("/zbiory", authenticate, (req, res) => {
  const user = req.user.userId;
  const {kwit_wagowy, data_sprzedazy, wilgotnosc, masa, cena_bazowa} = req.body;
  let result;
  if (wilgotnosc > 35) {
    result = (wilgotnosc - 30) * 15;
  } else {
    result = (wilgotnosc - 30) * 10;
  }
  const cena = cena_bazowa - result;
  const wartosc = (cena * masa) / 1000;

  const query = "INSERT INTO zbiory (kwit_wagowy, data_sprzedazy, wilgotnosc, masa, cena_bazowa, cena, wartosc,uzytkownik_id) VALUES (?, ?, ?, ?, ?, ?, ?,?)";
  const values = [kwit_wagowy, data_sprzedazy, wilgotnosc, masa, cena_bazowa, cena, wartosc, user];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error saving the 'zbiory'");
      console.error(err);
      return;
    }
    res.status(201).json({id: result.insertId, ...req.body});
  });
});

router.put("/zbiory/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;
  const {kwit_wagowy, data_sprzedazy, wilgotnosc, masa, cena_bazowa, uzytkownik_id} = req.body;
  let result;
  if (wilgotnosc > 35) {
    result = (wilgotnosc - 30) * 15;
  } else {
    result = (wilgotnosc - 30) * 10;
  }
  const cena = cena_bazowa - result;
  const wartosc = (cena * masa) / 1000;

  const query = `
    UPDATE zbiory 
    SET kwit_wagowy = ?, data_sprzedazy = ?, wilgotnosc = ?, masa = ?, cena_bazowa = ?, cena = ?, wartosc = ?, uzytkownik_id = ?
    WHERE zbiory_id = ? AND uzytkownik_id = ?
  `;
  const values = [kwit_wagowy, data_sprzedazy, wilgotnosc, masa, cena_bazowa, cena, wartosc, uzytkownik_id, id, user];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error updating the record");
      return;
    }
    res.status(200).send({message: "Record updated successfully", id});
  });
});

router.get("/finanse", authenticate, (req, res) => {
  const user = req.user.userId;
  const query = "SELECT * FROM finanse WHERE uzytkownik_id = ?";
  const values = [user];
  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.delete("/finanse/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;

  const query = "DELETE FROM finanse WHERE dokument_id = ? AND uzytkownik_id = ?";
  const values = [id, user];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error deleting the record");
      return;
    }
    res.status(200).send({message: "Record deleted successfully", id});
  });
});

router.post("/finanse", authenticate, (req, res) => {
  const user = req.user.userId;
  const {nazwa, rodzaj_dokumentu, opis, wartosc, data} = req.body;

  const query = "INSERT INTO finanse (nazwa,rodzaj_dokumentu,opis,wartosc,data,uzytkownik_id) VALUES (?, ?, ?, ?,?,?)";
  const values = [nazwa, rodzaj_dokumentu, opis, wartosc, data, user];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error saving the 'magazyn'");
      console.error(err);
      return;
    }
    res.status(201).json({id: result.insertId, ...req.body});
  });
});

router.put("/finanse/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;
  const {nazwa, rodzaj_dokumentu, opis, wartosc, data} = req.body;

  const query = `
    UPDATE finanse
    SET nazwa = ?, rodzaj_dokumentu = ?, opis = ?, wartosc = ?, data = ?
    WHERE dokument_id = ? AND uzytkownik_id = ?
  `;
  const values = [nazwa, rodzaj_dokumentu, opis, wartosc, data, id, user];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error updating the record");
      return;
    }
    res.status(200).send({message: "Record updated successfully", id});
  });
});

router.get("/finanse/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;

  const query = "SELECT * FROM finanse WHERE dokument_id = ? AND uzytkownik_id = ?";
  const values = [id, user];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.post("/kalendarz", authenticate, (req, res) => {
  const user = req.user.userId;
  const {title, start, end, numer_ewidencyjny, operator, opis} = req.body;

  const query = "INSERT INTO kalendarz (title, start, end, numer_ewidencyjny, operator, opis,uzytkownik_id) VALUES (?, ?, ?, ?,?,?,?)";
  const values = [title, start, end, numer_ewidencyjny, operator, opis, user];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error saving the 'kalendarz'");
      console.error(err);
      return;
    }
    res.status(201).json({id: result.insertId, ...req.body});
  });
});

router.get("/kalendarz", authenticate, (req, res) => {
  const user = req.user.userId;
  const query = "SELECT * FROM kalendarz WHERE uzytkownik_id = ?";
  const values = [user];
  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.delete("/kalendarz/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;

  const query = "DELETE FROM kalendarz WHERE kalendarz_id = ? AND uzytkownik_id = ?";
  const values = [id, user];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error deleting the record");
      return;
    }
    res.status(200).send({message: "Record deleted successfully", id});
  });
});
router.get("/kalendarz/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;

  const query = "SELECT * FROM kalendarz WHERE kalendarz_id = ? AND uzytkownik_id = ?";
  const values = [id, user];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.put("/kalendarz/:id", authenticate, (req, res) => {
  const user = req.user.userId;
  const {id} = req.params;
  const {title, start, end, numer_ewidencyjny, operator, opis} = req.body;

  const query = `
    UPDATE kalendarz
    SET title = ?, start = ?, end = ?, numer_ewidencyjny = ?, operator = ?, opis = ?, uzytkownik_id = ?
    WHERE kalendarz_id = ? AND uzytkownik_id = ?
  `;
  const values = [title, start, end, numer_ewidencyjny, operator, opis, user, id, user];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating the record:", err);
      res.status(500).json({
        message: "Error updating the record",
        error: err.message,
      });
      return;
    }
    res.status(200).json({
      message: "Record updated successfully",
      id,
    });
  });
});

router.get("/uzytkownik", authenticate, (req, res) => {
  const user = req.user.userId;
  const query =
    "SELECT u.uzytkownik_id,u.imie,u.nazwisko,u.email,u.haslo,u.dane_id,d.ulica,d.numer_domu,d.kod_pocztowy,d.miejscowosc,d.kraj,d.wojewodztwo,d.telefon,o.img FROM uzytkownik u JOIN dane d ON u.dane_id = d.dane_id JOIN operatorzy o ON u.uzytkownik_id=o.uzytkownik_id AND u.imie=o.imie AND u.nazwisko=o.nazwisko WHERE o.stanowisko='Właściciel' AND u.uzytkownik_id = ? AND d.uzytkownik_id = ? AND o.uzytkownik_id = ?";
  const values = [user, user, user];
  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.put("/uzytkownik/:uzytkownikId", authenticate, upload.single("image"), async (req, res) => {
  try {
    const user = req.user.userId;
    const {uzytkownikId} = req.params;
    const {ulica, numer_domu, kod_pocztowy, miejscowosc, kraj, wojewodztwo, telefon, imie, nazwisko, email, haslo, dane_id} = req.body;

    let imgPath = null;
    if (req.file) {
      const filename = req.file.filename;
      imgPath = `/${filename}`; // Construct the path for the image
    }

    // Start transaction
    await db.beginTransaction();

    // Update 'dane' table
    const queryDane = `
      UPDATE dane
      SET ulica = ?, numer_domu = ?, kod_pocztowy = ?, miejscowosc = ?, kraj = ?, wojewodztwo = ?, email = ?, telefon = ?
      WHERE dane_id = ? AND uzytkownik_id = ?
    `;
    const valuesDane = [ulica, numer_domu, kod_pocztowy, miejscowosc, kraj, wojewodztwo, email, telefon, dane_id, user];
    await db.query(queryDane, valuesDane);

    // Hash password
    const hashedPassword = await bcrypt.hash(haslo, 10);

    // Update 'uzytkownik' table
    const queryUzytkownik = `
      UPDATE uzytkownik
      SET imie = ?, nazwisko = ?, email = ?, haslo = ?
      WHERE uzytkownik_id = ?
    `;
    const valuesUzytkownik = [imie, nazwisko, email, hashedPassword, user];
    await db.query(queryUzytkownik, valuesUzytkownik);

    // Update 'operatorzy' table with the new image path if available
    if (imgPath) {
      const queryOperatorzy = `
         UPDATE operatorzy
          SET imie=?,nazwisko=?,img = COALESCE(?, img)
          WHERE uzytkownik_id = ? AND stanowisko='Właściciel'
      `;
      await db.query(queryOperatorzy, [imie, nazwisko, imgPath, user]);
    }

    // Commit the transaction
    await db.commit();

    // Send back the response
    res.status(200).json({
      uzytkownikId: uzytkownikId,
      daneId: dane_id,
      ...req.body,
      img: imgPath ? imgPath : req.body.img,
    });
  } catch (err) {
    // Rollback in case of error
    await db.rollback();
    console.error(err);
    res.status(500).send("Error processing your request");
  }
});

module.exports = router;
