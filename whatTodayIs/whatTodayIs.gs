//const webhookUrlForTest = "https://hooks.slack.com/services/xxxxxxxx";
const webhookUrl =
  "https://hooks.slack.com/services/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";

function execute() {
  // 今日の年月日を取得
  const date = new Date();
  const todayYear = date.getFullYear();
  const todayMonth = date.getMonth() + 1;
  const todayDay = date.getDate();
  const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];

  // 年月日順にシートをソート
  var sheet = SpreadsheetApp.openById(
    "1KTd9-G82DdH83bkn1m0ZKTob6WEzWWgtsSiT7QD1Rzo"
  ).getSheetByName("list");
  var range = sheet.getRange("A2:F900");
  range.sort([{ column: 1 }, { column: 2 }, { column: 3 }]);

  // 一行ずつ確認
  var rows = sheet.getDataRange().getValues();
  var slackText = "";
  for (var i = 1; i < rows.length; i++) {
    // データ取得
    const row = rows[i];
    const year = row[0];
    const month = parseInt(row[1]);
    const day = parseInt(row[2]);
    const title = row[3];
    const category = row[4];
    const link = row[5];
    console.log(
      "year:" +
        year +
        ", month:" +
        month +
        ", day:" +
        day +
        ", title:" +
        title +
        ", category:" +
        category +
        ", link:" +
        link
    );

    // 今日の月日と比較
    if (todayMonth == month && todayDay == day) {
      if (title != "") {
        slackText += createSlackTextLine(
          year,
          todayYear,
          title,
          category,
          link
        );
      }
    }
  }

  // 同じ日付のイベントがあればSlackにコメント
  if (slackText != "") {
    slackText =
      "本日 " +
      todayYear +
      "/" +
      todayMonth +
      "/" +
      todayDay +
      " (" +
      dayOfWeek +
      ") と同じ日に起きた出来事を共有します！\n\n" +
      slackText +
      "\n\n" +
      "記念日やイベントはこちらのシートに記入できます: https://xxxxxxxxxxxx";
    commentToSlack(slackText, webhookUrl);
  } else {
    slackText =
      "本日 " +
      todayYear +
      "/" +
      todayMonth +
      "/" +
      todayDay +
      " (" +
      dayOfWeek +
      ") と同じ日に起きた出来事はありませんでした！";
    commentToSlack(slackText, webhookUrlForTest);
  }
}

function commentToSlack(text, webhookUrl) {
  var params = {
    method: "POST",
    payload: JSON.stringify({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: text,
          },
        },
      ],
      unfurl_links: false,
    }),
  };
  UrlFetchApp.fetch(webhookUrl, params);
}

function createSlackTextLine(year, todayYear, title, category, link) {
  var text = "*- ";

  if (year != "") {
    if (year == todayYear) {
      text += "`今日`";
    } else {
      var yearsAgo = todayYear - parseInt(year);
      text += "`" + yearsAgo + "年前`";
    }
  } else {
    text += "`今日`";
  }

  text += getSlackCategoryEmoji(category);

  text += " " + title + "*";

  if (link != "") {
    text += "\n    - " + link;
  }

  text += "\n";

  return text;
}

function getSlackCategoryEmoji(category) {
  switch (category) {
    case "birthday":
      return " :birthday:";
    case "product":
      return " :rocket:";
    case "company":
      return " :office:";
    case "join":
      return " :clap:";
    default:
      return "";
  }
}
