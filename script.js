// ① 日付フォーマット（先）
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

// ② ルール名マップ（先）
const ruleMap = {
  area: "エリア",
  asari: "アサリ",
  yagura: "ヤグラ",
  hoko: "ホコ"
};

// ③ フォーム取得
const form = document.getElementById("xp-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const rule = document.getElementById("rule").value;
  const date = document.getElementById("date").value;
  const maxXp = Number(document.getElementById("max-xp").value);
  const lastXp = Number(document.getElementById("last-xp").value);
  const stage1 = document.getElementById("stage1").value;
  const stage2 = document.getElementById("stage2").value;

  if (stage1 === stage2) {
    alert("同じステージは選べません");
    return;
  }

  const record = {
    id: crypto.randomUUID(),
    rule,
    date,
    maxXp,
    lastXp,
    stages: [stage1, stage2],
    createdAt: new Date().toISOString()
  };

  const stored = localStorage.getItem("xp-records");
  const records = stored ? JSON.parse(stored) : [];

  records.push(record);
  localStorage.setItem("xp-records", JSON.stringify(records));

  renderRecordList();
  alert("保存しました");
  form.reset();
});

// ④ 一覧描画
function renderRecordList() {
  const listEl = document.getElementById("record-list");
  listEl.innerHTML = "";

  const records = JSON.parse(localStorage.getItem("xp-records")) || [];
  records.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const countMap = {};

  records.forEach(record => {
    const key = `${record.date}_${record.rule}`;
    countMap[key] = (countMap[key] || 0) + 1;

    const li = document.createElement("li");

    li.textContent =
      `${formatDate(record.date)} (${countMap[key]}) ` +
      `${ruleMap[record.rule]} ` +
      `${record.maxXp} → ${record.lastXp} ` +
      `［${record.stages.join(" / ")}］`;

    listEl.appendChild(li);
  });
}

// ⑤ 初回表示（最後）
renderRecordList();
