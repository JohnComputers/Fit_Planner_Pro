// Main App Logic
// Handles nutrition tracking, goals, and app functionality

// Tab switching
function switchTab(tabName) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Check permissions before switching
    if (tabName === 'goals' && currentUser.tier === 'FREE') {
        alert('Upgrade to Basic Pack or higher to access Nutrition Goals!\n\nClick "Upgrade" tab to unlock this feature.');
        return;
    }
    
    if (tabName === 'workouts' && currentUser.tier !== 'ELITE') {
        alert('Upgrade to Premium Pack to access Workout Plans!\n\nClick "Upgrade" tab to unlock this feature.');
        return;
    }
    
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Add active class to clicked button
    if (event && event.target) {
        event.target.closest('.tab-btn').classList.add('active');
    } else {
        // Fallback if event is not available
        document.querySelector(`[onclick*="${tabName}"]`).classList.add('active');
    }
    
    // Update displays when switching tabs
    if (tabName === 'nutrition') {
        loadNutritionData();
    } else if (tabName === 'goals') {
        loadGoals();
        updateGoalProgress();
        setTimeout(() => {
            calculateWeeklyTrends();
            generateMealSuggestions();
        }, 100);
    } else if (tabName === 'workouts') {
        setTimeout(() => {
            loadWorkoutWeek();
        }, 100);
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
        goalsTab.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            alert('Upgrade to Basic Pack or higher to access Nutrition Goals!\n\nClick "Upgrade" tab to unlock this feature.');
        };
        goalsLock.style.display = 'inline';
    } else {
        goalsTab.onclick = null; // Remove the onclick handler
        goalsLock.style.display = 'none';
    }
    
    // Workouts tab (ELITE only)
    const workoutsTab = document.getElementById('workoutsTab');
    const workoutsLock = document.getElementById('workoutsLock');
    
    if (tier !== 'ELITE') {
        workoutsTab.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            alert('Upgrade to Premium Pack to access Workout Plans!\n\nClick "Upgrade" tab to unlock this feature.');
        };
        workoutsLock.style.display = 'inline';
    } else {
        workoutsTab.onclick = null; // Remove the onclick handler
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
        const caloriesProgress = Math.min((totals.calories / goals.calories) * 100, 150);
        const remaining = goals.calories - totals.calories;
        document.getElementById('caloriesProgress').style.width = Math.min(caloriesProgress, 100) + '%';
        document.getElementById('caloriesProgressText').textContent = Math.round(caloriesProgress) + '%';
        document.getElementById('caloriesConsumed').textContent = totals.calories;
        document.getElementById('caloriesTarget').textContent = goals.calories;
        
        const remainingEl = document.getElementById('caloriesRemaining');
        if (remaining > 0) {
            remainingEl.textContent = `${remaining} remaining`;
            remainingEl.style.color = 'var(--color-text-secondary)';
        } else {
            remainingEl.textContent = `${Math.abs(remaining)} over`;
            remainingEl.style.color = 'var(--color-accent)';
        }
    }
    
    if (goals.protein) {
        const proteinProgress = Math.min((totals.protein / goals.protein) * 100, 150);
        const remaining = goals.protein - totals.protein;
        document.getElementById('proteinProgress').style.width = Math.min(proteinProgress, 100) + '%';
        document.getElementById('proteinProgressText').textContent = Math.round(proteinProgress) + '%';
        document.getElementById('proteinConsumed').textContent = totals.protein;
        document.getElementById('proteinTarget').textContent = goals.protein;
        
        const remainingEl = document.getElementById('proteinRemaining');
        if (remaining > 0) {
            remainingEl.textContent = `${remaining}g remaining`;
            remainingEl.style.color = 'var(--color-text-secondary)';
        } else {
            remainingEl.textContent = `${Math.abs(remaining)}g over`;
            remainingEl.style.color = 'var(--color-primary)';
        }
    }
    
    if (goals.carbs) {
        const carbsProgress = Math.min((totals.carbs / goals.carbs) * 100, 150);
        const remaining = goals.carbs - totals.carbs;
        document.getElementById('carbsProgress').style.width = Math.min(carbsProgress, 100) + '%';
        document.getElementById('carbsProgressText').textContent = Math.round(carbsProgress) + '%';
        document.getElementById('carbsConsumed').textContent = totals.carbs;
        document.getElementById('carbsTarget').textContent = goals.carbs;
        
        const remainingEl = document.getElementById('carbsRemaining');
        if (remaining > 0) {
            remainingEl.textContent = `${remaining}g remaining`;
            remainingEl.style.color = 'var(--color-text-secondary)';
        } else {
            remainingEl.textContent = `${Math.abs(remaining)}g over`;
            remainingEl.style.color = 'var(--color-accent)';
        }
    }
    
    if (goals.sugar) {
        const sugarProgress = Math.min((totals.sugar / goals.sugar) * 100, 150);
        const remaining = goals.sugar - totals.sugar;
        document.getElementById('sugarProgress').style.width = Math.min(sugarProgress, 100) + '%';
        document.getElementById('sugarProgressText').textContent = Math.round(sugarProgress) + '%';
        document.getElementById('sugarConsumed').textContent = totals.sugar;
        document.getElementById('sugarTarget').textContent = goals.sugar;
        
        const remainingEl = document.getElementById('sugarRemaining');
        if (remaining > 0) {
            remainingEl.textContent = `${remaining}g remaining`;
            remainingEl.style.color = 'var(--color-text-secondary)';
        } else {
            remainingEl.textContent = `${Math.abs(remaining)}g over limit!`;
            remainingEl.style.color = 'var(--color-accent)';
        }
        
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

// Macro Calculator Functions

function calculateMacros() {
    const age = parseInt(document.getElementById('calcAge').value);
    const gender = document.getElementById('calcGender').value;
    const weight = parseInt(document.getElementById('calcWeight').value);
    const height = parseInt(document.getElementById('calcHeight').value);
    const activity = parseFloat(document.getElementById('calcActivity').value);
    const goal = document.getElementById('calcGoal').value;
    
    if (!age || !weight || !height) {
        alert('Please fill in all fields');
        return;
    }
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
        bmr = (10 * (weight * 0.453592)) + (6.25 * (height * 2.54)) - (5 * age) + 5;
    } else {
        bmr = (10 * (weight * 0.453592)) + (6.25 * (height * 2.54)) - (5 * age) - 161;
    }
    
    // Calculate TDEE
    let tdee = bmr * activity;
    
    // Adjust for goal
    let calories;
    if (goal === 'cut') {
        calories = Math.round(tdee * 0.8); // 20% deficit
    } else if (goal === 'bulk') {
        calories = Math.round(tdee * 1.1); // 10% surplus
    } else {
        calories = Math.round(tdee);
    }
    
    // Calculate macros
    const proteinGrams = Math.round(weight * 1.0); // 1g per lb
    const proteinCals = proteinGrams * 4;
    
    const fatGrams = Math.round(weight * 0.35); // 0.35g per lb
    const fatCals = fatGrams * 9;
    
    const carbCals = calories - proteinCals - fatCals;
    const carbGrams = Math.round(carbCals / 4);
    
    // Display results
    document.getElementById('resultCalories').textContent = calories;
    document.getElementById('resultProtein').textContent = proteinGrams + 'g';
    document.getElementById('resultCarbs').textContent = carbGrams + 'g';
    document.getElementById('resultFats').textContent = fatGrams + 'g';
    
    document.getElementById('calculatorResults').style.display = 'block';
    
    // Store calculated values for quick apply
    window.calculatedMacros = {
        calories: calories,
        protein: proteinGrams,
        carbs: carbGrams,
        fats: fatGrams
    };
}

function applyCalculatedMacros() {
    if (!window.calculatedMacros) return;
    
    document.getElementById('goalCalories').value = window.calculatedMacros.calories;
    document.getElementById('goalProtein').value = window.calculatedMacros.protein;
    document.getElementById('goalCarbs').value = window.calculatedMacros.carbs;
    
    showSuccessMessage('Calculated macros applied to your goals!');
    
    // Scroll to goals section
    document.querySelector('.goals-container').scrollIntoView({ behavior: 'smooth' });
}

// Weekly Trends Calculation

function calculateWeeklyTrends() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const nutritionKey = `nutrition_${currentUser.email}`;
    const entries = JSON.parse(localStorage.getItem(nutritionKey) || '[]');
    
    // Get last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentEntries = entries.filter(entry => 
        new Date(entry.date) >= sevenDaysAgo
    );
    
    if (recentEntries.length === 0) {
        return;
    }
    
    // Calculate averages
    const totals = recentEntries.reduce((acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein
    }), { calories: 0, protein: 0 });
    
    const avgCalories = Math.round(totals.calories / recentEntries.length);
    const avgProtein = Math.round(totals.protein / recentEntries.length);
    
    // Get goals for comparison
    const goalsKey = `goals_${currentUser.email}`;
    const goals = JSON.parse(localStorage.getItem(goalsKey) || '{}');
    
    // Calculate adherence (days within 10% of goals)
    let adherentDays = 0;
    const entriesByDay = {};
    
    recentEntries.forEach(entry => {
        const day = new Date(entry.date).toDateString();
        if (!entriesByDay[day]) {
            entriesByDay[day] = { calories: 0, protein: 0 };
        }
        entriesByDay[day].calories += entry.calories;
        entriesByDay[day].protein += entry.protein;
    });
    
    Object.values(entriesByDay).forEach(day => {
        if (goals.calories) {
            const calDiff = Math.abs(day.calories - goals.calories) / goals.calories;
            if (calDiff <= 0.1) adherentDays++;
        }
    });
    
    const adherenceRate = Math.round((adherentDays / Object.keys(entriesByDay).length) * 100);
    
    // Calculate streak
    const streak = calculateConsistencyStreak();
    
    // Update UI
    document.getElementById('avgCalories').textContent = avgCalories;
    document.getElementById('avgProtein').textContent = avgProtein + 'g';
    document.getElementById('adherenceRate').textContent = adherenceRate + '%';
    document.getElementById('consistencyStreak').textContent = streak + ' days';
    
    // Add trend indicators
    if (goals.calories) {
        const calDiff = avgCalories - goals.calories;
        const calTrend = document.getElementById('caloriesTrend');
        if (Math.abs(calDiff) <= goals.calories * 0.1) {
            calTrend.textContent = '✓ On target';
            calTrend.className = 'trend-comparison positive';
        } else if (calDiff > 0) {
            calTrend.textContent = `${calDiff} over target`;
            calTrend.className = 'trend-comparison';
        } else {
            calTrend.textContent = `${Math.abs(calDiff)} under target`;
            calTrend.className = 'trend-comparison';
        }
    }
    
    if (goals.protein) {
        const proteinDiff = avgProtein - goals.protein;
        const proteinTrend = document.getElementById('proteinTrend');
        if (proteinDiff >= 0) {
            proteinTrend.textContent = '✓ Meeting target';
            proteinTrend.className = 'trend-comparison positive';
        } else {
            proteinTrend.textContent = `${Math.abs(proteinDiff)}g under target`;
            proteinTrend.className = 'trend-comparison negative';
        }
    }
}

function calculateConsistencyStreak() {
    const currentUser = getCurrentUser();
    if (!currentUser) return 0;
    
    const nutritionKey = `nutrition_${currentUser.email}`;
    const entries = JSON.parse(localStorage.getItem(nutritionKey) || '[]');
    
    if (entries.length === 0) return 0;
    
    // Group entries by day
    const dayMap = {};
    entries.forEach(entry => {
        const day = new Date(entry.date).toDateString();
        dayMap[day] = true;
    });
    
    // Count consecutive days from today backwards
    let streak = 0;
    let currentDate = new Date();
    
    while (dayMap[currentDate.toDateString()]) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
}

// Meal Suggestions Based on Remaining Macros

function generateMealSuggestions() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Get goals and today's totals
    const goalsKey = `goals_${currentUser.email}`;
    const goals = JSON.parse(localStorage.getItem(goalsKey) || '{}');
    
    if (!goals.calories) return;
    
    const nutritionKey = `nutrition_${currentUser.email}`;
    const entries = JSON.parse(localStorage.getItem(nutritionKey) || '[]');
    
    const today = new Date().toDateString();
    const todayEntries = entries.filter(entry => 
        new Date(entry.date).toDateString() === today
    );
    
    const totals = todayEntries.reduce((acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs
    }), { calories: 0, protein: 0, carbs: 0 });
    
    const remaining = {
        calories: goals.calories - totals.calories,
        protein: goals.protein - totals.protein,
        carbs: (goals.carbs || 0) - totals.carbs
    };
    
    // Meal database
    const meals = [
        { name: 'Grilled Chicken Breast', icon: '🍗', calories: 165, protein: 31, carbs: 0, fat: 4 },
        { name: 'Greek Yogurt & Berries', icon: '🥣', calories: 150, protein: 15, carbs: 20, fat: 2 },
        { name: 'Salmon Fillet', icon: '🐟', calories: 280, protein: 40, carbs: 0, fat: 13 },
        { name: 'Protein Shake', icon: '🥤', calories: 120, protein: 25, carbs: 3, fat: 1 },
        { name: 'Sweet Potato', icon: '🍠', calories: 180, protein: 4, carbs: 41, fat: 0 },
        { name: 'Brown Rice Bowl', icon: '🍚', calories: 220, protein: 5, carbs: 46, fat: 2 },
        { name: 'Egg White Omelet', icon: '🍳', calories: 140, protein: 24, carbs: 2, fat: 3 },
        { name: 'Lean Beef Steak', icon: '🥩', calories: 250, protein: 36, carbs: 0, fat: 11 },
        { name: 'Quinoa Salad', icon: '🥗', calories: 200, protein: 8, carbs: 30, fat: 6 },
        { name: 'Tuna Sandwich', icon: '🥪', calories: 300, protein: 25, carbs: 35, fat: 7 }
    ];
    
    // Find best matches based on remaining macros
    const suggestions = meals
        .map(meal => {
            const calDiff = Math.abs(meal.calories - remaining.calories);
            const proteinDiff = Math.abs(meal.protein - remaining.protein);
            const score = -(calDiff + proteinDiff * 2); // Weight protein more
            return { ...meal, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    
    // Display suggestions
    const container = document.getElementById('mealSuggestions');
    if (!container) return;
    
    if (remaining.calories <= 100) {
        container.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center;">You\'re at your calorie goal! Great job! 🎯</p>';
        return;
    }
    
    container.innerHTML = suggestions.map(meal => `
        <div class="suggestion-card">
            <div class="suggestion-header">
                <span class="suggestion-icon">${meal.icon}</span>
                <span class="suggestion-title">${meal.name}</span>
            </div>
            <div class="suggestion-macros">
                <div class="suggestion-macro">
                    <strong>${meal.calories}</strong>
                    <span>cal</span>
                </div>
                <div class="suggestion-macro">
                    <strong>${meal.protein}g</strong>
                    <span>protein</span>
                </div>
                <div class="suggestion-macro">
                    <strong>${meal.carbs}g</strong>
                    <span>carbs</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Workout Tracking Functions

function toggleWorkoutDay(day) {
    const checkCircle = document.getElementById(`check-${day}`);
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Get current week's workout data
    const workoutKey = `workouts_${currentUser.email}`;
    const workouts = JSON.parse(localStorage.getItem(workoutKey) || '{}');
    
    // Get current week identifier
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    const weekId = weekStart.toISOString().split('T')[0];
    
    if (!workouts[weekId]) {
        workouts[weekId] = {};
    }
    
    // Toggle the day
    workouts[weekId][day] = !workouts[weekId][day];
    
    // Save to storage
    localStorage.setItem(workoutKey, JSON.stringify(workouts));
    
    // Sync to Firebase if available
    if (isFirebaseReady() && currentUser.uid) {
        firebase.database().ref('users/' + currentUser.uid + '/workouts/' + weekId).set(workouts[weekId]);
    }
    
    // Update UI
    if (workouts[weekId][day]) {
        checkCircle.classList.add('checked');
    } else {
        checkCircle.classList.remove('checked');
    }
    
    // Update summary
    updateWeekSummary();
}

function loadWorkoutWeek() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const workoutKey = `workouts_${currentUser.email}`;
    const workouts = JSON.parse(localStorage.getItem(workoutKey) || '{}');
    
    // Get current week
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekId = weekStart.toISOString().split('T')[0];
    
    const thisWeek = workouts[weekId] || {};
    
    // Update UI
    ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach(day => {
        const checkCircle = document.getElementById(`check-${day}`);
        if (checkCircle) {
            if (thisWeek[day]) {
                checkCircle.classList.add('checked');
            } else {
                checkCircle.classList.remove('checked');
            }
        }
    });
    
    updateWeekSummary();
}

function updateWeekSummary() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const workoutKey = `workouts_${currentUser.email}`;
    const workouts = JSON.parse(localStorage.getItem(workoutKey) || '{}');
    
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekId = weekStart.toISOString().split('T')[0];
    
    const thisWeek = workouts[weekId] || {};
    const workoutCount = Object.values(thisWeek).filter(Boolean).length;
    
    document.getElementById('weekWorkouts').textContent = workoutCount;
    
    // Calculate overall streak
    const allDays = Object.keys(workouts).sort().reverse();
    let streak = 0;
    let checkDate = new Date();
    
    for (let i = 0; i < 30; i++) {
        const dateStr = checkDate.toISOString().split('T')[0];
        const weekIdForDate = dateStr;
        const dayName = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][checkDate.getDay()];
        
        let found = false;
        for (let week in workouts) {
            if (workouts[week][dayName]) {
                found = true;
                break;
            }
        }
        
        if (found) {
            streak++;
        } else {
            break;
        }
        
        checkDate.setDate(checkDate.getDate() - 1);
    }
    
    document.getElementById('weekStreak').textContent = streak;
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
