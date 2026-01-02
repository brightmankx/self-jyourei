// JSON を読み込んでリストを生成する
async function loadMantras() {
    const list = document.getElementById("list");

    // 2つの JSON を読み込む
    const shortRes = await fetch("mantra.json");
    const longRes = await fetch("mantra_long.json");

    const shortList = await shortRes.json();
    const longList = await longRes.json();

    // 真言（短い）
    addSectionTitle("真言");
    shortList.forEach(item => addItem(item.name));

    // 経文・祝詞（長い）
    addSectionTitle("経文・祝詞");
    longList.forEach(item => addItem(item.name));
}

// セクションタイトル
function addSectionTitle(text) {
    const list = document.getElementById("list");
    const div = document.createElement("div");
    div.textContent = text;
    div.style.color = "white";
    div.style.fontSize = "22px";
    div.style.margin = "20px 0 10px 0";
    div.style.textShadow = "0 0 6px rgba(255,255,255,0.7)";
    list.appendChild(div);
}

// リスト項目
function addItem(name) {
    const list = document.getElementById("list");
    const div = document.createElement("div");
    div.className = "item";
    div.textContent = name;

    div.addEventListener("click", () => {
        window.location.href = `mantra.html?name=${encodeURIComponent(name)}`;
    });

    list.appendChild(div);
}

// 起動
window.addEventListener("DOMContentLoaded", loadMantras);