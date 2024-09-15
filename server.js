const express = require("express");

const app = express();
const PORT = 3000;

app.get("/ab", (req, res) => {
  res.send("Hello from Express!");
});

app.post("/sync", (req, res) => {
  console.log(req);
  res.json({ message: "rcvd" });
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
