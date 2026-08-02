// EcoQuest Global JavaScript & Animated Popups

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dark/Light Theme Switcher
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    
    const savedTheme = localStorage.getItem('ecoquest_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('ecoquest_theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'light') {
            themeIcon.className = 'fa-solid fa-moon';
        } else {
            themeIcon.className = 'fa-solid fa-sun';
        }
    }

    // 2. Mobile Navbar Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 3. Auto dismiss alert messages after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-10px)';
            alert.style.transition = 'all 0.4s ease';
            setTimeout(() => alert.remove(), 400);
        }, 5000);
    });
});

// Animated Badge Unlock Modal helper
function showBadgeUnlockPopup(badgeName, badgeDesc, iconClass) {
    let overlay = document.getElementById('badgeModalOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'badgeModalOverlay';
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-content">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--gold-gradient); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 2.5rem; margin: 0 auto 1.25rem; box-shadow: 0 0 30px rgba(245, 158, 11, 0.5);">
                    <i class="fa-solid ${iconClass || 'fa-award'}" id="modalBadgeIcon"></i>
                </div>
                <span class="badge-pill badge-coin" style="margin-bottom: 0.5rem;">🏆 NEW TROPHY UNLOCKED</span>
                <h2 id="modalBadgeName" style="font-size: 1.8rem; margin-top: 0.25rem;">${badgeName}</h2>
                <p id="modalBadgeDesc" style="color: var(--text-secondary); margin: 0.75rem 0 1.75rem; line-height: 1.6;">${badgeDesc}</p>
                <button class="btn btn-gold" onclick="closeBadgeModal()" style="width: 100%; font-size: 1.05rem;">
                    <i class="fa-solid fa-sparkles"></i> Awesome!
                </button>
            </div>
        `;
        document.body.appendChild(overlay);
    } else {
        document.getElementById('modalBadgeName').textContent = badgeName;
        document.getElementById('modalBadgeDesc').textContent = badgeDesc;
        document.getElementById('modalBadgeIcon').className = `fa-solid ${iconClass || 'fa-award'}`;
    }

    setTimeout(() => {
        overlay.classList.add('active');
        if (window.triggerConfetti) window.triggerConfetti();
    }, 100);
}

function closeBadgeModal() {
    const overlay = document.getElementById('badgeModalOverlay');
    if (overlay) overlay.classList.remove('active');
}

window.showBadgeUnlockPopup = showBadgeUnlockPopup;
window.closeBadgeModal = closeBadgeModal;
