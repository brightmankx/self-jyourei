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

    // 端末を振ったときの音（簡易版）
    if (window.DeviceMotionEvent) {
        let lastAccel = { x: 0, y: 0, z: 0 };
        let lastTime = Date.now();

        window.addEventListener("devicemotion", (event) => {
            const acc = event.accelerationIncludingGravity;
            if (!acc) return;

            const currentTime = Date.now();
            const diffTime = currentTime - lastTime;
            if (diffTime < 150) return; // 感度調整

            const deltaX = acc.x - lastAccel.x;
            const deltaY = acc.y - lastAccel.y;
            const deltaZ = acc.z - lastAccel.z;
            const speed = Math.abs(deltaX + deltaY + deltaZ);

            // しっかり振ったときだけ
            if (speed > 15) {
                const audio = new Audio("bowl.mp3");
                audio.play();
            }

            lastTime = currentTime;
            lastAccel = { x: acc.x, y: acc.y, z: acc.z };
        });
    }
});