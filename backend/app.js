const express = require("express");
const path = require("path");
const app = express();
const apiRoutes = require("./routes/api");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use("/api", apiRoutes);
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
