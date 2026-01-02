// 音声読み込み
const bellSounds = [
    new Audio("bell_1.MP3"),
    new Audio("bell_2.MP3"),
    new Audio("bell_3.MP3")
];

const bowlSound = new Audio("bowl.MP3");
const tinSound = new Audio("tin.MP3");

// タップで音を鳴らす
document.getElementById("btnTin").addEventListener("click", () => {
    tinSound.currentTime = 0;
    tinSound.play();
});

document.getElementById("btnBowl").addEventListener("click", () => {
    bowlSound.currentTime = 0;
    bowlSound.play();
});

// 経典画面へ
document.getElementById("btnKyouten").addEventListener("click", () => {
    window.location.href = "mantra_select.html";
});

// YouTube
document.getElementById("btnPowered").addEventListener("click", () => {
    window.open("https://www.youtube.com/@jasmine358", "_blank");
});

// 加速度センサ（スマホ）
if (window.DeviceMotionEvent) {
    window.addEventListener("devicemotion", (event) => {
        const x = event.accelerationIncludingGravity.x;

        if (Math.abs(x) > 12) {
            const sound = bellSounds[Math.floor(Math.random() * bellSounds.length)];
            sound.currentTime = 0;
            sound.play();
        }
    });
}