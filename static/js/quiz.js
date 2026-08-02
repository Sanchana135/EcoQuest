// EcoQuest Interactive Quiz Engine with Confetti & Badge Popups

document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quizForm');
    const timerDisplay = document.getElementById('timerDisplay');
    const timeLimitSecInput = document.getElementById('timeLimitSec');
    
    // 1. Radio button option card selection handler
    const optionLabels = document.querySelectorAll('.option-label');
    optionLabels.forEach(label => {
        label.addEventListener('click', () => {
            const radio = label.querySelector('input[type="radio"]');
            if (radio) {
                const questionName = radio.name;
                document.querySelectorAll(`input[name="${questionName}"]`).forEach(r => {
                    const parentLabel = r.closest('.option-label');
                    if (parentLabel) parentLabel.classList.remove('selected');
                });
                radio.checked = true;
                label.classList.add('selected');
            }
        });
    });

    // 2. Countdown Timer
    if (timerDisplay && timeLimitSecInput) {
        let timeRemaining = parseInt(timeLimitSecInput.value, 10) || 300;

        const updateTimerText = () => {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        updateTimerText();

        const timerInterval = setInterval(() => {
            timeRemaining--;
            updateTimerText();

            if (timeRemaining <= 30) {
                timerDisplay.parentElement.style.animation = 'pulseGlow 1s infinite';
            }

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                alert('Time is up! Your quiz answers are being submitted automatically.');
                if (quizForm) quizForm.submit();
            }
        }, 1000);

        if (quizForm) {
            quizForm.addEventListener('submit', () => {
                clearInterval(timerInterval);
            });
        }
    }
});
