// Quality of Life Enhancements
// Makes the app more intuitive and pleasant to use

// ===== TAB MEMORY =====
// Remember which tab the user was on

function rememberLastTab() {
    // Save current tab when switching
    const originalSwitchTab = window.switchTab;
    window.switchTab = function(tabName) {
        localStorage.setItem('lastActiveTab', tabName);
        return originalSwitchTab.call(this, tabName);
    };
    
    // Restore last tab on page load
    const lastTab = localStorage.getItem('lastActiveTab');
    if (lastTab && lastTab !== 'nutrition') {
        setTimeout(() => {
            const currentUser = getCurrentUser();
            if (currentUser) {
                // Only restore if user has access to that tab
                if (lastTab === 'goals' && currentUser.tier !== 'FREE') {
                    switchTab(lastTab);
                } else if (lastTab === 'workouts' && currentUser.tier === 'ELITE') {
                    switchTab(lastTab);
                } else if (lastTab === 'pricing' || lastTab === 'nutrition') {
                    switchTab(lastTab);
                }
            }
        }, 200);
    }
}

// ===== KEYBOARD SHORTCUTS =====
// Enter key to submit forms, Escape to close modals

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Enter key on login form
        if (e.key === 'Enter' && document.activeElement.closest('.auth-form')) {
            const form = document.activeElement.closest('.auth-form');
            if (form.id === 'loginForm') {
                e.preventDefault();
                handleLogin();
            } else if (form.id === 'registerForm') {
                e.preventDefault();
                handleRegister();
            }
        }
        
        // Enter key on nutrition input
        if (e.key === 'Enter' && document.activeElement.id === 'sugarInput') {
            e.preventDefault();
            addNutritionEntry();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal, #authModal');
            modals.forEach(modal => {
                if (modal.style.display === 'flex' || modal.style.display === 'block') {
                    modal.style.display = 'none';
                }
            });
        }
    });
}

// ===== BETTER DATE DISPLAYS =====
// Show "Today", "Yesterday" instead of dates

function formatFriendlyDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        const daysAgo = Math.floor((today - date) / (1000 * 60 * 60 * 24));
        if (daysAgo < 7) {
            return `${daysAgo} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
}

// ===== QUICK ACTIONS =====

function duplicateLastEntry() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const storageKey = `nutrition_${currentUser.email}`;
    const entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    if (entries.length === 0) {
        alert('No entries to duplicate yet!');
        return;
    }
    
    const lastEntry = entries[entries.length - 1];
    
    // Fill in the form with last entry's values
    document.getElementById('caloriesInput').value = lastEntry.calories;
    document.getElementById('proteinInput').value = lastEntry.protein;
    document.getElementById('carbsInput').value = lastEntry.carbs;
    document.getElementById('sugarInput').value = lastEntry.sugar;
    
    // Highlight the inputs
    const inputs = ['caloriesInput', 'proteinInput', 'carbsInput', 'sugarInput'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.style.background = 'rgba(0, 255, 136, 0.1)';
            setTimeout(() => {
                input.style.background = '';
            }, 1000);
        }
    });
    
    showSuccessMessage('Last entry loaded! Edit and save.');
}

function undoLastEntry() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const storageKey = `nutrition_${currentUser.email}`;
    const entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    if (entries.length === 0) {
        alert('No entries to undo!');
        return;
    }
    
    const lastEntry = entries[entries.length - 1];
    
    if (confirm(`Delete this entry?\n\nCal: ${lastEntry.calories}, Protein: ${lastEntry.protein}g, Carbs: ${lastEntry.carbs}g, Sugar: ${lastEntry.sugar}g`)) {
        // Remove last entry
        entries.pop();
        localStorage.setItem(storageKey, JSON.stringify(entries));
        
        // Remove from Firebase
        if (isFirebaseReady() && currentUser.uid) {
            firebase.database().ref('users/' + currentUser.uid + '/nutrition/' + lastEntry.id).remove();
        }
        
        // Reload data
        loadNutritionData();
        updateGoalProgress();
        
        showSuccessMessage('Entry deleted!');
    }
}

// ===== QUICK GUIDE MODAL =====

function showQuickGuide() {
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
            border-radius: 20px;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--color-border);
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="margin: 0; color: var(--color-text);">📚 Quick Guide</h2>
                <button onclick="this.closest('div').parentElement.remove()" style="
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--color-text-secondary);
                    padding: 0.5rem;
                ">✕</button>
            </div>
            
            <div style="color: var(--color-text); line-height: 1.6;">
                <h3 style="color: var(--color-primary); margin-top: 1.5rem; margin-bottom: 0.75rem;">⌨️ Keyboard Shortcuts</h3>
                <div style="background: var(--color-surface); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <p><kbd style="background: var(--color-bg); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: monospace;">Enter</kbd> - Submit forms (login, nutrition entry)</p>
                    <p><kbd style="background: var(--color-bg); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: monospace;">Esc</kbd> - Close modals</p>
                    <p><kbd style="background: var(--color-bg); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: monospace;">Tab</kbd> - Navigate between inputs</p>
                    <p><kbd style="background: var(--color-bg); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: monospace;">↑↓</kbd> - Increment/decrement numbers</p>
                    <p><kbd style="background: var(--color-bg); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: monospace;">Scroll</kbd> - Adjust number values (when focused)</p>
                </div>
                
                <h3 style="color: var(--color-primary); margin-top: 1.5rem; margin-bottom: 0.75rem;">⚡ Quick Actions</h3>
                <div style="background: var(--color-surface); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <p><strong>🔄 Duplicate Last</strong> - Copies your last nutrition entry to the form for quick re-entry</p>
                    <p><strong>↩️ Undo Last</strong> - Deletes your most recent nutrition entry</p>
                    <p><strong>📥 Export Data</strong> - Downloads all your data as a JSON file for backup</p>
                </div>
                
                <h3 style="color: var(--color-primary); margin-top: 1.5rem; margin-bottom: 0.75rem;">🍽️ Quick Add Foods</h3>
                <div style="background: var(--color-surface); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <p>Click the quick food buttons to instantly fill in common food macros:</p>
                    <p>🍗 Chicken, 🥤 Protein Shake, 🥣 Greek Yogurt, 🐟 Salmon, 🍠 Sweet Potato, 🍚 Rice</p>
                    <p style="color: var(--color-text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">You can edit the values before adding!</p>
                </div>
                
                <h3 style="color: var(--color-primary); margin-top: 1.5rem; margin-bottom: 0.75rem;">💡 Tips</h3>
                <div style="background: var(--color-surface); padding: 1rem; border-radius: 8px;">
                    <p>✓ Check nutrition labels on food packaging for accurate macros</p>
                    <p>✓ Your data syncs to the cloud automatically (when logged in)</p>
                    <p>✓ Tab is saved - you'll return to the last tab you used</p>
                    <p>✓ Upgrade to PRO ($5) for personalized goals and meal planning</p>
                    <p>✓ ELITE tier ($20) includes complete workout programs with tracker</p>
                </div>
            </div>
            
            <button onclick="this.closest('div').parentElement.remove()" style="
                width: 100%;
                margin-top: 1.5rem;
                padding: 1rem;
                background: linear-gradient(135deg, var(--color-primary), #00dd77);
                color: var(--color-bg);
                border: none;
                border-radius: 10px;
                font-weight: 700;
                font-size: 1rem;
                cursor: pointer;
            ">Got it! 👍</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

window.showQuickGuide = showQuickGuide;

// ===== EXPORT DATA ====

function exportUserData() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Please log in to export your data');
        return;
    }
    
    // Gather all user data
    const exportData = {
        user: {
            email: currentUser.email,
            tier: currentUser.tier,
            exportedAt: new Date().toISOString()
        },
        nutrition: JSON.parse(localStorage.getItem(`nutrition_${currentUser.email}`) || '[]'),
        goals: JSON.parse(localStorage.getItem(`goals_${currentUser.email}`) || '{}'),
        profile: JSON.parse(localStorage.getItem(`profile_${currentUser.email}`) || 'null'),
        workouts: JSON.parse(localStorage.getItem(`workout_week_${currentUser.email}`) || '{}'),
        prs: JSON.parse(localStorage.getItem(`prs_${currentUser.email}`) || '{}'),
        measurements: JSON.parse(localStorage.getItem(`measurements_${currentUser.email}`) || '[]')
    };
    
    // Create downloadable JSON file
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `FitPlannerPro_Data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSuccessMessage('Data exported successfully! 📥');
}

// ===== AUTO-FOCUS INPUTS =====

function setupAutoFocus() {
    // Auto-focus first input when auth modal opens
    const authModal = document.getElementById('authModal');
    if (authModal) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'style' && authModal.style.display === 'flex') {
                    setTimeout(() => {
                        const firstInput = authModal.querySelector('input:not([disabled])');
                        if (firstInput) firstInput.focus();
                    }, 100);
                }
            });
        });
        observer.observe(authModal, { attributes: true });
    }
    
    // Focus first empty input in nutrition form
    document.querySelectorAll('.input-group input').forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const inputs = Array.from(document.querySelectorAll('.input-group input'));
                const currentIndex = inputs.indexOf(this);
                if (currentIndex < inputs.length - 1) {
                    e.preventDefault();
                    inputs[currentIndex + 1].focus();
                }
            }
        });
    });
}

// ===== NUMBER INPUT IMPROVEMENTS =====

function enhanceNumberInputs() {
    document.querySelectorAll('input[type="number"]').forEach(input => {
        // Add step buttons for easier increment/decrement
        if (!input.hasAttribute('data-enhanced')) {
            input.setAttribute('data-enhanced', 'true');
            
            // Scroll to increment/decrement
            input.addEventListener('wheel', function(e) {
                if (document.activeElement === this) {
                    e.preventDefault();
                    const step = parseFloat(this.step) || 1;
                    const current = parseFloat(this.value) || 0;
                    if (e.deltaY < 0) {
                        this.value = current + step;
                    } else {
                        this.value = Math.max(0, current - step);
                    }
                    this.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
            
            // Up/Down arrows
            input.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const step = parseFloat(this.step) || 1;
                    const current = parseFloat(this.value) || 0;
                    if (e.key === 'ArrowUp') {
                        this.value = current + step;
                    } else {
                        this.value = Math.max(0, current - step);
                    }
                }
            });
        }
    });
}

// ===== OFFLINE INDICATOR =====

function setupOfflineIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'offlineIndicator';
    indicator.style.cssText = `
        position: fixed;
        top: 70px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--color-warning);
        color: var(--color-bg);
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        display: none;
        animation: slideInDown 0.3s ease;
    `;
    indicator.innerHTML = '⚠️ Offline - Data will sync when reconnected';
    document.body.appendChild(indicator);
    
    // Check online/offline status
    function updateOnlineStatus() {
        if (!navigator.onLine) {
            indicator.style.display = 'block';
        } else {
            indicator.style.display = 'none';
        }
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
}

// ===== QUICK ADD COMMON FOODS =====

function addQuickFoodButtons() {
    const container = document.querySelector('.input-grid');
    if (!container) return;
    
    const quickFoods = document.createElement('div');
    quickFoods.style.cssText = `
        grid-column: 1 / -1;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--color-border);
    `;
    
    quickFoods.innerHTML = `
        <div style="margin-bottom: 0.5rem; color: var(--color-text-secondary); font-size: 0.9rem;">
            ⚡ Quick Add:
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button onclick="quickAddFood(165, 31, 0, 0)" class="quick-food-btn" title="Chicken Breast">🍗 Chicken</button>
            <button onclick="quickAddFood(120, 25, 3, 1)" class="quick-food-btn" title="Protein Shake">🥤 Shake</button>
            <button onclick="quickAddFood(150, 15, 20, 10)" class="quick-food-btn" title="Greek Yogurt">🥣 Yogurt</button>
            <button onclick="quickAddFood(280, 40, 0, 0)" class="quick-food-btn" title="Salmon">🐟 Salmon</button>
            <button onclick="quickAddFood(180, 4, 41, 12)" class="quick-food-btn" title="Sweet Potato">🍠 Potato</button>
            <button onclick="quickAddFood(220, 5, 46, 1)" class="quick-food-btn" title="Rice">🍚 Rice</button>
        </div>
    `;
    
    container.appendChild(quickFoods);
}

window.quickAddFood = function(cal, pro, carb, sug) {
    document.getElementById('caloriesInput').value = cal;
    document.getElementById('proteinInput').value = pro;
    document.getElementById('carbsInput').value = carb;
    document.getElementById('sugarInput').value = sug;
    
    // Highlight the inputs
    const inputs = ['caloriesInput', 'proteinInput', 'carbsInput', 'sugarInput'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.style.background = 'rgba(0, 255, 136, 0.1)';
            setTimeout(() => input.style.background = '', 800);
        }
    });
};

// ===== QUICK ACTION BUTTONS =====

function addQuickActionButtons() {
    const nutritionTab = document.getElementById('nutritionTab');
    if (!nutritionTab) return;
    
    const summaryCard = nutritionTab.querySelector('.summary-card');
    if (!summaryCard) return;
    
    const actionsDiv = document.createElement('div');
    actionsDiv.style.cssText = `
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--color-border);
    `;
    
    actionsDiv.innerHTML = `
        <button onclick="duplicateLastEntry()" class="quick-action-btn" title="Copy last entry to form">
            🔄 Duplicate Last
        </button>
        <button onclick="undoLastEntry()" class="quick-action-btn" title="Delete most recent entry">
            ↩️ Undo Last
        </button>
        <button onclick="exportUserData()" class="quick-action-btn" title="Download all your data">
            📥 Export Data
        </button>
    `;
    
    summaryCard.appendChild(actionsDiv);
}

// ===== PROGRESS PERCENTAGE DISPLAYS =====

function enhanceProgressBars() {
    // This will be called after updateGoalProgress runs
    setInterval(() => {
        document.querySelectorAll('.progress-bar').forEach(bar => {
            const fill = bar.querySelector('.progress-fill');
            if (fill) {
                const width = parseFloat(fill.style.width) || 0;
                if (width > 0 && !bar.querySelector('.progress-percentage')) {
                    const percentage = document.createElement('span');
                    percentage.className = 'progress-percentage';
                    percentage.textContent = Math.round(width) + '%';
                    percentage.style.cssText = `
                        position: absolute;
                        right: 8px;
                        top: 50%;
                        transform: translateY(-50%);
                        font-size: 0.75rem;
                        font-weight: 700;
                        color: var(--color-bg);
                        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                    `;
                    bar.style.position = 'relative';
                    bar.appendChild(percentage);
                }
            }
        });
    }, 1000);
}

// ===== CONFIRMATION BEFORE DATA LOSS =====

function enhanceClearButton() {
    const originalClear = window.clearTodayEntries;
    if (originalClear) {
        window.clearTodayEntries = function() {
            const currentUser = getCurrentUser();
            const storageKey = `nutrition_${currentUser.email}`;
            const entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
            
            const today = new Date().toDateString();
            const todayEntries = entries.filter(entry => 
                new Date(entry.date).toDateString() === today
            );
            
            if (todayEntries.length === 0) {
                alert('No entries to clear today!');
                return;
            }
            
            const totalCals = todayEntries.reduce((sum, e) => sum + e.calories, 0);
            
            if (confirm(`⚠️ Delete ${todayEntries.length} entries (${totalCals} calories)?\n\nThis cannot be undone!`)) {
                originalClear.call(this);
            }
        };
    }
}

// ===== ADD QOL STYLES =====

const qolStyles = document.createElement('style');
qolStyles.textContent = `
    .quick-food-btn {
        padding: 0.5rem 1rem;
        background: var(--color-surface);
        border: 2px solid var(--color-border);
        border-radius: 8px;
        color: var(--color-text);
        font-size: 0.85rem;
        cursor: pointer;
        transition: var(--transition-smooth);
    }
    
    .quick-food-btn:hover {
        background: var(--color-primary);
        color: var(--color-bg);
        border-color: var(--color-primary);
        transform: translateY(-2px);
    }
    
    .quick-action-btn {
        flex: 1;
        padding: 0.625rem 1rem;
        background: var(--color-surface-elevated);
        border: 2px solid var(--color-border);
        border-radius: 8px;
        color: var(--color-text);
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: var(--transition-smooth);
    }
    
    .quick-action-btn:hover {
        background: var(--color-primary);
        color: var(--color-bg);
        border-color: var(--color-primary);
        transform: translateY(-2px);
    }
    
    @keyframes slideInDown {
        from {
            transform: translate(-50%, -100%);
        }
        to {
            transform: translate(-50%, 0);
        }
    }
    
    /* Smooth scrolling */
    html {
        scroll-behavior: smooth;
    }
    
    /* Better focus indicators */
    input:focus, select:focus, button:focus {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
    }
    
    /* Loading skeleton for entries */
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    
    .skeleton {
        background: linear-gradient(90deg, var(--color-surface) 25%, var(--color-surface-elevated) 50%, var(--color-surface) 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 8px;
    }
`;
document.head.appendChild(qolStyles);

// ===== INITIALIZE ALL QOL FEATURES =====

function initializeQOL() {
    console.log('🎨 Initializing Quality of Life enhancements...');
    
    setTimeout(() => {
        rememberLastTab();
        setupKeyboardShortcuts();
        setupAutoFocus();
        enhanceNumberInputs();
        setupOfflineIndicator();
        addQuickFoodButtons();
        addQuickActionButtons();
        enhanceProgressBars();
        enhanceClearButton();
        
        console.log('✅ QOL enhancements ready!');
    }, 500);
}

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeQOL);
} else {
    initializeQOL();
}

// Export functions
window.duplicateLastEntry = duplicateLastEntry;
window.undoLastEntry = undoLastEntry;
window.exportUserData = exportUserData;
window.formatFriendlyDate = formatFriendlyDate;
