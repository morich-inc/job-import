// GASプロキシ - Anthropic API中継
// スクリプトプロパティに ANTHROPIC_API_KEY を設定してください

function doPost(e) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  try {
    const body = JSON.parse(e.parameter.payload);
    const apiKey = PropertiesService.getScriptProperties().getProperty("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return ContentService.createTextOutput(JSON.stringify({ error: "ANTHROPIC_API_KEY not set" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const response = UrlFetchApp.fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      payload: JSON.stringify(body),
      muteHttpExceptions: true
    });

    const result = response.getContentText();
    return ContentService.createTextOutput(result)
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
