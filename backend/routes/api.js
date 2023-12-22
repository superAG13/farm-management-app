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

  const query = "DELETE FROM farm.dzialki WHERE dzialka_id = ?";
  const values = [id];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send("Error deleting the record");
      return;
    }
    res.status(200).send({message: "Record deleted successfully", id});
  });
});

module.exports = router;
