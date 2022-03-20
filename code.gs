// How to connect your Telegram Bot to a Google Spreadsheet (Google Apps Script)
// https://www.youtube.com/watch?v=mKSXd_od4Lg
// 
// This code must be added to the Google Apps Script file attached to the spreadsheet script editor. 
// Full steps in the readme

var token = "";     // 1. FILL IN YOUR OWN TOKEN
var telegramUrl = "https://api.telegram.org/bot" + token;
var webAppUrl = "";      // 3. FILL IN THE ID OF YOUR SPREADSHEET
var adminID = "";   // 4. Fill in your own Telegram ID for debugging
var passphrase = "";  // 5. add a pass phrase so secure the rest of the world from manipulating the sheet

function getMe() {
  var url = telegramUrl + "/getMe";
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function setWebhook() {
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function sendText(id,text) {
  var url = telegramUrl + "/sendMessage?chat_id=" + id + "&text=" + encodeURIComponent(text);
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function doGet(e) {
  return HtmlService.createHtmlOutput("Hi there");
}

function doPost(e) {
  try {
    // this is where telegram works
    var data = JSON.parse(e.postData.contents);
    var text = data.message.text.split(" ");
    var code = text[0];
    var id = data.message.chat.id;
    if(code == passphrase) {  // 1. FILL IN YOUR OWN TOKEN
        var name = data.message.chat.first_name; //+ " " + data.message.chat.last_name;
        sendText(id, "done");
        SpreadsheetApp.openById(ssId).getSheets()[0].appendRow([new Date(),name,...text.slice(1)]);
    } else {
      sendText(id, "unauthorized");
    }

  } catch(e) {
    sendText(adminID, JSON.stringify(e,null,4));
  }
}