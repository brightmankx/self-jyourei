// ティンシャ
const btnTin = document.getElementById("btnTin");
if (btnTin) {
    btnTin.addEventListener("click", () => {
        const audio = new Audio("tin.mp3");
        audio.play();
    });
}

// おりん
const btnBowl = document.getElementById("btnBowl");
if (btnBowl) {
    btnBowl.addEventListener("click", () => {
        const audio = new Audio("bowl.mp3");
        audio.play();
    });
}

// 経典（真言・経文の選択画面へ）
const btnKyouten = document.getElementById("btnKyouten");
if (btnKyouten) {
    btnKyouten.addEventListener("click", () => {
        window.location.href = "mantra_select.html";
    });
}

// 設定（未実装）
const btnSettings = document.getElementById("btnSettings");
if (btnSettings) {
    btnSettings.addEventListener("click", () => {
        alert("設定メニューは現在準備中です。");
    });
}