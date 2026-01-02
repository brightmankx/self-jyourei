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

    let found = null;

    // 短い真言から探す
    found = shortList.find(item => item.name === mantraName);

    // 長い経文から探す（短い方に無ければ）
    if (!found) {
        found = longList.find(item => item.name === mantraName);
    }

    // 見つからなかった場合
    if (!found) {
        document.getElementById("text").textContent = "本文が見つかりません。";
        return;
    }

    // lines を結合して本文にする
    const text = found.lines
        .map(line => {
            // 長い経文は {kanji, yomi} の形式
            if (typeof line === "object") {
                return line.kanji;
            }
            // 短い真言は文字列
            return line;
        })
        .join("\n");

    document.getElementById("text").textContent = text;
}

window.addEventListener("DOMContentLoaded", loadText);