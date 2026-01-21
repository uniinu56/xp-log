// フォーム取得
const form = document.getElementById("xp-form");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // ページ再読み込み防止

  // 入力値取得
  const rule = document.getElementById("rule").value;
  const date = document.getElementById("date").value;
  const maxXp = Number(document.getElementById("max-xp").value);
  const lastXp = Number(document.getElementById("last-xp").value);
  const stage1 = document.getElementById("stage1").value;
  const stage2 = document.getElementById("stage2").value;

  // ステージ重複チェック（事実要件）
  if (stage1 === stage2) {
    alert("同じステージは選べません");
    return;
  }

  // 1件の記録データ
  const record = {
    id: crypto.randomUUID(),
    rule: rule,
    date: date,
    maxXp: maxXp,
    lastXp: lastXp,
    stages: [stage1, stage2],
    createdAt: new Date().toISOString()
  };

  // 既存データ取得
  const stored = localStorage.getItem("xp-records");
  const records = stored ? JSON.parse(stored) : [];

  // 追加して保存
  records.push(record);
  localStorage.setItem("xp-records", JSON.stringify(records));

  // 確認用
  alert("保存しました");

  // フォーム初期化
  form.reset();
});
function renderRecordList() {
  const listEl = document.getElementById("record-list");
  listEl.innerHTML = "";

  const records = JSON.parse(localStorage.getItem("xp-records")) || [];

  // 作成日時順（古い → 新しい）
  records.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // 同日・同ルールの回数カウント用
  const countMap = {};

  records.forEach(record => {
    const key = `${record.date}_${record.rule}`;
    countMap[key] = (countMap[key] || 0) + 1;
    const count = countMap[key];

    const li = document.createElement("li");

    li.textContent =
      `${record.date} (${count}) ` +
      `${record.rule} ` +
      `${record.maxXp} → ${record.lastXp} ` +
      `［${record.stages.join(" / ")}］`;

    listEl.appendChild(li);
  });
}

// 初回表示
renderRecordList();
