const express = require("express");
const router = express.Router();
const db = require("../db/database.js");

// router.get("/pola", (req, res) => {
//   db.query("SELECT * FROM dzialki", (err, results) => {
//     if (err) {
//       res.status(500).send("Database error");
//       return;
//     }
//     res.json(results);
//   });
// });

router.get("/pola", (req, res) => {
  db.query("SELECT d.*,u.uprawa FROM dzialki as d LEFT JOIN uprawa as u ON u.numer_ewidencyjny=d.numer_ewidencyjny;", (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.post("/pola", (req, res) => {
  const {nazwa, obreb, numer_ewidencyjny, area, polygon} = req.body;

  const query = "INSERT INTO dzialki (nazwa, obreb, numer_ewidencyjny, area, polygon) VALUES (?, ?, ?, ?, ?)";
  const values = [nazwa, obreb, numer_ewidencyjny, area, polygon];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error saving the 'dzialka'");
      console.error(err);
      return;
    }
    res.status(201).json({id: result.insertId, ...req.body});
  });
});

router.delete("/pola/:id", (req, res) => {
  const {id} = req.params;

  const query = "DELETE FROM dzialki WHERE dzialka_id = ?";
  const values = [id];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error deleting the record");
      return;
    }
    res.status(200).send({message: "Record deleted successfully", id});
  });
});
router.put("/pola/:id", (req, res) => {
  const {id} = req.params;
  const {nazwa, obreb, numer_ewidencyjny, area, polygon, uzytkownik_id} = req.body;

  const query = `
    UPDATE dzialki 
    SET nazwa = ?, obreb = ?, numer_ewidencyjny = ?, area = ?, polygon = ?, uzytkownik_id = ?
    WHERE dzialka_id = ?
  `;
  const values = [nazwa, obreb, numer_ewidencyjny, area, polygon, uzytkownik_id, id];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error updating the record");
      return;
    }
    res.status(200).send({message: "Record updated successfully", id});
  });
});

router.get("/pola/:id", (req, res) => {
  const {id} = req.params;

  const query = "SELECT * FROM dzialki WHERE dzialka_id = ?";
  const values = [id];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.get("/polygons", (req, res) => {
  db.query("SELECT polygon FROM dzialki WHERE polygon IS NOT NULL;", (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.get("/poly-uprawy", (req, res) => {
  db.query("SELECT polygon FROM uprawa WHERE polygon IS NOT NULL;", (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.get("/uprawy", (req, res) => {
  db.query("SELECT * FROM uprawa", (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.get("/area", (req, res) => {
  db.query("SELECT numer_ewidencyjny,area,polygon FROM dzialki;", (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.post("/uprawy", (req, res) => {
  const {numer_ewidencyjny, uprawa, powierzchnia_dzialki, powierzchnia_uprawy, polygon} = req.body;

  const query = "INSERT INTO uprawa (numer_ewidencyjny, uprawa, powierzchnia_dzialki, powierzchnia_uprawy, polygon) VALUES (?, ?, ?, ?, ?)";
  const values = [numer_ewidencyjny, uprawa, powierzchnia_dzialki, powierzchnia_uprawy, polygon];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error saving the 'uprawa'");
      console.error(err);
      return;
    }
    res.status(201).json({id: result.insertId, ...req.body});
  });
});

router.delete("/uprawy/:id", (req, res) => {
  const {id} = req.params;

  const query = "DELETE FROM uprawa WHERE uprawa_id = ?";
  const values = [id];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error deleting the record");
      return;
    }
    res.status(200).send({message: "Record deleted successfully", id});
  });
});

router.put("/uprawy/:id", (req, res) => {
  const {id} = req.params;
  const {numer_ewidencyjny, uprawa, powierzchnia_dzialki, powierzchnia_uprawy, polygon, uzytkownik_id} = req.body;

  const query = `
    UPDATE uprawa
    SET numer_ewidencyjny = ?, uprawa = ?, powierzchnia_dzialki = ?, powierzchnia_uprawy = ?,polygon = ?, uzytkownik_id = ?
    WHERE uprawa_id = ?
  `;
  const values = [numer_ewidencyjny, uprawa, powierzchnia_dzialki, powierzchnia_uprawy, polygon, uzytkownik_id, id];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error updating the record");
      return;
    }
    res.status(200).send({message: "Record updated successfully", id});
  });
});

router.get("/uprawy/:id", (req, res) => {
  const {id} = req.params;

  const query = "SELECT * FROM uprawa WHERE uprawa_id = ?";
  const values = [id];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.get("/prace", (req, res) => {
  db.query("SELECT * FROM postep_prac", (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.get("/operator", (req, res) => {
  db.query("SELECT imie,nazwisko FROM operatorzy", (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.post("/prace", (req, res) => {
  const {numer_ewidencyjny, praca, powierzchnia_dzialki, powierzchnia_pracy, polygon, data, operator} = req.body;

  const query = "INSERT INTO postep_prac (numer_ewidencyjny, praca, powierzchnia_dzialki, powierzchnia_pracy, polygon,data,operator) VALUES (?, ?, ?, ?, ?,?,?)";
  const values = [numer_ewidencyjny, praca, powierzchnia_dzialki, powierzchnia_pracy, polygon, data, operator];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error saving the 'praca'");
      console.error(err);
      return;
    }
    res.status(201).json({id: result.insertId, ...req.body});
  });
});

router.delete("/prace/:id", (req, res) => {
  const {id} = req.params;

  const query = "DELETE FROM postep_prac WHERE postep_prac_id = ?";
  const values = [id];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error deleting the record");
      return;
    }
    res.status(200).send({message: "Record deleted successfully", id});
  });
});

router.get("/poly-prace/:id", (req, res) => {
  const {id} = req.params;
  const query = "SELECT polygon FROM postep_prac WHERE postep_prac_id = ?";
  const values = [id];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});
module.exports = router;
