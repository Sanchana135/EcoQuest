// EcoQuest Dashboard & Interactive Gamification Handlers

document.addEventListener('DOMContentLoaded', () => {
    // 1. Claim Daily Login Reward
    const claimDailyRewardBtn = document.getElementById('claimDailyRewardBtn');
    if (claimDailyRewardBtn) {
        claimDailyRewardBtn.addEventListener('click', async () => {
            claimDailyRewardBtn.disabled = true;
            claimDailyRewardBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Claiming...';

            try {
                const res = await fetch('/claim_daily_reward', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                const data = await res.json();

                if (data.success) {
                    claimDailyRewardBtn.className = 'btn btn-secondary btn-sm';
                    claimDailyRewardBtn.disabled = true;
                    claimDailyRewardBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Claimed Today';

                    alert(`🎁 ${data.message}`);

                    if (window.triggerConfetti) window.triggerConfetti();

                    // Update displays
                    updateUserStatsDisplay(data);

                    if (data.unlocked_badges && data.unlocked_badges.length > 0) {
                        const b = data.unlocked_badges[0];
                        if (window.showBadgeUnlockPopup) {
                            window.showBadgeUnlockPopup(b.name, b.description, b.icon_class);
                        }
                    }
                } else {
                    alert(data.message || 'Reward already claimed.');
                }
            } catch (err) {
                console.error('Error claiming daily reward:', err);
                claimDailyRewardBtn.disabled = false;
                claimDailyRewardBtn.innerHTML = '<i class="fa-solid fa-gift"></i> Claim Daily Reward';
            }
        });
    }

    // 2. Claim Mission Reward
    const claimMissionBtns = document.querySelectorAll('.claim-mission-btn');
    claimMissionBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const missionId = btn.getAttribute('data-mission-id');
            if (!missionId) return;

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

            try {
                const res = await fetch(`/claim_mission/${missionId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                const data = await res.json();

                if (data.success) {
                    btn.className = 'btn btn-secondary btn-sm';
                    btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Claimed';

                    alert(`🎯 ${data.message}`);
                    if (window.triggerConfetti) window.triggerConfetti();

                    updateUserStatsDisplay(data);

                    if (data.unlocked_badges && data.unlocked_badges.length > 0) {
                        const b = data.unlocked_badges[0];
                        if (window.showBadgeUnlockPopup) {
                            window.showBadgeUnlockPopup(b.name, b.description, b.icon_class);
                        }
                    }
                } else {
                    btn.disabled = false;
                    btn.innerHTML = 'Claim';
                    alert(data.message);
                }
            } catch (err) {
                console.error('Error claiming mission:', err);
                btn.disabled = false;
                btn.innerHTML = 'Claim';
            }
        });
    });

    // 3. Claim Eco Tip
    const claimTipBtns = document.querySelectorAll('.claim-tip-btn');
    claimTipBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const tipId = btn.getAttribute('data-tip-id');
            if (!tipId) return;

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Claiming...';

            try {
                const response = await fetch(`/eco_tips/complete/${tipId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                const data = await response.json();

                if (data.success) {
                    btn.className = 'btn btn-secondary btn-sm';
                    btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Completed';
                    
                    alert(`🌱 ${data.message}`);
                    if (window.triggerConfetti) window.triggerConfetti();

                    updateUserStatsDisplay(data);

                    if (data.unlocked_badges && data.unlocked_badges.length > 0) {
                        const b = data.unlocked_badges[0];
                        if (window.showBadgeUnlockPopup) {
                            window.showBadgeUnlockPopup(b.name, b.description, b.icon_class);
                        }
                    }
                } else {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fa-solid fa-check"></i> Complete Action';
                    alert(data.message || 'Error completing eco tip.');
                }
            } catch (err) {
                console.error('Error claiming eco tip:', err);
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Complete Action';
            }
        });
    });

    function updateUserStatsDisplay(data) {
        if (data.new_xp !== undefined) {
            const xpEl = document.getElementById('userXpVal');
            if (xpEl) xpEl.textContent = data.new_xp;
        }
        if (data.new_coins !== undefined) {
            const coinEls = document.querySelectorAll('.userCoinVal');
            coinEls.forEach(el => el.textContent = data.new_coins);
        }
        if (data.new_level !== undefined) {
            const lvlEl = document.getElementById('userLevelVal');
            if (lvlEl) lvlEl.textContent = data.new_level;
        }
    }
});
