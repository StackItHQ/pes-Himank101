const express = require("express");
const bodyParser = require("body-parser");
const { performSync, setupPolling } = require("./sync");
const createConnection = require("./db");
const { readFromDb, writeToDb } = require("./database");

const app = express();
app.use(bodyParser.json());
const PORT = 3000;

app.get("/ab", (req, res) => {
  res.send("Hello from Express!");
});

app.post("/sync", async (req, res) => {
  const { sheetData, mysqlConfig, userInfo, spreadsheetId } = req.body;
  console.log(sheetData, mysqlConfig, userInfo, spreadsheetId);
  if (!mysqlConfig || !sheetData) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }
  const connection = await createConnection(mysqlConfig);
  // const rows = await readFromDb(connection, "users");
  try {
    // Initial Sync: Push data from Google Sheets to MySQL
    await performSync(sheetData, connection, mysqlConfig.tableName);
    res.json({ success: true, message: "Initial sync completed" });

    // Start polling to keep the database and Google Sheets in sync
    setupPolling(mysqlConfig, userInfo, spreadsheetId);
  } catch (err) {
    console.error("Sync failed", err);
    res.status(500).json({ success: false, message: "Sync failed" });
  } finally {
    await connection.end();
  }
  /*   res.json({ message: "still works" }); */
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
