window.addEventListener("DOMContentLoaded", () => {
    // ティンシャ
    const btnTin = document.getElementById("btnTin");
    // おりん
    const btnBowl = document.getElementById("btnBowl");
    // 経典（真言・経文の選択画面へ）
    const btnKyouten = document.getElementById("btnKyouten");
    // 設定
    const btnSettings = document.getElementById("btnSettings");
    // 設定ダイアログ関連
    const overlay = document.getElementById("settingsOverlay");
    const closeBtn = document.getElementById("settingsClose");

    // クリックで音
    if (btnTin) {
        btnTin.addEventListener("click", () => {
            const audio = new Audio("tin.mp3");
            audio.play();
        });
    }

    if (btnBowl) {
        btnBowl.addEventListener("click", () => {
            const audio = new Audio("bowl.mp3");
            audio.play();
        });
    }

    // 経典画面へ遷移
    if (btnKyouten) {
        btnKyouten.addEventListener("click", () => {
            window.location.href = "mantra_select.html";
        });
    }

    // 設定ダイアログを開く
    if (btnSettings && overlay && closeBtn) {
        btnSettings.addEventListener("click", () => {
            overlay.style.display = "flex";
        });

        closeBtn.addEventListener("click", () => {
            overlay.style.display = "none";
        });

        // オーバーレイ外側クリックで閉じる
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                overlay.style.display = "none";
            }
        });
    }

    // -----------------------------
    // 振って鳴らすロジック
    // -----------------------------

    if (window.DeviceMotionEvent) {
        let accelCurrent = 0;
        let accelLast = 0;
        let shake = 0;

        let lastBellTime = 0;
        const shakeThreshold = 12; // Android のデフォルト値

        window.addEventListener("devicemotion", (event) => {
            const acc = event.accelerationIncludingGravity;
            if (!acc) return;

            const x = acc.x;

            // 初期化
            if (isNaN(shake)) {
                shake = 0;
                accelLast = accelCurrent;
                return;
            }

            if (accelLast === 0 && accelCurrent === 0) {
                accelLast = x;
                accelCurrent = x;
                return;
            }

            accelLast = accelCurrent;
            accelCurrent = x;

            const delta = accelCurrent - accelLast;

            // 減衰フィルタ
            shake = shake * 0.9 + delta;

            const now = Date.now();
            if (now - lastBellTime < 100) return; // クールタイム

            // マイナス方向だけで鳴る
            if (shake < -shakeThreshold) {
                lastBellTime = now;

                // ランダムで 3 種類のベル音
                const index = Math.floor(Math.random() * 3) + 1;
                const audio = new Audio(`bell_${index}.mp3`);
                audio.play();
            }
        });
    }
});