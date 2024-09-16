const express = require("express");
const bodyParser = require("body-parser");
const { performSync, setupPolling } = require("./sync");
const createConnection = require("./db");
const { readFromDb, writeToDb } = require("./database");
const { readSheet } = require("./sheets");

const app = express();
app.use(bodyParser.json());
const PORT = 3000;

app.get("/ab", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.post("/sync", async (req, res) => {
  const { sheetData, mysqlConfig, userInfo, spreadsheetId } = req.body;

  if (!mysqlConfig || !sheetData) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }

  const connection = await createConnection(mysqlConfig);

  try {
    // Perform the database update here
    await performSync(sheetData, connection, mysqlConfig.tableName);
    res.status(200).json({ message: "Database updated successfully" });
  } catch (error) {
    console.error("Error updating database:", error);
    res.status(500).json({ message: "Failed to update database" });
  } finally {
    await connection.end();
  }
});

app.post("/update-db", async (req, res) => {
  const { sheetData, action } = req.body;

  if (action === "update") {
    console.log("yes");
    const mysqlConfig = {
      // Retrieve mysqlConfig from environment variables or other configuration
      host: "localhost",
      port: "3306",
      database: "GSheetConnector",
      username: "root",
      password: "Himank@2214",
      tableName: "users",
    };

    const connection = await createConnection(mysqlConfig);

    try {
      performSync(sheetData, connection, mysqlConfig.tableName);
      // Perform the database update here
      // For example, if you want to sync data from the sheet to the database, call performSync here
      res.status(200).json({ message: "Database updated successfully" });
    } catch (error) {
      console.error("Error updating database:", error);
      res.status(500).json({ message: "Failed to update database" });
    } finally {
      await connection.end();
    }
  } else {
    res.status(400).json({ message: "Invalid action" });
  }
});
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
