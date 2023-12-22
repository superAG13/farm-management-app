const express = require("express");
const router = express.Router();
const db = require("../db/database.js");

router.get("/data", (req, res) => {
  db.query("SELECT * FROM dzialki", (err, results) => {
    if (err) {
      res.status(500).send("Database error");
      return;
    }
    res.json(results);
  });
});

router.post("/data", (req, res) => {
  // The body should contain the 'nazwa', 'obreb', 'numer_ewidencyjny', and 'area'
  const {nazwa, obreb, numer_ewidencyjny, area} = req.body;

  // Replace 'area' with the actual column name for the area in your 'dzialki' table
  const query = "INSERT INTO dzialki (nazwa, obreb, numer_ewidencyjny, area) VALUES (?, ?, ?, ?)";
  const values = [nazwa, obreb, numer_ewidencyjny, area];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error saving the 'dzialka'");
      console.error(err);
      return;
    }
    res.status(201).json({id: result.insertId, ...req.body});
  });
});

router.delete("/data/:id", (req, res) => {
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
router.put("/data/:id", (req, res) => {
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

router.get("/data/:id", (req, res) => {
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

module.exports = router;
