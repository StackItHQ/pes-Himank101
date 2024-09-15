var SHEET_NAME = 'Sheet1';
var MYSQL_API_ENDPOINT = 'https://ready-paws-hide.loca.lt/sync'; // Replace with your actual API endpoint

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('MySQL Sync')
    .addItem('Configure MySQL Connection', 'showMySQLConfigDialog')
    .addItem('Sync Now', 'syncNow')
    .addToUi();
}

function showMySQLConfigDialog() {
  var html = HtmlService.createHtmlOutputFromFile('Page')
    .setWidth(400)
    .setHeight(350);
  SpreadsheetApp.getUi().showModalDialog(html, 'Configure MySQL Connection');
}

function saveMySQLConfig(config) {
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperties({
    'mysql_host': config.host,
    'mysql_port': config.port,
    'mysql_database': config.database,
    'mysql_username': config.username,
    'mysql_password': config.password
  });
  return 'Configuration saved successfully!';
}

function getMySQLConfig() {
  var userProperties = PropertiesService.getUserProperties();
  return {
    host: userProperties.getProperty('mysql_host') || '',
    port: userProperties.getProperty('mysql_port') || '3306',
    database: userProperties.getProperty('mysql_database') || '',
    username: userProperties.getProperty('mysql_username') || '',
    password: userProperties.getProperty('mysql_password') || ''
  };
}

function getUserInfo() {
  var user = Session.getActiveUser();
  return {
    email: user.getEmail(),
    id: user.getUserLoginId()
  };
}

function syncNow() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var mysqlConfig = getMySQLConfig();
  var userInfo = getUserInfo();
  
  var payload = {
    sheetData: data,
    mysqlConfig: mysqlConfig,
    userInfo: userInfo
  };
  
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(payload)
  };
  
  try {
    var response = UrlFetchApp.fetch(MYSQL_API_ENDPOINT, options);
    var result = JSON.parse(response.getContentText());
    if (result.success) {
      SpreadsheetApp.getUi().alert('Sync completed successfully!');
    } else {
      throw new Error(result.message || 'Unknown error occurred');
    }
  } catch (error) {
    SpreadsheetApp.getUi().alert('Sync failed: ' + error.message);
  }
}
