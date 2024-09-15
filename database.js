async function readFromDb(connection, tableName) {
  const [rows] = await connection.query(`SELECT * FROM ${tableName}`);
  return rows;
}

async function writeToDb(connection, tableName, data) {
  const columns = Object.keys(data[0]);
  const placeholders = columns.map(() => "?").join(", ");
  const query = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders})`;

  for (const row of data) {
    const values = columns.map((col) => row[col]);
    await connection.query(query, values);
  }
}

module.exports = { readFromDb, writeToDb };
