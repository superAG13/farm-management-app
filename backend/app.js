const express = require("express");
const app = express();
const apiRoutes = require("./routes/api");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use("/api", apiRoutes);

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
