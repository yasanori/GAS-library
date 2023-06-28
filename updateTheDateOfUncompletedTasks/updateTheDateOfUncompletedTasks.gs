// 前日までの未完了タスクの日付を本日に更新する

function updateDue() {
  // タスクリストを全て取得
  const lists = Tasks.Tasklists.list().getItems();

  lists.forEach(function (list) {
    // タスクリストからタスクを取得
    let tasks = Tasks.Tasks.list(list.id, {
      showCompleted: false,
      // MAX100タスクを読み込み
      maxResults: 100,
    }).getItems();

    for (let i = 0; i < tasks.length; i++) {
      console.log(tasks[i].due + "：" + tasks[i].title);
      if (tasks[i].due) {
        if (new Date(tasks[i].due) < new Date()) {
          tasks[i].due =
            Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy-MM-dd") +
            "T00:00:00.000Z";
          Tasks.Tasks.update(tasks[i], list.id, tasks[i].id);
        }
      }
    }
  });
}
