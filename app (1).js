// Main App Logic
// Handles nutrition tracking, goals, and app functionality

// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.closest('.tab-btn').classList.add('active');
    
    // Update displays when switching tabs
    if (tabName === 'nutrition') {
        loadNutritionData();
    } else if (tabName === 'goals') {
        loadGoals();
        updateGoalProgress();
    }
}

// Update feature access based on tier
function updateFeatureAccess() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const tier = currentUser.tier;
    
    // Goals tab (PRO and above)
    const goalsTab = document.getElementById('goalsTab');
    const goalsLock = document.getElementById('goalsLock');
    
    if (tier === 'FREE') {
        goalsTab.onclick = function() {
            alert('Upgrade to Basic Pack or higher to access Nutrition Goals!\n\nClick "Upgrade" tab to unlock this feature.');
        };
        goalsLock.style.display = 'inline';
    } else {
        goalsTab.onclick = function() { switchTab('goals'); };
        goalsLock.style.display = 'none';
    }
    
    // Workouts tab (ELITE only)
    const workoutsTab = document.getElementById('workoutsTab');
    const workoutsLock = document.getElementById('workoutsLock');
    
    if (tier !== 'ELITE') {
        workoutsTab.onclick = function() {
            alert('Upgrade to Premium Pack to access Workout Plans!\n\nClick "Upgrade" tab to unlock this feature.');
        };
        workoutsLock.style.display = 'inline';
    } else {
        workoutsTab.onclick = function() { switchTab('workouts'); };
        workoutsLock.style.display = 'none';
    }
}

// Nutrition Tracking Functions

// Add nutrition entry
function addNutritionEntry() {
    const calories = parseInt(document.getElementById('caloriesInput').value) || 0;
    const protein = parseInt(document.getElementById('proteinInput').value) || 0;
    const carbs = parseInt(document.getElementById('carbsInput').value) || 0;
    const sugar = parseInt(document.getElementById('sugarInput').value) || 0;
    
    if (calories === 0 && protein === 0 && carbs === 0 && sugar === 0) {
        alert('Please enter at least one nutrition value');
        return;
    }
    
    const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        calories: calories,
        protein: protein,
        carbs: carbs,
        sugar: sugar
    };
    
    // Get current user's entries
    const currentUser = getCurrentUser();
    const storageKey = `nutrition_${currentUser.email}`;
    const entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    entries.push(entry);
    localStorage.setItem(storageKey, JSON.stringify(entries));
    
    // Sync to Firebase if available
    if (isFirebaseReady() && currentUser.uid) {
        firebase.database().ref('users/' + currentUser.uid + '/nutrition/' + entry.id).set(entry);
    }
    
    // Clear inputs
    document.getElementById('caloriesInput').value = '';
    document.getElementById('proteinInput').value = '';
    document.getElementById('carbsInput').value = '';
    document.getElementById('sugarInput').value = '';
    
    // Reload data
    loadNutritionData();
    updateGoalProgress();
    
    // Show success feedback
    showSuccessMessage('Entry added successfully!');
}

// Load and display nutrition data
function loadNutritionData() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const storageKey = `nutrition_${currentUser.email}`;
    const entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Calculate today's totals
    const today = new Date().toDateString();
    const todayEntries = entries.filter(entry => 
        new Date(entry.date).toDateString() === today
    );
    
    const totals = todayEntries.reduce((acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        sugar: acc.sugar + entry.sugar
    }), { calories: 0, protein: 0, carbs: 0, sugar: 0 });
    
    // Update summary display
    document.getElementById('totalCalories').textContent = totals.calories;
    document.getElementById('totalProtein').textContent = totals.protein + 'g';
    document.getElementById('totalCarbs').textContent = totals.carbs + 'g';
    document.getElementById('totalSugar').textContent = totals.sugar + 'g';
    
    // Display entries list (most recent first)
    const entriesList = document.getElementById('entriesList');
    const recentEntries = entries.slice(-10).reverse();
    
    if (recentEntries.length === 0) {
        entriesList.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center; padding: 2rem;">No entries yet. Start tracking your nutrition!</p>';
    } else {
        entriesList.innerHTML = recentEntries.map(entry => {
            const entryDate = new Date(entry.date);
            const dateStr = entryDate.toLocaleDateString();
            const timeStr = entryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return `
                <div class="entry-item">
                    <div>
                        <div style="color: var(--color-text-secondary); font-size: 0.85rem; margin-bottom: 0.25rem;">
                            ${dateStr} at ${timeStr}
                        </div>
                        <div class="entry-data">
                            <span><strong>Cal:</strong> ${entry.calories}</span>
                            <span><strong>Protein:</strong> ${entry.protein}g</span>
                            <span><strong>Carbs:</strong> ${entry.carbs}g</span>
                            <span><strong>Sugar:</strong> ${entry.sugar}g</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Clear today's entries
function clearTodayEntries() {
    if (!confirm('Are you sure you want to clear today\'s entries?')) {
        return;
    }
    
    const currentUser = getCurrentUser();
    const storageKey = `nutrition_${currentUser.email}`;
    const entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const today = new Date().toDateString();
    const filteredEntries = entries.filter(entry => 
        new Date(entry.date).toDateString() !== today
    );
    
    localStorage.setItem(storageKey, JSON.stringify(filteredEntries));
    loadNutritionData();
    updateGoalProgress();
    
    showSuccessMessage('Today\'s entries cleared!');
}

// Goals Functions

// Save nutrition goals
function saveGoals() {
    const currentUser = getCurrentUser();
    
    // Check tier access
    if (currentUser.tier === 'FREE') {
        alert('Upgrade to Basic Pack or higher to set nutrition goals!');
        return;
    }
    
    const goalCalories = parseInt(document.getElementById('goalCalories').value) || 0;
    const goalProtein = parseInt(document.getElementById('goalProtein').value) || 0;
    const goalCarbs = parseInt(document.getElementById('goalCarbs').value) || 0;
    const goalSugar = parseInt(document.getElementById('goalSugar').value) || 0;
    
    if (goalCalories === 0 && goalProtein === 0 && goalCarbs === 0 && goalSugar === 0) {
        alert('Please enter at least one goal');
        return;
    }
    
    const goals = {
        calories: goalCalories,
        protein: goalProtein,
        carbs: goalCarbs,
        sugar: goalSugar,
        updatedAt: new Date().toISOString()
    };
    
    const storageKey = `goals_${currentUser.email}`;
    localStorage.setItem(storageKey, JSON.stringify(goals));
    
    // Sync to Firebase if available
    if (isFirebaseReady() && currentUser.uid) {
        firebase.database().ref('users/' + currentUser.uid + '/goals').set(goals);
    }
    
    loadGoals();
    updateGoalProgress();
    
    showSuccessMessage('Goals saved successfully!');
}

// Load goals
function loadGoals() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Try to load from Firebase first
    if (isFirebaseReady() && currentUser.uid) {
        firebase.database().ref('users/' + currentUser.uid + '/goals').once('value').then((snapshot) => {
            const goals = snapshot.val() || {};
            displayGoals(goals);
            
            // Also save to localStorage as cache
            const storageKey = `goals_${currentUser.email}`;
            localStorage.setItem(storageKey, JSON.stringify(goals));
        });
    } else {
        // Fallback to localStorage
        const storageKey = `goals_${currentUser.email}`;
        const goals = JSON.parse(localStorage.getItem(storageKey) || '{}');
        displayGoals(goals);
    }
}

// Display goals in UI
function displayGoals(goals) {
    // Update display
    if (goals.calories) {
        document.getElementById('displayGoalCalories').textContent = goals.calories;
        document.getElementById('goalCalories').value = goals.calories;
    } else {
        document.getElementById('displayGoalCalories').textContent = 'Not Set';
    }
    
    if (goals.protein) {
        document.getElementById('displayGoalProtein').textContent = goals.protein + 'g';
        document.getElementById('goalProtein').value = goals.protein;
    } else {
        document.getElementById('displayGoalProtein').textContent = 'Not Set';
    }
    
    if (goals.carbs) {
        document.getElementById('displayGoalCarbs').textContent = goals.carbs + 'g';
        document.getElementById('goalCarbs').value = goals.carbs;
    } else {
        document.getElementById('displayGoalCarbs').textContent = 'Not Set';
    }
    
    if (goals.sugar) {
        document.getElementById('displayGoalSugar').textContent = goals.sugar + 'g';
        document.getElementById('goalSugar').value = goals.sugar;
    } else {
        document.getElementById('displayGoalSugar').textContent = 'Not Set';
    }
}

// Update goal progress
function updateGoalProgress() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Get goals (try Firebase first, fallback to localStorage)
    const goalsKey = `goals_${currentUser.email}`;
    const goals = JSON.parse(localStorage.getItem(goalsKey) || '{}');
    
    if (!goals.calories && !goals.protein && !goals.carbs && !goals.sugar) {
        return;
    }
    
    // Get today's totals
    const nutritionKey = `nutrition_${currentUser.email}`;
    const entries = JSON.parse(localStorage.getItem(nutritionKey) || '[]');
    
    const today = new Date().toDateString();
    const todayEntries = entries.filter(entry => 
        new Date(entry.date).toDateString() === today
    );
    
    const totals = todayEntries.reduce((acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        sugar: acc.sugar + entry.sugar
    }), { calories: 0, protein: 0, carbs: 0, sugar: 0 });
    
    // Calculate and display progress for each metric
    if (goals.calories) {
        const caloriesProgress = Math.min((totals.calories / goals.calories) * 100, 100);
        document.getElementById('caloriesProgress').style.width = caloriesProgress + '%';
        document.getElementById('caloriesProgressText').textContent = Math.round(caloriesProgress) + '%';
        document.getElementById('caloriesConsumed').textContent = totals.calories;
        document.getElementById('caloriesTarget').textContent = goals.calories;
    }
    
    if (goals.protein) {
        const proteinProgress = Math.min((totals.protein / goals.protein) * 100, 100);
        document.getElementById('proteinProgress').style.width = proteinProgress + '%';
        document.getElementById('proteinProgressText').textContent = Math.round(proteinProgress) + '%';
        document.getElementById('proteinConsumed').textContent = totals.protein;
        document.getElementById('proteinTarget').textContent = goals.protein;
    }
    
    if (goals.carbs) {
        const carbsProgress = Math.min((totals.carbs / goals.carbs) * 100, 100);
        document.getElementById('carbsProgress').style.width = carbsProgress + '%';
        document.getElementById('carbsProgressText').textContent = Math.round(carbsProgress) + '%';
        document.getElementById('carbsConsumed').textContent = totals.carbs;
        document.getElementById('carbsTarget').textContent = goals.carbs;
    }
    
    if (goals.sugar) {
        const sugarProgress = Math.min((totals.sugar / goals.sugar) * 100, 100);
        document.getElementById('sugarProgress').style.width = sugarProgress + '%';
        document.getElementById('sugarProgressText').textContent = Math.round(sugarProgress) + '%';
        document.getElementById('sugarConsumed').textContent = totals.sugar;
        document.getElementById('sugarTarget').textContent = goals.sugar;
        
        // Change color if over limit
        const sugarBar = document.getElementById('sugarProgress');
        if (sugarProgress > 100) {
            sugarBar.style.background = 'linear-gradient(90deg, var(--color-accent), #ff6699)';
        } else {
            sugarBar.style.background = 'linear-gradient(90deg, var(--color-warning), var(--color-accent))';
        }
    }
}

// UI Helper Functions

// Show success message
function showSuccessMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--color-primary), #00dd77);
        color: var(--color-bg);
        padding: 1rem 1.5rem;
        border-radius: 10px;
        font-weight: 600;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => messageEl.remove(), 300);
    }, 2000);
}

// Add CSS animations for success message
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
