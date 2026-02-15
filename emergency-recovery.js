// ═══════════════════════════════════════════════════════════════════
// EMERGENCY CUSTOMER RECOVERY SCRIPT
// ═══════════════════════════════════════════════════════════════════
// For customers who paid but got wrong tier
// ═══════════════════════════════════════════════════════════════════

function emergencyRecovery() {
    console.clear();
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('🚨 EMERGENCY TIER RECOVERY');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('');
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.error('❌ No user logged in');
        return alert('Please log in first');
    }
    
    console.log('👤 Current User:', currentUser.email);
    console.log('📊 Current Tier:', currentUser.tier);
    console.log('');
    
    // Ask which tier they paid for
    console.log('Which tier did the customer PAY for?');
    console.log('');
    console.log('Run one of these commands:');
    console.log('  recoverPRO()       - For Basic Pack ($5)');
    console.log('  recoverSTANDARD()  - For Standard Pack ($10)');
    console.log('  recoverELITE()     - For Premium Pack ($20)');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════');
}

function recoverPRO() {
    recoverTier('PRO', 'Basic Pack', '$5');
}

function recoverSTANDARD() {
    recoverTier('STANDARD', 'Standard Pack', '$10');
}

function recoverELITE() {
    recoverTier('ELITE', 'Premium Pack', '$20');
}

function recoverTier(tier, name, price) {
    console.clear();
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('🔧 RECOVERING TIER: ' + tier);
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('');
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.error('❌ No user logged in');
        return alert('Please log in first');
    }
    
    console.log('Customer:', currentUser.email);
    console.log('Paid for:', name + ' (' + price + ')');
    console.log('Current tier:', currentUser.tier);
    console.log('Target tier:', tier);
    console.log('');
    
    if (currentUser.tier === tier) {
        console.log('✅ Tier is already correct!');
        console.log('No recovery needed.');
        return;
    }
    
    console.log('🔄 Step 1: Updating localStorage...');
    currentUser.tier = tier;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    console.log('✅ localStorage updated');
    console.log('');
    
    console.log('🔄 Step 2: Updating Firebase...');
    if (isFirebaseReady() && currentUser.uid) {
        firebase.database().ref('users/' + currentUser.uid).update({
            tier: tier,
            paidTier: tier,
            paymentDate: new Date().toISOString(),
            recoveredAt: new Date().toISOString(),
            recoveredFrom: currentUser.tier,
            updatedAt: new Date().toISOString()
        })
        .then(() => {
            console.log('✅ Firebase updated');
            console.log('');
            console.log('🔄 Step 3: Updating UI...');
            
            updateTierDisplay();
            initializeTabSystem();
            
            console.log('✅ UI updated');
            console.log('');
            console.log('═══════════════════════════════════════════════════════════════════');
            console.log('✅ RECOVERY COMPLETE!');
            console.log('═══════════════════════════════════════════════════════════════════');
            console.log('');
            console.log('Customer now has ' + tier + ' tier');
            console.log('All features unlocked');
            console.log('');
            
            // Show success message to customer
            alert('✅ Your ' + name + ' has been activated!\n\n' +
                  'Tier: ' + tier + '\n' +
                  'All features are now unlocked.\n\n' +
                  'The page will refresh in 2 seconds...');
            
            setTimeout(() => {
                location.reload();
            }, 2000);
        })
        .catch((error) => {
            console.error('❌ Firebase update failed:', error);
            console.log('');
            console.log('⚠️ Tier updated in localStorage but NOT in Firebase');
            console.log('The tier will work until the user logs out.');
            console.log('');
            
            alert('✅ Tier updated to ' + tier + '\n\n' +
                  'Note: Firebase sync failed. The tier will work for now.\n' +
                  'Please try again or contact support.\n\n' +
                  'Refreshing page...');
            
            updateTierDisplay();
            initializeTabSystem();
            
            setTimeout(() => {
                location.reload();
            }, 2000);
        });
    } else {
        console.warn('⚠️ Firebase not available');
        console.log('Tier updated in localStorage only');
        console.log('');
        
        updateTierDisplay();
        initializeTabSystem();
        
        console.log('✅ RECOVERY COMPLETE (localStorage only)');
        console.log('');
        
        alert('✅ Your ' + name + ' has been activated!\n\n' +
              'Tier: ' + tier + '\n\n' +
              'Refreshing page...');
        
        setTimeout(() => {
            location.reload();
        }, 2000);
    }
}

// Check what a customer should have based on Square link
function checkSquareLink() {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('🔗 SQUARE PAYMENT LINK MAPPING');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('');
    console.log('Basic Pack ($5):');
    console.log('  Link ID: EaNUJ0gy');
    console.log('  Should redirect to: ?unlock=PRO');
    console.log('  Unlocks: PRO tier (Nutrition Goals)');
    console.log('');
    console.log('Standard Pack ($10):');
    console.log('  Link ID: 0cNYptZb');
    console.log('  Should redirect to: ?unlock=STANDARD');
    console.log('  Unlocks: STANDARD tier (Goals + Analytics)');
    console.log('');
    console.log('Premium Pack ($20):');
    console.log('  Link ID: 6Y9uWLVv');
    console.log('  Should redirect to: ?unlock=ELITE');
    console.log('  Unlocks: ELITE tier (Everything + Workouts)');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('');
    console.log('If customer paid for Premium ($20) but got Basic:');
    console.log('  → The Square link is configured with ?unlock=PRO');
    console.log('  → It should be ?unlock=ELITE');
    console.log('  → FIX: Update Square link redirect URL');
    console.log('');
}

// Export functions
window.emergencyRecovery = emergencyRecovery;
window.recoverPRO = recoverPRO;
window.recoverSTANDARD = recoverSTANDARD;
window.recoverELITE = recoverELITE;
window.checkSquareLink = checkSquareLink;

console.log('');
console.log('🆘 EMERGENCY RECOVERY LOADED');
console.log('');
console.log('Commands:');
console.log('  emergencyRecovery()  - Show recovery options');
console.log('  recoverELITE()       - Fix customer who paid for Premium');
console.log('  recoverSTANDARD()    - Fix customer who paid for Standard');
console.log('  recoverPRO()         - Fix customer who paid for Basic');
console.log('  checkSquareLink()    - Show correct Square configuration');
console.log('');
