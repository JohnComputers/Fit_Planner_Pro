// Fool-Proof UX Enhancements
// Improves user experience with helpful messages, validation, and guidance

// ===== LOADING STATES =====

function showLoading(message = 'Loading...') {
    const loader = document.createElement('div');
    loader.id = 'globalLoader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 14, 19, 0.95);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        animation: fadeIn 0.2s ease;
    `;
    
    loader.innerHTML = `
        <div style="text-align: center;">
            <div class="spinner"></div>
            <p style="color: var(--color-text); margin-top: 1rem; font-size: 1.1rem;">${message}</p>
        </div>
    `;
    
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('globalLoader');
    if (loader) {
        loader.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => loader.remove(), 200);
    }
}

// ===== CONFIRMATION DIALOGS =====

function confirmDialog(message, onConfirm, onCancel) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 14, 19, 0.95);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: var(--color-surface-elevated);
            border-radius: 16px;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--color-border);
        ">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
            <p style="color: var(--color-text); font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem;">
                ${message}
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="cancelBtn" style="
                    padding: 0.875rem 2rem;
                    background: var(--color-surface);
                    color: var(--color-text);
                    border: 2px solid var(--color-border);
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--transition-smooth);
                ">Cancel</button>
                <button id="confirmBtn" style="
                    padding: 0.875rem 2rem;
                    background: linear-gradient(135deg, var(--color-primary), #00dd77);
                    color: var(--color-bg);
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--transition-smooth);
                ">Confirm</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('confirmBtn').onclick = () => {
        modal.remove();
        if (onConfirm) onConfirm();
    };
    
    document.getElementById('cancelBtn').onclick = () => {
        modal.remove();
        if (onCancel) onCancel();
    };
}

// ===== HELPFUL TOOLTIPS =====

function showTooltip(element, message, duration = 3000) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-message';
    tooltip.textContent = message;
    tooltip.style.cssText = `
        position: absolute;
        background: var(--color-surface-elevated);
        color: var(--color-text);
        padding: 0.75rem 1rem;
        border-radius: 8px;
        font-size: 0.9rem;
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--color-border);
        z-index: 1000;
        max-width: 250px;
        animation: fadeInUp 0.3s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
    
    setTimeout(() => {
        tooltip.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => tooltip.remove(), 300);
    }, duration);
}

// ===== FORM VALIDATION WITH HELPFUL MESSAGES =====

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showFieldError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    // Remove existing error
    const existingError = input.parentElement.querySelector('.field-error');
    if (existingError) existingError.remove();
    
    // Add error styling
    input.style.borderColor = 'var(--color-accent)';
    
    // Create error message
    const error = document.createElement('div');
    error.className = 'field-error';
    error.textContent = message;
    error.style.cssText = `
        color: var(--color-accent);
        font-size: 0.85rem;
        margin-top: 0.5rem;
        animation: fadeInUp 0.3s ease;
    `;
    
    input.parentElement.appendChild(error);
    
    // Remove error on input
    input.addEventListener('input', function() {
        this.style.borderColor = '';
        const errorEl = this.parentElement.querySelector('.field-error');
        if (errorEl) errorEl.remove();
    }, { once: true });
}

// ===== EMPTY STATE MESSAGES =====

function showEmptyState(containerId, icon, title, message, actionText, actionCallback) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div style="
            text-align: center;
            padding: 3rem 2rem;
            color: var(--color-text-secondary);
        ">
            <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;">${icon}</div>
            <h3 style="color: var(--color-text); margin-bottom: 0.5rem; font-size: 1.5rem;">${title}</h3>
            <p style="margin-bottom: 2rem; line-height: 1.6;">${message}</p>
            ${actionText ? `
                <button onclick="${actionCallback}" style="
                    padding: 0.875rem 2rem;
                    background: linear-gradient(135deg, var(--color-primary), #00dd77);
                    color: var(--color-bg);
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--transition-smooth);
                ">${actionText}</button>
            ` : ''}
        </div>
    `;
}

// ===== SUCCESS ANIMATIONS =====

function celebrateSuccess(message) {
    const celebration = document.createElement('div');
    celebration.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, var(--color-primary), #00dd77);
        color: var(--color-bg);
        padding: 2rem 3rem;
        border-radius: 20px;
        font-size: 1.5rem;
        font-weight: 700;
        text-align: center;
        z-index: 10000;
        box-shadow: 0 0 50px rgba(0, 255, 136, 0.5);
        animation: celebrationPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    celebration.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
        ${message}
    `;
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        celebration.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => celebration.remove(), 300);
    }, 2000);
}

// ===== PROGRESS INDICATORS =====

function showProgressBar(message, progress = 0) {
    let progressEl = document.getElementById('globalProgress');
    
    if (!progressEl) {
        progressEl = document.createElement('div');
        progressEl.id = 'globalProgress';
        progressEl.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--color-surface-elevated);
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--color-border);
            min-width: 300px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        document.body.appendChild(progressEl);
    }
    
    progressEl.innerHTML = `
        <p style="color: var(--color-text); margin-bottom: 0.75rem; font-weight: 600;">${message}</p>
        <div style="
            width: 100%;
            height: 8px;
            background: var(--color-surface);
            border-radius: 4px;
            overflow: hidden;
        ">
            <div style="
                width: ${progress}%;
                height: 100%;
                background: linear-gradient(90deg, var(--color-primary), #00dd77);
                transition: width 0.3s ease;
                border-radius: 4px;
            "></div>
        </div>
        <p style="color: var(--color-text-secondary); margin-top: 0.5rem; font-size: 0.85rem;">${progress}% complete</p>
    `;
}

function hideProgressBar() {
    const progressEl = document.getElementById('globalProgress');
    if (progressEl) {
        progressEl.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => progressEl.remove(), 300);
    }
}

// ===== HELPFUL FIRST-TIME USER TIPS =====

function showFirstTimeTip(key, message, duration = 5000) {
    // Check if user has seen this tip
    if (localStorage.getItem(`tip_seen_${key}`)) return;
    
    const tip = document.createElement('div');
    tip.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, var(--color-primary), #00dd77);
        color: var(--color-bg);
        padding: 1rem 2rem;
        border-radius: 12px;
        font-size: 0.95rem;
        max-width: 500px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInUp 0.3s ease;
        display: flex;
        align-items: center;
        gap: 1rem;
    `;
    
    tip.innerHTML = `
        <span style="font-size: 1.5rem;">💡</span>
        <span style="flex: 1;">${message}</span>
        <button onclick="this.parentElement.remove(); localStorage.setItem('tip_seen_${key}', 'true');" style="
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
        ">Got it!</button>
    `;
    
    document.body.appendChild(tip);
    
    setTimeout(() => {
        if (tip.parentElement) {
            tip.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => tip.remove(), 300);
            localStorage.setItem(`tip_seen_${key}`, 'true');
        }
    }, duration);
}

// ===== ADD ANIMATIONS CSS =====

const uxStyles = document.createElement('style');
uxStyles.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInUp {
        from {
            transform: translate(-50%, 100%);
        }
        to {
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes celebrationPop {
        0% {
            transform: translate(-50%, -50%) scale(0);
        }
        50% {
            transform: translate(-50%, -50%) scale(1.1);
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid var(--color-surface);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(uxStyles);

// ===== EXPORT FUNCTIONS =====

window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.confirmDialog = confirmDialog;
window.showTooltip = showTooltip;
window.validateEmail = validateEmail;
window.showFieldError = showFieldError;
window.showEmptyState = showEmptyState;
window.celebrateSuccess = celebrateSuccess;
window.showProgressBar = showProgressBar;
window.hideProgressBar = hideProgressBar;
window.showFirstTimeTip = showFirstTimeTip;

// ===== APPLY UX IMPROVEMENTS ON LOAD =====

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = getCurrentUser();
    
    // Show first-time tips
    if (currentUser && currentUser.tier === 'FREE') {
        setTimeout(() => {
            showFirstTimeTip('upgrade', 'Upgrade to unlock personalized nutrition goals and meal planning! 🎯');
        }, 3000);
    }
    
    // Add helpful placeholder animations
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });
});
