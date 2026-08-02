// EcoQuest Authentication Form Validation

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const passwordMatchFeedback = document.getElementById('passwordMatchFeedback');

    if (confirmPasswordInput && passwordInput && passwordMatchFeedback) {
        confirmPasswordInput.addEventListener('input', () => {
            if (confirmPasswordInput.value === '') {
                passwordMatchFeedback.textContent = '';
            } else if (confirmPasswordInput.value === passwordInput.value) {
                passwordMatchFeedback.textContent = '✓ Passwords match';
                passwordMatchFeedback.style.color = 'var(--emerald-primary)';
            } else {
                passwordMatchFeedback.textContent = '✗ Passwords do not match';
                passwordMatchFeedback.style.color = 'var(--danger)';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            if (passwordInput.value !== confirmPasswordInput.value) {
                e.preventDefault();
                alert('Please ensure your passwords match before submitting.');
            }
        });
    }
});
