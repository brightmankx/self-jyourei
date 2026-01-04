window.addEventListener("DOMContentLoaded", () => {
    const btnTin = document.getElementById("btnTin");
    const btnBowl = document.getElementById("btnBowl");
    const btnKyouten = document.getElementById("btnKyouten");
    const btnSettings = document.getElementById("btnSettings");

    const overlay = document.getElementById("settingsOverlay");

    // ▼ 設定ダイアログ内の要素
    const tvSensitivityValue = document.getElementById("tvSensitivityValue");
    const btnPlus = document.getElementById("btnPlus");
    const btnMinus = document.getElementById("btnMinus");

    const btnSmall = document.getElementById("btnSmall");
    const btnMedium = document.getElementById("btnMedium");
    const btnLarge = document.getElementById("btnLarge");

    const btnOk = document.getElementById("btnOk");
    const btnCancel = document.getElementById("btnCancel");

    // ----------------------------------------------------
    // 設定値（localStorage）
    // ----------------------------------------------------
    let shakeThreshold = Number(localStorage.getItem("shakeThreshold") || 12);
    let mantraSize = localStorage.getItem("mantraSize") || "medium";

    // UI に反映
    tvSensitivityValue.textContent = shakeThreshold;

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

    // ----------------------------------------------------
    // 設定ダイアログを開く
    // ----------------------------------------------------
    if (btnSettings) {
        btnSettings.addEventListener("click", async () => {
            await requestIOSMotionPermission();
            overlay.style.display = "flex";
        });
    }

    // 背景タップで閉じる
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.style.display = "none";
    });

    // ----------------------------------------------------
    // 設定ダイアログ：感度（＋ / −）
    // ----------------------------------------------------
    btnPlus.addEventListener("click", () => {
        shakeThreshold++;
        tvSensitivityValue.textContent = shakeThreshold;
    });

    btnMinus.addEventListener("click", () => {
        shakeThreshold--;
        if (shakeThreshold < 1) shakeThreshold = 1;
        tvSensitivityValue.textContent = shakeThreshold;
    });

    // ----------------------------------------------------
    // 設定ダイアログ：文字サイズ（小 / 中 / 大）
    // ----------------------------------------------------
    btnSmall.addEventListener("click", () => {
        mantraSize = "small";
    });

    btnMedium.addEventListener("click", () => {
        mantraSize = "medium";
    });

    btnLarge.addEventListener("click", () => {
        mantraSize = "large";
    });

    // ----------------------------------------------------
    // OK → 保存
    // ----------------------------------------------------
    btnOk.addEventListener("click", () => {
        localStorage.setItem("shakeThreshold", shakeThreshold);
        localStorage.setItem("mantraSize", mantraSize);
        overlay.style.display = "none";
    });

    // ----------------------------------------------------
    // キャンセル → 閉じるだけ
    // ----------------------------------------------------
    btnCancel.addEventListener("click", () => {
        overlay.style.display = "none";
    });

    // ----------------------------------------------------
    // 振って鳴らすロジック（iPhone / Android 共通）
    // ----------------------------------------------------
    if (window.DeviceMotionEvent) {
        let accelCurrent = 0;
        let accelLast = 0;
        let shake = 0;

        let lastBellTime = 0;
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

            // ★ 設定ダイアログで変更した shakeThreshold を使う
            if (shake < -shakeThreshold) {
                lastBellTime = now;

                const index = Math.floor(Math.random() * 3) + 1;
                new Audio(`bell_${index}.mp3`).play();
            }
        });
    }
});