async function readSheet(spreadsheetId, sheets, range) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log("No data found.");
    return [];
  }
  return rows;
}

async function writeSheet(spreadsheetId, sheets, range, values) {
  const resource = { values };
  try {
    const result = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource,
    });
    console.log("%d cells updated.", result.data.updatedCells);
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports = { readSheet, writeSheet };
