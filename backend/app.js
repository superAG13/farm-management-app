const express = require("express");
const app = express();
const apiRoutes = require("./routes/api");

app.use("/api", apiRoutes);

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
