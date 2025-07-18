// 1. DOM Element Selection
const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');
const themeSelect = document.getElementById('theme');
const modePomodoroBtn = document.getElementById('mode-pomodoro');
const modeShortBreakBtn = document.getElementById('mode-short-break');
const body = document.body;

// 2. App State and Logic
const MODES = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
};

const pomodoro = {
    mode: 'pomodoro', // 'pomodoro' or 'shortBreak'
    timeLeft: MODES.pomodoro,
    isRunning: false,
    intervalId: null,
    
    // All mode buttons in an array for easy manipulation
    modeButtons: [modePomodoroBtn, modeShortBreakBtn],

    updateDisplay() {
        const minutes = String(Math.floor(this.timeLeft / 60)).padStart(2, '0');
        const seconds = String(this.timeLeft % 60).padStart(2, '0');
        timeDisplay.textContent = `${minutes}:${seconds}`;
    },

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.intervalId = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                this.updateDisplay();
            } else {
                this.handleTimerCompletion();
            }
        }, 1000);
    },

    stop() {
        clearInterval(this.intervalId);
        this.isRunning = false;
    },

    reset() {
        this.stop();
        this.timeLeft = MODES[this.mode];
        this.updateDisplay();
    },

    handleTimerCompletion() {
        this.stop();
        // Optional: Tambahkan notifikasi atau suara di sini

        if (this.mode === 'pomodoro') {
            // Jika mode Pomodoro selesai, otomatis beralih ke Short Break dan mulai
            this.switchMode('shortBreak');
            this.start();
        } else {
            // Jika mode lain selesai, beralih kembali ke Pomodoro dan tunggu
            this.switchMode('pomodoro');
        }
    },

    switchMode(newMode) {
        this.mode = newMode;
        this.reset(); // Stop timer and set time for the new mode

        // Update active class on buttons
        this.modeButtons.forEach(button => {
            button.classList.remove('active');
        });
        document.getElementById(`mode-${newMode.replace('B', '-b')}`).classList.add('active');
    },
};

// 3. Theme Handling
const THEME_STORAGE_KEY = 'pomodoro-theme';
const THEMES = ['retro', 'forest']; // Daftar semua kelas tema (selain default)

function applyTheme(theme) {
    // Hapus semua kelas tema yang mungkin ada untuk menghindari konflik
    body.classList.remove(...THEMES);

    // Tambahkan kelas tema yang baru jika bukan default ('pixel')
    if (theme !== 'pixel') {
        body.classList.add(theme);
    }
    // Sinkronkan nilai dropdown dengan tema yang aktif
    themeSelect.value = theme;
}

function changeAndSaveTheme() {
    const selectedTheme = themeSelect.value;
    applyTheme(selectedTheme);
    localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);
}

// 4. Initialization
function init() {
    // Atur tampilan waktu awal
    pomodoro.updateDisplay();

    // Muat tema yang tersimpan atau gunakan default
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'pixel';
    applyTheme(savedTheme);

    // Pasang semua event listener
    startBtn.addEventListener('click', () => pomodoro.start());
    stopBtn.addEventListener('click', () => pomodoro.stop());
    resetBtn.addEventListener('click', () => pomodoro.reset());
    modePomodoroBtn.addEventListener('click', () => pomodoro.switchMode('pomodoro'));
    modeShortBreakBtn.addEventListener('click', () => pomodoro.switchMode('shortBreak'));
    themeSelect.addEventListener('change', changeAndSaveTheme);
}

// Jalankan aplikasi
init();