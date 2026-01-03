window.addEventListener("DOMContentLoaded", () => {
    const btnTin = document.getElementById("btnTin");
    const btnBowl = document.getElementById("btnBowl");
    const btnKyouten = document.getElementById("btnKyouten");
    const btnSettings = document.getElementById("btnSettings");

    const overlay = document.getElementById("settingsOverlay");
    const closeBtn = document.getElementById("settingsClose");

    // ----------------------------------------------------
    // iPhone用：最初のタップでモーションセンサー許可を求める
    // ----------------------------------------------------
    async function requestIOSMotionPermission() {
        if (typeof DeviceMotionEvent !== "undefined" &&
            typeof DeviceMotionEvent.requestPermission === "function") {
            try {
                const state = await DeviceMotionEvent.requestPermission();
                console.log("iOS motion permission:", state);
            } catch (e) {
                console.log("iOS motion permission error:", e);
            }
        }
    }

    // ----------------------------------------------------
    // クリック音（＋ iPhone の許可要求）
    // ----------------------------------------------------
    if (btnTin) {
        btnTin.addEventListener("click", async () => {
            await requestIOSMotionPermission();
            new Audio("tin.mp3").play();
        });
    }

    if (btnBowl) {
        btnBowl.addEventListener("click", async () => {
            await requestIOSMotionPermission();
            new Audio("bowl.mp3").play();
        });
    }

    if (btnKyouten) {
        btnKyouten.addEventListener("click", async () => {
            await requestIOSMotionPermission();
            window.location.href = "mantra_select.html";
        });
    }

    // 設定ダイアログ
    if (btnSettings) {
        btnSettings.addEventListener("click", async () => {
            await requestIOSMotionPermission();
            overlay.style.display = "flex";
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            overlay.style.display = "none";
        });
    }

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.style.display = "none";
    });

    // ----------------------------------------------------
    // 振って鳴らすロジック（iPhone / Android 共通）
    // ----------------------------------------------------
    if (window.DeviceMotionEvent) {
        let accelCurrent = 0;
        let accelLast = 0;
        let shake = 0;

        let lastBellTime = 0;
        const shakeThreshold = 12;
        const coolTime = 100; // ← あなたが気に入った設定

        window.addEventListener("devicemotion", (event) => {
            const acc = event.accelerationIncludingGravity;
            if (!acc) return;

            const x = acc.x;

            if (accelLast === 0 && accelCurrent === 0) {
                accelLast = x;
                accelCurrent = x;
                return;
            }

            accelLast = accelCurrent;
            accelCurrent = x;

            const delta = accelCurrent - accelLast;

            shake = shake * 0.9 + delta;

            const now = Date.now();
            if (now - lastBellTime < coolTime) return;

            if (shake < -shakeThreshold) {
                lastBellTime = now;

                const index = Math.floor(Math.random() * 3) + 1;
                new Audio(`bell_${index}.mp3`).play();
            }
        });
    }
});