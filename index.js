const { google } = require("googleapis");
const { authorize } = require("./auth");
const { performSync } = require("./sync");
const createConnection = require("./db");

async function main() {
  const auth = await authorize();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1e5F-Nj7V6k2gUidvqJPmQ7uQUMuD4epgk-NZOjsIDGk";
  const range = "A1:Z1000";
  const tableName = "users";
  const connection = await createConnection();
  try {
    while (true) {
      await performSync(sheets, connection, spreadsheetId, range, tableName);
      // Wait for 60 seconds before next sync
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
