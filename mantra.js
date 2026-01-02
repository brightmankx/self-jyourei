// URLパラメータから真言名を取得
const params = new URLSearchParams(window.location.search);
const mantraName = params.get("name");

// タイトルに反映
document.getElementById("title").textContent = mantraName;

// 戻るボタン
document.getElementById("back").addEventListener("click", () => {
    history.back();
});

// 本文を読み込む
async function loadText() {
    const shortRes = await fetch("mantra.json");
    const longRes = await fetch("mantra_long.json");

    const shortList = await shortRes.json();
    const longList = await longRes.json();

    let text = "";

    // 短い真言
    if (shortList[mantraName]) {
        text = shortList[mantraName];
    }

    // 長い経文
    if (longList[mantraName]) {
        text = longList[mantraName];
    }

    document.getElementById("text").textContent = text;
}

window.addEventListener("DOMContentLoaded", loadText);