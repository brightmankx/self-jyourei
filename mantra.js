// URLパラメータから真言名を取得
const params = new URLSearchParams(window.location.search);
const mantraName = params.get("name");

// タイトルに反映
document.getElementById("title").textContent = mantraName;

// グローバル状態
let lines = [];          // 現在表示する経文の行データ
let currentIndex = -1;   // 最後に「全文表示」された行のインデックス（-1 は最初の状態）

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

    if (!found) {
        document.getElementById("text").textContent = "本文が見つかりません。";
        return;
    }

    lines = found.lines;
    currentIndex = -1; // 最初の状態

    renderState();
}

// 現在の状態に応じて画面を描画
function renderState() {
    const container = document.getElementById("text");
    container.innerHTML = "";

    // 行がない場合
    if (!lines || lines.length === 0) return;

    // 最初の状態：1行目の最初の1文字だけ
    if (currentIndex === -1) {
        const preview = createLineElement(lines[0], "preview");
        container.appendChild(preview);
        return;
    }

    // それ以外：0〜currentIndex まで全文表示
    for (let i = 0; i <= currentIndex && i < lines.length; i++) {
        const full = createLineElement(lines[i], "full");
        container.appendChild(full);
    }

    // 次の行があれば、その最初の1文字だけ表示
    const nextIndex = currentIndex + 1;
    if (nextIndex < lines.length) {
        const preview = createLineElement(lines[nextIndex], "preview");
        container.appendChild(preview);
    }
}

// 行要素を作る
// mode: "full"（全文） / "preview"（最初の1文字だけ）
function createLineElement(line, mode) {
    const div = document.createElement("div");
    div.className = "line";

    // 長い経文（オブジェクト形式）
    if (typeof line === "object") {
        if (mode === "full") {
            // ルビ（漢字＋読み）
            const ruby = document.createElement("ruby");
            const rb = document.createElement("rb");
            const rt = document.createElement("rt");

            rb.textContent = line.kanji;
            rt.textContent = line.yomi;

            ruby.appendChild(rb);
            ruby.appendChild(rt);
            div.appendChild(ruby);
        } else {
            // プレビュー：漢字の最初の1文字だけ
            div.textContent = line.kanji ? line.kanji.charAt(0) : "";
        }
    } else {
        // 短い真言（文字列形式）
        if (mode === "full") {
            div.textContent = line;
        } else {
            div.textContent = line ? line.charAt(0) : "";
        }
    }

    return div;
}

// タップ時の動き
function onTap() {
    if (!lines || lines.length === 0) return;

    // 最後の行まで全文表示済みなら、リセット
    if (currentIndex >= lines.length - 1) {
        currentIndex = -1;
        renderState();
        return;
    }

    // 次の行へ進める（音もここで鳴らす想定）
    currentIndex++;
    playTapSound();
    renderState();
}

// 音を鳴らす（あとで実装してもOKなフック）
function playTapSound() {
    // ここで Audio を再生する実装を入れられる
    // 例：
    // const audio = new Audio("chant.mp3");
    // audio.play();
}

// 画面全体（本文領域）をタップ対象にする
document.getElementById("text").addEventListener("click", onTap);

// 読み込み開始
window.addEventListener("DOMContentLoaded", loadText);