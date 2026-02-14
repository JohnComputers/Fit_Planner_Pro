// Authentication System with Firebase
// Provides real authentication and cross-device sync

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for Firebase to initialize
    setTimeout(() => {
        checkAuth();
    }, 500);
});

// Check if user is already authenticated
function checkAuth() {
    if (isFirebaseReady()) {
        // Use Firebase Authentication
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                loadUserFromFirebase(user);
            } else {
                showAuthModal();
            }
        });
    } else {
        // Fallback to LocalStorage
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const userData = JSON.parse(currentUser);
            showApp(userData);
        } else {
            showAuthModal();
        }
    }
}

// Load user data from Firebase
function loadUserFromFirebase(firebaseUser) {
    const userRef = firebase.database().ref('users/' + firebaseUser.uid);
    
    userRef.once('value').then((snapshot) => {
        const userData = snapshot.val();
        
        if (userData) {
            // User data exists in database
            let tier = userData.tier || 'FREE';
            
            // Auto-upgrade admin email to ELITE
            if (firebaseUser.email === 'random111199@gmail.com' && tier !== 'ELITE') {
                tier = 'ELITE';
                userRef.update({ tier: 'ELITE' });
            }
            
            const currentUser = {
                email: firebaseUser.email,
                tier: tier,
                isGuest: false,
                uid: firebaseUser.uid
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showApp(currentUser);
        } else {
            // First time login, create user profile
            let tier = 'FREE';
            
            // Auto-upgrade admin email to ELITE
            if (firebaseUser.email === 'random111199@gmail.com') {
                tier = 'ELITE';
            }
            
            const newUserData = {
                email: firebaseUser.email,
                tier: tier,
                createdAt: new Date().toISOString()
            };
            
            userRef.set(newUserData).then(() => {
                const currentUser = {
                    email: firebaseUser.email,
                    tier: tier,
                    isGuest: false,
                    uid: firebaseUser.uid
                };
                
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                showApp(currentUser);
            });
        }
    }).catch((error) => {
        console.error('Error loading user data:', error);
        
        let tier = 'FREE';
        if (firebaseUser.email === 'random111199@gmail.com') {
            tier = 'ELITE';
        }
        
        showApp({
            email: firebaseUser.email,
            tier: tier,
            isGuest: false,
            uid: firebaseUser.uid
        });
    });
}

// Show authentication modal
function showAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';
}

// Show the main app
function showApp(userData) {
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';
    
    // Update user info in header
    document.getElementById('userEmail').textContent = userData.email || 'Guest User';
    
    // CRITICAL FIX: Reload tier from Firebase on every page load
    if (isFirebaseReady() && userData.uid) {
        firebase.database().ref('users/' + userData.uid).once('value').then((snapshot) => {
            const dbUserData = snapshot.val();
            if (dbUserData && dbUserData.tier) {
                // Update tier from database
                userData.tier = dbUserData.tier;
                localStorage.setItem('currentUser', JSON.stringify(userData));
                console.log('✅ Tier loaded from Firebase:', dbUserData.tier);
            }
            
            // Update UI after tier is loaded
            updateTierDisplay();
            initializeTabSystem();
            
            // Load initial content
            loadNutritionData();
            loadGoals();
            
            // Display profile if exists
            if (typeof displayProfile === 'function') {
                setTimeout(() => displayProfile(), 100);
            }
        }).catch((error) => {
            console.error('Error loading tier from Firebase:', error);
            // Still show app with current tier
            updateTierDisplay();
            initializeTabSystem();
            loadNutritionData();
            loadGoals();
        });
    } else {
        // No Firebase, use local storage tier
        updateTierDisplay();
        initializeTabSystem();
        loadNutritionData();
        loadGoals();
        
        if (typeof displayProfile === 'function') {
            setTimeout(() => displayProfile(), 100);
        }
    }
}

// Email validation helper
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Safe UX function wrappers (fallback if ux-enhancements.js not loaded)
function safeShowFieldError(fieldId, message) {
    if (typeof showFieldError === 'function') {
        showFieldError(fieldId, message);
    } else {
        alert(message);
    }
}

function safeShowLoading(message) {
    if (typeof showLoading === 'function') {
        showLoading(message);
    }
}

function safeHideLoading() {
    if (typeof hideLoading === 'function') {
        hideLoading();
    }
}

function safeCelebrateSuccess(message) {
    if (typeof celebrateSuccess === 'function') {
        celebrateSuccess(message);
    } else if (typeof showSuccessMessage === 'function') {
        showSuccessMessage(message);
    } else {
        alert(message);
    }
}

function safeShowFirstTimeTip(key, message, duration) {
    if (typeof showFirstTimeTip === 'function') {
        showFirstTimeTip(key, message, duration);
    }
}

function safeValidateEmail(email) {
    if (typeof validateEmail === 'function') {
        return validateEmail(email);
    }
    return isValidEmail(email);
}

// Handle user registration
function handleRegister() {
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerPasswordConfirm').value;
    
    // Clear any previous errors
    document.querySelectorAll('.field-error').forEach(el => el.remove());
    document.querySelectorAll('input').forEach(input => input.style.borderColor = '');
    
    // Validation with helpful messages
    if (!email) {
        safeShowFieldError('registerEmail', 'Please enter your email address');
        return;
    }
    
    if (!safeValidateEmail(email)) {
        safeShowFieldError('registerEmail', 'Please enter a valid email (e.g., you@example.com)');
        return;
    }
    
    if (!password) {
        safeShowFieldError('registerPassword', 'Please create a password');
        return;
    }
    
    if (password.length < 6) {
        safeShowFieldError('registerPassword', 'Password must be at least 6 characters for security');
        return;
    }
    
    if (!confirmPassword) {
        safeShowFieldError('registerPasswordConfirm', 'Please confirm your password');
        return;
    }
    
    if (password !== confirmPassword) {
        safeShowFieldError('registerPasswordConfirm', 'Passwords don\'t match. Please try again.');
        return;
    }
    
    // Show loading state
    safeShowLoading('Creating your account...');
    
    // Admin auto-upgrade check
    const isAdmin = (email.toLowerCase() === 'random111199@gmail.com');
    const tier = isAdmin ? 'ELITE' : 'FREE';
    
    if (isFirebaseReady()) {
        // Firebase registration
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                // Save user data to database
                const userData = {
                    email: email,
                    tier: tier,
                    createdAt: new Date().toISOString(),
                    uid: user.uid
                };
                
                return firebase.database().ref('users/' + user.uid).set(userData)
                    .then(() => {
                        safeHideLoading();
                        safeCelebrateSuccess('Account Created! 🎉');
                        
                        // Save to localStorage
                        localStorage.setItem('currentUser', JSON.stringify(userData));
                        
                        // Show admin message if applicable
                        if (isAdmin) {
                            setTimeout(() => {
                                alert('🎉 Admin account detected!\n\nYou have been automatically upgraded to ELITE tier with full access to all features.\n\nWelcome to FitPlanner Pro!');
                            }, 1500);
                        } else {
                            // Show welcome tip for regular users
                            setTimeout(() => {
                                safeShowFirstTimeTip('welcome', 'Welcome! Start by tracking your first meal in the Nutrition tab 🍽️', 8000);
                            }, 2000);
                        }
                        
                        showApp(userData);
                    });
            })
            .catch((error) => {
                safeHideLoading();
                handleAuthError(error, 'register');
            });
    } else {
        // Fallback to localStorage
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Check if email already exists
            if (users.some(u => u.email === email)) {
                safeHideLoading();
                safeShowFieldError('registerEmail', 'This email is already registered. Try logging in instead!');
                return;
            }
            
            const userData = {
                email: email,
                password: password,
                tier: tier,
                createdAt: new Date().toISOString(),
                uid: 'local_' + Date.now()
            };
            
            users.push(userData);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            safeHideLoading();
            safeCelebrateSuccess('Account Created! 🎉');
            
            if (isAdmin) {
                setTimeout(() => {
                    alert('🎉 Admin account detected!\n\nYou have been automatically upgraded to ELITE tier.\n\nWelcome!');
                }, 1500);
            } else {
                setTimeout(() => {
                    safeShowFirstTimeTip('welcome', 'Welcome! Start by tracking your first meal in the Nutrition tab 🍽️', 8000);
                }, 2000);
            }
            
            showApp(userData);
        }, 1000);
    }
}

// Handle user login
function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Clear previous errors
    document.querySelectorAll('.field-error').forEach(el => el.remove());
    document.querySelectorAll('input').forEach(input => input.style.borderColor = '');
    
    // Validation with helpful messages
    if (!email) {
        safeShowFieldError('loginEmail', 'Please enter your email address');
        return;
    }
    
    if (!safeValidateEmail(email)) {
        safeShowFieldError('loginEmail', 'Please enter a valid email address');
        return;
    }
    
    if (!password) {
        safeShowFieldError('loginPassword', 'Please enter your password');
        return;
    }
    
    // Show loading
    safeShowLoading('Logging you in...');
    
    if (isFirebaseReady()) {
        // Use Firebase Authentication
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                safeHideLoading();
                
                // Login successful - check if admin and upgrade if needed
                if (email === 'random111199@gmail.com') {
                    const user = userCredential.user;
                    firebase.database().ref('users/' + user.uid).once('value').then((snapshot) => {
                        const userData = snapshot.val();
                        if (userData && userData.tier !== 'ELITE') {
                            firebase.database().ref('users/' + user.uid).update({ tier: 'ELITE' });
                        }
                    });
                }
                
                safeCelebrateSuccess('Welcome Back! 👋');
            })
            .catch((error) => {
                safeHideLoading();
                
                if (error.code === 'auth/user-not-found') {
                    safeShowFieldError('loginEmail', 'No account found with this email. Try creating an account!');
                } else if (error.code === 'auth/wrong-password') {
                    safeShowFieldError('loginPassword', 'Incorrect password. Please try again.');
                } else if (error.code === 'auth/invalid-email') {
                    safeShowFieldError('loginEmail', 'Invalid email format');
                } else if (error.code === 'auth/too-many-requests') {
                    alert('⚠️ Too many failed login attempts.\n\nPlease wait a few minutes and try again, or reset your password.');
                } else {
                    alert('Login error: ' + error.message);
                }
            });
    } else {
        // Fallback to LocalStorage
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (!user) {
                safeHideLoading();
                safeShowFieldError('loginPassword', 'Invalid email or password. Double check and try again!');
                return;
            }
            
            // Auto-upgrade admin email to ELITE
            let tier = user.tier || 'FREE';
            if (email === 'random111199@gmail.com' && tier !== 'ELITE') {
                tier = 'ELITE';
                user.tier = 'ELITE';
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            const currentUser = {
                email: email,
                tier: tier,
                isGuest: false,
                uid: user.uid
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            safeHideLoading();
            safeCelebrateSuccess('Welcome Back! 👋');
            showApp(currentUser);
        }, 800);
    }
}

// Handle guest access
function handleGuest() {
    const currentUser = {
        email: 'Guest User',
        tier: 'FREE',
        isGuest: true
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showApp(currentUser);
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        if (isFirebaseReady()) {
            firebase.auth().signOut().then(() => {
                localStorage.removeItem('currentUser');
                clearFormFields();
                showAuthModal();
            });
        } else {
            localStorage.removeItem('currentUser');
            clearFormFields();
            showAuthModal();
        }
    }
}

// Clear form fields
function clearFormFields() {
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('registerPasswordConfirm').value = '';
}

// Switch to register form
function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

// Switch to login form
function showLogin() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Get current user
function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

// Update user tier
function updateUserTier(newTier) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    currentUser.tier = newTier;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update in Firebase if available
    if (isFirebaseReady() && currentUser.uid) {
        firebase.database().ref('users/' + currentUser.uid).update({
            tier: newTier,
            updatedAt: new Date().toISOString()
        });
    }
    
    // Update in local users array if not guest (fallback)
    if (!currentUser.isGuest && !isFirebaseReady()) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex].tier = newTier;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
    
    updateTierDisplay();
    initializeTabSystem();
}

// Update tier display in header
function updateTierDisplay() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const tierElement = document.getElementById('userTier');
    if (!tierElement) return;
    
    tierElement.textContent = currentUser.tier;
    
    // Update tier styling
    tierElement.className = 'user-tier';
    if (currentUser.tier === 'PRO') {
        tierElement.style.background = 'linear-gradient(135deg, var(--color-primary), #00dd77)';
    } else if (currentUser.tier === 'STANDARD') {
        tierElement.style.background = 'linear-gradient(135deg, #3366ff, #6699ff)';
    } else if (currentUser.tier === 'ELITE') {
        tierElement.style.background = 'linear-gradient(135deg, var(--color-accent), #ff6699)';
    } else {
        tierElement.style.background = 'linear-gradient(135deg, #666, #888)';
    }
}

// Update feature access based on user tier
// ====================================================================
// BULLETPROOF TAB SYSTEM - COMPLETE REWRITE
// ====================================================================

// Global tab system state
window.tabSystem = {
    initialized: false,
    currentTier: 'FREE'
};

// Initialize tab system - call this after page loads and after login
function initializeTabSystem() {
    console.log('🔧 INITIALIZING TAB SYSTEM...');
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.error('❌ No user - cannot initialize tabs');
        return;
    }
    
    const tier = currentUser.tier || 'FREE';
    window.tabSystem.currentTier = tier;
    
    console.log('👤 User tier:', tier);
    
    // Get all required elements
    const goalsBtn = document.getElementById('goalsTab');
    const workoutsBtn = document.getElementById('workoutsTab');
    const goalsLock = document.getElementById('goalsLock');
    const workoutsLock = document.getElementById('workoutsLock');
    
    if (!goalsBtn || !workoutsBtn) {
        console.error('❌ CRITICAL: Tab buttons not found!');
        console.log('goalsBtn:', goalsBtn);
        console.log('workoutsBtn:', workoutsBtn);
        return;
    }
    
    console.log('✅ Tab buttons found');
    
    // Remove ALL existing event listeners by cloning
    const newGoalsBtn = goalsBtn.cloneNode(true);
    const newWorkoutsBtn = workoutsBtn.cloneNode(true);
    
    goalsBtn.parentNode.replaceChild(newGoalsBtn, goalsBtn);
    workoutsBtn.parentNode.replaceChild(newWorkoutsBtn, workoutsBtn);
    
    console.log('✅ Cloned buttons - old handlers removed');
    
    // Get fresh references to lock icons after cloning
    const newGoalsLock = document.getElementById('goalsLock');
    const newWorkoutsLock = document.getElementById('workoutsLock');
    
    // ====== GOALS TAB SETUP ======
    if (tier === 'FREE') {
        // Lock goals for FREE tier
        console.log('🔒 Locking GOALS for FREE tier');
        newGoalsBtn.style.opacity = '0.5';
        newGoalsBtn.style.cursor = 'not-allowed';
        if (newGoalsLock) newGoalsLock.style.display = 'inline';
        
        newGoalsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔒 Goals clicked but locked (FREE tier)');
            alert('🌟 Upgrade to PRO ($5) to unlock Nutrition Goals!\n\n✓ Personalized macros\n✓ Meal suggestions\n✓ Progress tracking');
            switchTab('pricing');
        });
    } else {
        // Unlock goals for PRO, STANDARD, ELITE
        console.log('✅ Unlocking GOALS for', tier, 'tier');
        newGoalsBtn.style.opacity = '1';
        newGoalsBtn.style.cursor = 'pointer';
        if (newGoalsLock) newGoalsLock.style.display = 'none';
        
        newGoalsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('✅ Goals clicked - switching tab');
            switchTab('goals');
        });
    }
    
    // ====== WORKOUTS TAB SETUP ======
    if (tier === 'ELITE') {
        // Unlock workouts for ELITE only
        console.log('✅ Unlocking WORKOUTS for ELITE tier');
        newWorkoutsBtn.style.opacity = '1';
        newWorkoutsBtn.style.cursor = 'pointer';
        if (newWorkoutsLock) newWorkoutsLock.style.display = 'none';
        
        newWorkoutsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('✅ Workouts clicked - switching tab');
            switchTab('workouts');
        });
    } else {
        // Lock workouts for FREE, PRO, STANDARD
        console.log('🔒 Locking WORKOUTS for', tier, 'tier');
        newWorkoutsBtn.style.opacity = '0.5';
        newWorkoutsBtn.style.cursor = 'not-allowed';
        if (newWorkoutsLock) newWorkoutsLock.style.display = 'inline';
        
        newWorkoutsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔒 Workouts clicked but locked');
            alert('🏆 Upgrade to ELITE ($20) to unlock Workout Plans!\n\n✓ Complete programs\n✓ Exercise library\n✓ PR tracking');
            switchTab('pricing');
        });
    }
    
    window.tabSystem.initialized = true;
    console.log('✅ TAB SYSTEM INITIALIZED SUCCESSFULLY');
}

// Force unlock all tabs (for testing)
function forceUnlockAllTabs() {
    console.log('🔓 FORCE UNLOCKING ALL TABS...');
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Please log in first');
        return;
    }
    
    // Upgrade to ELITE
    currentUser.tier = 'ELITE';
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update Firebase if available
    if (typeof isFirebaseReady === 'function' && isFirebaseReady() && currentUser.uid) {
        firebase.database().ref('users/' + currentUser.uid).update({ tier: 'ELITE' });
    }
    
    // Update tier display
    const tierElement = document.getElementById('userTier');
    if (tierElement) {
        tierElement.textContent = 'ELITE';
        tierElement.style.background = 'linear-gradient(135deg, #ff3366, #ff0055)';
    }
    
    // Reinitialize tab system
    initializeTabSystem();
    
    alert('✅ Upgraded to ELITE!\n\nAll tabs unlocked!\n\n✓ Goals tab works\n✓ Workouts tab works');
    
    return 'SUCCESS: All tabs unlocked!';
}

// Expose globally
window.initializeTabSystem = initializeTabSystem;
window.forceUnlockAllTabs = forceUnlockAllTabs;

console.log('✅ Tab system loaded');

function upgradeToElite() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return 'No user logged in. Please log in first.';
    }
    
    currentUser.tier = 'ELITE';
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update in Firebase if available
    if (isFirebaseReady() && currentUser.uid) {
        firebase.database().ref('users/' + currentUser.uid).update({ tier: 'ELITE' });
    }
    
    updateTierDisplay();
    initializeTabSystem();
    
    alert('🎉 Upgraded to ELITE!\n\nAll features unlocked!\n\nYou can now access Nutrition Goals and Workout Plans.');
    
    return 'Success! Upgraded to ELITE tier.';
}

// Make upgrade function globally available for testing
window.upgradeToElite = upgradeToElite;
