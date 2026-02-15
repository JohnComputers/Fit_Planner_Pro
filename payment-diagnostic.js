// ═══════════════════════════════════════════════════════════════════
// PAYMENT TIER DIAGNOSTIC & TESTING TOOL
// ═══════════════════════════════════════════════════════════════════
// Paste this entire file into browser console to diagnose tier issues
// ═══════════════════════════════════════════════════════════════════

function testPaymentSystem() {
    console.clear();
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('🔍 PAYMENT SYSTEM DIAGNOSTIC');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('');
    
    // Check 1: User Status
    console.log('1️⃣ USER STATUS');
    console.log('─────────────────');
    const currentUser = getCurrentUser();
    if (currentUser) {
        console.log('✅ User logged in');
        console.log('   Email:', currentUser.email);
        console.log('   Current Tier:', currentUser.tier);
        console.log('   UID:', currentUser.uid || 'N/A');
        console.log('   Guest:', currentUser.isGuest ? 'Yes' : 'No');
    } else {
        console.log('❌ No user logged in');
    }
    console.log('');
    
    // Check 2: LocalStorage Data
    console.log('2️⃣ LOCALSTORAGE DATA');
    console.log('─────────────────────');
    const lsUser = localStorage.getItem('currentUser');
    if (lsUser) {
        const userData = JSON.parse(lsUser);
        console.log('✅ User data found');
        console.log('   Tier:', userData.tier);
        console.log('   Full data:', userData);
    } else {
        console.log('❌ No user data in localStorage');
    }
    
    const pendingUnlock = localStorage.getItem('pendingUnlock');
    if (pendingUnlock) {
        const unlock = JSON.parse(pendingUnlock);
        console.log('⏳ Pending unlock found!');
        console.log('   Tier:', unlock.tier);
        console.log('   Age:', Math.floor((Date.now() - unlock.timestamp) / 1000), 'seconds old');
    } else {
        console.log('   No pending unlock');
    }
    console.log('');
    
    // Check 3: Firebase Status
    console.log('3️⃣ FIREBASE STATUS');
    console.log('──────────────────');
    if (typeof isFirebaseReady === 'function' && isFirebaseReady()) {
        console.log('✅ Firebase is ready');
        
        if (currentUser && currentUser.uid) {
            console.log('🔥 Fetching Firebase data...');
            firebase.database().ref('users/' + currentUser.uid).once('value')
                .then((snapshot) => {
                    const fbData = snapshot.val();
                    if (fbData) {
                        console.log('✅ Firebase data found');
                        console.log('   Tier:', fbData.tier);
                        console.log('   Paid Tier:', fbData.paidTier || 'N/A');
                        console.log('   Payment Date:', fbData.paymentDate || 'N/A');
                        console.log('   Created:', fbData.createdAt || 'N/A');
                        console.log('   Updated:', fbData.updatedAt || 'N/A');
                        console.log('   Full data:', fbData);
                        
                        // Check for mismatch
                        if (fbData.tier !== currentUser.tier) {
                            console.warn('⚠️ TIER MISMATCH DETECTED!');
                            console.warn('   localStorage:', currentUser.tier);
                            console.warn('   Firebase:', fbData.tier);
                            console.warn('   → FIX: updateUserTier("' + fbData.tier + '", true)');
                        }
                    } else {
                        console.log('❌ No Firebase data found for user');
                    }
                    
                    runDiagnosticTests();
                })
                .catch((error) => {
                    console.error('❌ Firebase error:', error);
                    runDiagnosticTests();
                });
        } else {
            console.log('   No UID available to check Firebase');
            console.log('');
            runDiagnosticTests();
        }
    } else {
        console.log('❌ Firebase not ready');
        console.log('');
        runDiagnosticTests();
    }
}

function runDiagnosticTests() {
    console.log('');
    console.log('4️⃣ FUNCTION AVAILABILITY');
    console.log('─────────────────────────');
    console.log('   getCurrentUser:', typeof getCurrentUser);
    console.log('   updateUserTier:', typeof updateUserTier);
    console.log('   initializeTabSystem:', typeof initializeTabSystem);
    console.log('   forceUnlockAllTabs:', typeof forceUnlockAllTabs);
    console.log('   verifyUserTier:', typeof verifyUserTier);
    console.log('');
    
    console.log('5️⃣ TAB SYSTEM STATUS');
    console.log('────────────────────');
    const goalsTab = document.getElementById('goalsTab');
    const workoutsTab = document.getElementById('workoutsTab');
    console.log('   Goals button:', goalsTab ? 'Found' : 'Missing');
    console.log('   Workouts button:', workoutsTab ? 'Found' : 'Missing');
    
    if (goalsTab) {
        console.log('   Goals opacity:', goalsTab.style.opacity || 'default');
        console.log('   Goals cursor:', goalsTab.style.cursor || 'default');
    }
    if (workoutsTab) {
        console.log('   Workouts opacity:', workoutsTab.style.opacity || 'default');
        console.log('   Workouts cursor:', workoutsTab.style.cursor || 'default');
    }
    console.log('');
    
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('🔧 DIAGNOSTIC COMPLETE');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('');
    console.log('💡 QUICK FIXES:');
    console.log('────────────────');
    console.log('');
    console.log('Test PRO unlock:');
    console.log('   testUnlock("PRO")');
    console.log('');
    console.log('Test STANDARD unlock:');
    console.log('   testUnlock("STANDARD")');
    console.log('');
    console.log('Test ELITE unlock:');
    console.log('   testUnlock("ELITE")');
    console.log('');
    console.log('Force unlock to ELITE:');
    console.log('   forceUnlockAllTabs()');
    console.log('');
    console.log('Manually set tier:');
    console.log('   updateUserTier("ELITE", true)');
    console.log('');
    console.log('Verify tier:');
    console.log('   verifyUserTier()');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════');
}

// Test unlock without actually redirecting
function testUnlock(tier) {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('🧪 TESTING UNLOCK: ' + tier);
    console.log('═══════════════════════════════════════════════════════════════════');
    
    // Simulate URL parameter
    localStorage.setItem('pendingUnlock', JSON.stringify({
        tier: tier,
        timestamp: Date.now()
    }));
    
    console.log('✅ Pending unlock saved');
    console.log('🔄 Simulating page load with ?unlock=' + tier);
    
    // Trigger unlock
    if (typeof handleUnlock === 'function') {
        handleUnlock(tier);
    } else {
        console.error('❌ handleUnlock function not found!');
    }
    
    // Check result
    setTimeout(() => {
        const currentUser = getCurrentUser();
        console.log('');
        console.log('📊 RESULT:');
        console.log('   Expected tier:', tier);
        console.log('   Actual tier:', currentUser ? currentUser.tier : 'No user');
        
        if (currentUser && currentUser.tier === tier) {
            console.log('✅ SUCCESS! Tier unlocked correctly');
        } else {
            console.error('❌ FAILED! Tier not unlocked');
        }
        
        console.log('═══════════════════════════════════════════════════════════════════');
    }, 2000);
}

// Simulate payment redirect
function simulatePayment(tier) {
    console.log('🎭 SIMULATING PAYMENT FOR: ' + tier);
    console.log('Redirecting with ?unlock=' + tier + '...');
    
    window.location.href = window.location.origin + window.location.pathname + '?unlock=' + tier;
}

// Check if Square links are configured
function checkSquareLinks() {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('🔗 SQUARE PAYMENT LINKS CHECK');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('');
    
    const links = [
        { tier: 'PRO', name: 'Basic Pack ($5)', url: 'https://square.link/u/EaNUJ0gy', should: '?unlock=PRO' },
        { tier: 'STANDARD', name: 'Standard Pack ($10)', url: 'https://square.link/u/0cNYptZb', should: '?unlock=STANDARD' },
        { tier: 'ELITE', name: 'Premium Pack ($20)', url: 'https://square.link/u/6Y9uWLVv', should: '?unlock=ELITE' }
    ];
    
    links.forEach((link, index) => {
        console.log(`${index + 1}️⃣ ${link.name}`);
        console.log(`   Tier: ${link.tier}`);
        console.log(`   Square URL: ${link.url}`);
        console.log(`   Should redirect to: ${window.location.origin}${link.should}`);
        console.log('');
    });
    
    console.log('⚠️ IMPORTANT: Each Square link must be configured to redirect');
    console.log('   to your site with the correct ?unlock parameter!');
    console.log('');
    console.log('📝 To configure:');
    console.log('   1. Log into Square Dashboard');
    console.log('   2. Go to Online Checkout → Payment Links');
    console.log('   3. Edit each link');
    console.log('   4. Set "Redirect after checkout" to correct URL');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════');
}

// Export functions to window
window.testPaymentSystem = testPaymentSystem;
window.testUnlock = testUnlock;
window.simulatePayment = simulatePayment;
window.checkSquareLinks = checkSquareLinks;

// Auto-run on load
console.log('');
console.log('🔧 Payment Diagnostic Tool Loaded');
console.log('');
console.log('Available commands:');
console.log('  testPaymentSystem()  - Run full diagnostic');
console.log('  testUnlock("ELITE")  - Test tier unlock');
console.log('  simulatePayment("ELITE") - Simulate payment redirect');
console.log('  checkSquareLinks()   - Check Square configuration');
console.log('');

// If we're on a page with ?unlock, show info
const urlParams = new URLSearchParams(window.location.search);
const unlockParam = urlParams.get('unlock');
if (unlockParam) {
    console.log('🎉 PAYMENT DETECTED IN URL!');
    console.log('   Unlock tier:', unlockParam);
    console.log('   Running diagnostic...');
    console.log('');
    setTimeout(testPaymentSystem, 2000);
}
