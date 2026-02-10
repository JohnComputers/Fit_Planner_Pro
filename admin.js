// Admin Controls
// Hidden keyboard shortcut for tier management: CTRL + SHIFT + A

// Track key presses
let keysPressed = {
    ctrl: false,
    shift: false,
    a: false
};

// Listen for admin shortcut
document.addEventListener('keydown', function(event) {
    // Track CTRL key
    if (event.key === 'Control') {
        keysPressed.ctrl = true;
    }
    
    // Track SHIFT key
    if (event.key === 'Shift') {
        keysPressed.shift = true;
    }
    
    // Track A key
    if (event.key === 'a' || event.key === 'A') {
        keysPressed.a = true;
    }
    
    // Check if all keys are pressed
    if (keysPressed.ctrl && keysPressed.shift && keysPressed.a) {
        event.preventDefault();
        openAdminPanel();
        resetKeys();
    }
});

// Reset key tracking on key up
document.addEventListener('keyup', function(event) {
    if (event.key === 'Control') {
        keysPressed.ctrl = false;
    }
    if (event.key === 'Shift') {
        keysPressed.shift = false;
    }
    if (event.key === 'a' || event.key === 'A') {
        keysPressed.a = false;
    }
});

// Reset all keys
function resetKeys() {
    keysPressed = {
        ctrl: false,
        shift: false,
        a: false
    };
}

// Open admin panel
function openAdminPanel() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        console.log('No user logged in');
        return;
    }
    
    // ONLY allow admin access for random111199@gmail.com
    if (currentUser.email !== 'random111199@gmail.com') {
        console.log('Admin access denied');
        return;
    }
    
    // Create admin modal
    const modal = document.createElement('div');
    modal.id = 'adminModal';
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
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: var(--color-surface-elevated);
            border-radius: 20px;
            padding: 3rem;
            max-width: 500px;
            width: 90%;
            box-shadow: var(--shadow-lg);
            border: 2px solid var(--color-accent);
            animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        ">
            <div style="text-align: center; margin-bottom: 2rem;">
                <h2 style="
                    font-family: 'Archivo Black', sans-serif;
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                    color: var(--color-accent);
                ">
                    🔧 Admin Panel
                </h2>
                <p style="color: var(--color-text-secondary); font-size: 0.9rem;">
                    For testing and support purposes only
                </p>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <div style="
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: 10px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                ">
                    <div style="color: var(--color-text-secondary); font-size: 0.85rem; margin-bottom: 0.25rem;">
                        Current User
                    </div>
                    <div style="color: var(--color-text); font-weight: 600;">
                        ${currentUser.email}
                    </div>
                </div>
                
                <div style="
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: 10px;
                    padding: 1rem;
                ">
                    <div style="color: var(--color-text-secondary); font-size: 0.85rem; margin-bottom: 0.25rem;">
                        Current Tier
                    </div>
                    <div style="color: var(--color-primary); font-weight: 700; font-size: 1.25rem;">
                        ${currentUser.tier}
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <label style="
                    display: block;
                    color: var(--color-text-secondary);
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin-bottom: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                ">
                    Set Tier Override
                </label>
                <div style="display: grid; gap: 0.75rem;">
                    <button onclick="setAdminTier('FREE')" style="
                        padding: 0.875rem;
                        background: var(--color-surface);
                        color: var(--color-text);
                        border: 2px solid var(--color-border);
                        border-radius: 10px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                    " onmouseover="this.style.borderColor='var(--color-text)'" onmouseout="this.style.borderColor='var(--color-border)'">
                        FREE Tier
                    </button>
                    
                    <button onclick="setAdminTier('PRO')" style="
                        padding: 0.875rem;
                        background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 221, 119, 0.1));
                        color: var(--color-primary);
                        border: 2px solid var(--color-primary);
                        border-radius: 10px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.2s;
                    " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                        PRO Tier (Basic Pack)
                    </button>
                    
                    <button onclick="setAdminTier('STANDARD')" style="
                        padding: 0.875rem;
                        background: linear-gradient(135deg, rgba(51, 102, 255, 0.1), rgba(102, 153, 255, 0.1));
                        color: #6699ff;
                        border: 2px solid #6699ff;
                        border-radius: 10px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.2s;
                    " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                        STANDARD Tier (Standard Pack)
                    </button>
                    
                    <button onclick="setAdminTier('ELITE')" style="
                        padding: 0.875rem;
                        background: linear-gradient(135deg, rgba(255, 51, 102, 0.1), rgba(255, 102, 153, 0.1));
                        color: var(--color-accent);
                        border: 2px solid var(--color-accent);
                        border-radius: 10px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.2s;
                    " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                        ELITE Tier (Premium Pack)
                    </button>
                </div>
            </div>
            
            <div style="
                background: rgba(255, 170, 0, 0.1);
                border: 1px solid var(--color-warning);
                border-radius: 10px;
                padding: 1rem;
                margin-bottom: 1.5rem;
            ">
                <div style="color: var(--color-warning); font-size: 0.85rem; font-weight: 600; margin-bottom: 0.25rem;">
                    ⚠️ Warning
                </div>
                <div style="color: var(--color-text-secondary); font-size: 0.85rem;">
                    This panel is for testing and support only. Changes are stored locally.
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem;">
                <button onclick="closeAdminPanel()" style="
                    flex: 1;
                    padding: 0.875rem;
                    background: var(--color-surface);
                    color: var(--color-text);
                    border: 2px solid var(--color-border);
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                ">
                    Close
                </button>
                
                <button onclick="clearAllData()" style="
                    flex: 1;
                    padding: 0.875rem;
                    background: transparent;
                    color: var(--color-accent);
                    border: 2px solid var(--color-accent);
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                ">
                    Clear All Data
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Close admin panel
function closeAdminPanel() {
    const modal = document.getElementById('adminModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

// Set tier via admin panel
function setAdminTier(tier) {
    updateUserTier(tier);
    
    // Show confirmation
    const confirmEl = document.createElement('div');
    confirmEl.textContent = `Tier updated to ${tier}`;
    confirmEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--color-primary), #00dd77);
        color: var(--color-bg);
        padding: 1rem 1.5rem;
        border-radius: 10px;
        font-weight: 600;
        box-shadow: var(--shadow-lg);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(confirmEl);
    
    setTimeout(() => {
        confirmEl.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => confirmEl.remove(), 300);
    }, 2000);
    
    // Close admin panel after short delay
    setTimeout(() => closeAdminPanel(), 500);
}

// Clear all local data
function clearAllData() {
    if (!confirm('⚠️ WARNING: This will delete ALL data including:\n\n• All user accounts\n• All nutrition entries\n• All goals\n• All settings\n\nThis action cannot be undone!\n\nAre you absolutely sure?')) {
        return;
    }
    
    if (!confirm('Final confirmation: Delete everything?')) {
        return;
    }
    
    // Clear all localStorage
    localStorage.clear();
    
    alert('All data has been cleared. The page will now reload.');
    
    // Reload page
    window.location.reload();
}

// Add fadeOut animation
const adminStyle = document.createElement('style');
adminStyle.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(adminStyle);

// Admin panel available only for authorized email (random111199@gmail.com)
