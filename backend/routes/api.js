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

// More routes can be added here

module.exports = router;
