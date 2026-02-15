// Payments System
// Handles tier unlocking via Square payment link redirects

// Check for unlock parameter on page load
document.addEventListener('DOMContentLoaded', function() {
    checkUnlockParameter();
});

// Check URL for unlock parameter
function checkUnlockParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    const unlockTier = urlParams.get('unlock');
    
    if (unlockTier) {
        console.log('🎉 Payment detected! Tier:', unlockTier);
        
        // Save to localStorage IMMEDIATELY (before Firebase loads)
        const pendingUnlock = {
            tier: unlockTier.toUpperCase(),
            timestamp: Date.now()
        };
        localStorage.setItem('pendingUnlock', JSON.stringify(pendingUnlock));
        
        // Handle unlock
        handleUnlock(unlockTier.toUpperCase());
        
        // Clean URL (remove parameter)
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }
}

// Handle tier unlock
function handleUnlock(tier) {
    const validTiers = ['PRO', 'STANDARD', 'ELITE'];
    
    if (!validTiers.includes(tier)) {
        console.error('Invalid tier:', tier);
        return;
    }
    
    console.log('💰 Processing payment unlock for tier:', tier);
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.log('⚠️ No user logged in yet - tier will be applied after login');
        // Tier is already saved in pendingUnlock, will be applied on login
        alert('Please create an account or login to complete your purchase and unlock features.');
        return;
    }
    
    console.log('👤 Current user:', currentUser.email);
    console.log('📊 Current tier:', currentUser.tier);
    
    // Map payment tiers to app tiers
    let appTier = tier;
    if (tier === 'PRO') {
        appTier = 'PRO'; // Basic Pack
    } else if (tier === 'STANDARD') {
        appTier = 'STANDARD'; // Standard Pack
    } else if (tier === 'ELITE') {
        appTier = 'ELITE'; // Premium Pack
    }
    
    console.log('🔄 Updating to tier:', appTier);
    
    // Update user tier with force flag
    updateUserTier(appTier, true); // true = force update
    
    // Clear pending unlock since we processed it
    localStorage.removeItem('pendingUnlock');
    
    console.log('✅ Tier update complete');
    
    // Show success message THEN trigger personalization survey
    showUnlockSuccess(appTier);
    
    // Trigger personalization survey after a short delay
    setTimeout(() => {
        if (typeof showPersonalizationSurvey === 'function') {
            showPersonalizationSurvey(appTier);
        }
    }, 2000); // Give user time to see success message first
}

// Show unlock success notification
function showUnlockSuccess(tier) {
    let tierName = '';
    let features = '';
    
    if (tier === 'PRO') {
        tierName = 'Basic Pack';
        features = 'Get ready to personalize your nutrition plan!';
    } else if (tier === 'STANDARD') {
        tierName = 'Standard Pack';
        features = 'Get ready for enhanced goal tracking and analytics!';
    } else if (tier === 'ELITE') {
        tierName = 'Premium Pack';
        features = 'Get ready for personalized workout and nutrition plans!';
    }
    
    // Create success modal
    const modal = document.createElement('div');
    modal.id = 'unlockSuccessModal';
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
            text-align: center;
            box-shadow: var(--shadow-lg), var(--shadow-glow);
            border: 1px solid var(--color-border);
            animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        ">
            <div style="
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, var(--color-primary), #00dd77);
                border-radius: 50%;
                margin: 0 auto 1.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
            ">
                ✓
            </div>
            <h2 style="
                font-family: 'Archivo Black', sans-serif;
                font-size: 2rem;
                margin-bottom: 1rem;
                color: var(--color-text);
            ">
                Welcome to ${tierName}!
            </h2>
            <p style="
                color: var(--color-text-secondary);
                font-size: 1.1rem;
                margin-bottom: 2rem;
                line-height: 1.6;
            ">
                ${features}
            </p>
            <button id="continueBtn" style="
                padding: 1rem 2rem;
                background: linear-gradient(135deg, var(--color-primary), #00dd77);
                color: var(--color-bg);
                border: none;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: 700;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            ">
                Continue
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-close after 1.5 seconds OR on button click
    document.getElementById('continueBtn').onclick = function() {
        document.getElementById('unlockSuccessModal').remove();
    };
    
    setTimeout(() => {
        const modalElement = document.getElementById('unlockSuccessModal');
        if (modalElement) {
            modalElement.remove();
        }
    }, 1500);
}

// Payment link tracking (optional analytics)
function trackPaymentClick(tier) {
    // This function can be used to track when users click payment links
    console.log('Payment link clicked for tier:', tier);
    
    // Store in localStorage for analytics
    const clicks = JSON.parse(localStorage.getItem('paymentClicks') || '[]');
    clicks.push({
        tier: tier,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('paymentClicks', JSON.stringify(clicks));
}

// Get user's current tier
function getUserTier() {
    const currentUser = getCurrentUser();
    return currentUser ? currentUser.tier : 'FREE';
}

// Check if user has access to feature
function hasFeatureAccess(feature) {
    const tier = getUserTier();
    
    switch(feature) {
        case 'nutrition_tracking':
            return true; // Available to all tiers
        
        case 'nutrition_goals':
            return ['PRO', 'STANDARD', 'ELITE'].includes(tier);
        
        case 'workout_plans':
            return tier === 'ELITE';
        
        default:
            return false;
    }
}

// Show upgrade prompt
function showUpgradePrompt(feature) {
    let message = '';
    let tier = '';
    
    if (feature === 'nutrition_goals') {
        message = 'Upgrade to Basic Pack or higher to set nutrition goals and track your progress!';
        tier = 'PRO';
    } else if (feature === 'workout_plans') {
        message = 'Upgrade to Premium Pack to access complete workout plans!';
        tier = 'ELITE';
    }
    
    if (confirm(message + '\n\nWould you like to see upgrade options?')) {
        switchTab('pricing');
    }
}

// Initialize payment tracking on links
document.addEventListener('DOMContentLoaded', function() {
    const paymentLinks = document.querySelectorAll('a[href*="square.link"]');
    
    paymentLinks.forEach(link => {
        link.addEventListener('click', function() {
            const url = this.href;
            
            // Determine tier based on URL
            if (url.includes('EaNUJ0gy')) {
                trackPaymentClick('PRO');
            } else if (url.includes('0cNYptZb')) {
                trackPaymentClick('STANDARD');
            } else if (url.includes('6Y9uWLVv')) {
                trackPaymentClick('ELITE');
            } else if (url.includes('91I3ruxV')) {
                trackPaymentClick('DONATION');
            }
        });
    });
});

// Helper function to construct redirect URL with unlock parameter
function getSquarePaymentUrl(tier, baseUrl) {
    const redirectUrl = window.location.origin + window.location.pathname + '?unlock=' + tier;
    
    // Note: Square payment links don't support automatic redirect parameters
    // This would need to be configured in Square dashboard
    // For now, we rely on manual URL construction after payment
    
    return baseUrl;
}

// Manual unlock for testing (used by admin panel)
function manualUnlock(tier) {
    if (confirm(`Manually unlock ${tier} tier?\n\nThis is for testing purposes only.`)) {
        handleUnlock(tier);
    }
}
