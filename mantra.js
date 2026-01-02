// URLパラメータから真言名を取得
const params = new URLSearchParams(window.location.search);
const mantraName = params.get("name");

// タイトルに反映
document.getElementById("title").textContent = mantraName;

// グローバル状態
let lines = [];
let currentIndex = -1;

// 戻るボタン
document.getElementById("back").addEventListener("click", () => {
    window.location.href = "mantra_select.html";
});

// 本文を読み込む
async function loadText() {
    const shortRes = await fetch("mantra.json");
    const longRes = await fetch("mantra_long.json");

    const shortList = await shortRes.json();
    const longList = await longRes.json();

    let found = shortList.find(item => item.name === mantraName);
    if (!found) found = longList.find(item => item.name === mantraName);

    if (!found) {
        document.getElementById("text").textContent = "本文が見つかりません。";
        return;
    }

    lines = found.lines;
    currentIndex = -1;

    renderState();
}

// 状態に応じて描画
function renderState() {
    const container = document.getElementById("text");
    container.innerHTML = "";

    if (!lines || lines.length === 0) return;

    // 最初の状態：1行目の最初の1文字＋読みの1文字
    if (currentIndex === -1) {
        const preview = createLineElement(lines[0], "preview");
        container.appendChild(preview);
        return;
    }

    // 0〜currentIndex まで全文表示
    for (let i = 0; i <= currentIndex && i < lines.length; i++) {
        const full = createLineElement(lines[i], "full");
        container.appendChild(full);
    }

    // 次の行があればプレビュー
    const nextIndex = currentIndex + 1;
    if (nextIndex < lines.length) {
        const preview = createLineElement(lines[nextIndex], "preview");
        container.appendChild(preview);
    }
}

// 行要素を作る
function createLineElement(line, mode) {
    const div = document.createElement("div");
    div.className = "line";

    // 長い経文（オブジェクト形式）
    if (typeof line === "object") {
        if (mode === "full") {
            const ruby = document.createElement("ruby");
            const rb = document.createElement("rb");
            const rt = document.createElement("rt");

            rb.textContent = line.kanji;
            rt.textContent = line.yomi;

            ruby.appendChild(rb);
            ruby.appendChild(rt);
            div.appendChild(ruby);
        } else {
            // プレビュー：漢字1文字＋読み1文字
            div.textContent = `${line.kanji.charAt(0)}（${line.yomi.charAt(0)}）`;
        }
    } else {
        // 短い真言（文字列）
        if (mode === "full") {
            div.textContent = line;
        } else {
            div.textContent = line.charAt(0);
        }
    }

    return div;
}

// タップ時の動き
function onTap() {
    if (!lines || lines.length === 0) return;

    if (currentIndex >= lines.length - 1) {
        currentIndex = -1;
        renderState();
        return;
    }

    currentIndex++;
    renderState();
}

document.getElementById("text").addEventListener("click", onTap);

window.addEventListener("DOMContentLoaded", loadText);