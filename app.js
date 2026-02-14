// Main App Logic
// Handles nutrition tracking, goals, and app functionality

// Tab switching
function switchTab(tabName) {
    console.log('🔄 switchTab called:', tabName);
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.error('❌ No current user');
        return;
    }
    
    console.log('👤 User tier:', currentUser.tier);
    
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (!selectedTab) {
        console.error('❌ Tab element not found:', tabName + 'Tab');
        return;
    }
    
    selectedTab.classList.add('active');
    console.log('✅ Activated tab:', tabName + 'Tab');
    
    // Activate the corresponding button
    const buttonMapping = {
        'goals': 'goalsTab',
        'workouts': 'workoutsTab'
    };
    
    if (buttonMapping[tabName]) {
        const button = document.getElementById(buttonMapping[tabName]);
        if (button) {
            button.classList.add('active');
            console.log('✅ Activated button:', buttonMapping[tabName]);
        }
    } else {
        // For tabs with inline onclick, find by onclick attribute
        buttons.forEach(btn => {
            const onclickAttr = btn.getAttribute('onclick');
            if (onclickAttr && onclickAttr.includes(tabName)) {
                btn.classList.add('active');
            }
        });
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
            loadRecipes();
            if (typeof displayProfile === 'function') {
                displayProfile();
            }
        }, 100);
    } else if (tabName === 'workouts') {
        if (typeof loadWorkoutPlan === 'function') {
            loadWorkoutPlan();
        }
    }
    
    console.log('✅ Tab switch complete');
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
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Please log in to track nutrition');
        return;
    }
    
    // Get input values
    const calories = parseInt(document.getElementById('caloriesInput').value) || 0;
    const protein = parseInt(document.getElementById('proteinInput').value) || 0;
    const carbs = parseInt(document.getElementById('carbsInput').value) || 0;
    const sugar = parseInt(document.getElementById('sugarInput').value) || 0;
    
    // Validation
    if (calories === 0 && protein === 0 && carbs === 0 && sugar === 0) {
        showTooltip(
            document.getElementById('caloriesInput'),
            'Please enter at least one value to track!'
        );
        return;
    }
    
    // Sanity checks with helpful messages
    if (calories < 0 || protein < 0 || carbs < 0 || sugar < 0) {
        alert('⚠️ Values cannot be negative!\n\nPlease enter positive numbers.');
        return;
    }
    
    if (calories > 5000) {
        confirmDialog(
            'That\'s a lot of calories! (over 5000)\n\nAre you sure this is correct?',
            () => saveEntry(),
            () => document.getElementById('caloriesInput').focus()
        );
        return;
    }
    
    if (protein > 300) {
        confirmDialog(
            'That\'s a lot of protein! (over 300g)\n\nAre you sure this is correct?',
            () => saveEntry(),
            () => document.getElementById('proteinInput').focus()
        );
        return;
    }
    
    // If values look reasonable, save directly
    saveEntry();
    
    function saveEntry() {
        const entry = {
            id: Date.now(),
            date: new Date().toISOString(),
            calories: calories,
            protein: protein,
            carbs: carbs,
            sugar: sugar
        };
        
        // Get current user's entries
        const storageKey = `nutrition_${currentUser.email}`;
        const entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        entries.push(entry);
        localStorage.setItem(storageKey, JSON.stringify(entries));
        
        // Sync to Firebase if available
        if (isFirebaseReady() && currentUser.uid) {
            firebase.database().ref('users/' + currentUser.uid + '/nutrition/' + entry.id).set(entry);
        }
        
        // Clear inputs with animation
        const inputs = ['caloriesInput', 'proteinInput', 'carbsInput', 'sugarInput'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            input.style.transform = 'scale(0.95)';
            setTimeout(() => {
                input.value = '';
                input.style.transform = 'scale(1)';
            }, 100);
        });
        
        // Reload data
        loadNutritionData();
        updateGoalProgress();
        
        // Show success feedback with celebration
        celebrateSuccess('Meal Tracked! 🎯');
        
        // Update meal suggestions if on goals tab
        if (typeof generateMealSuggestions === 'function') {
            setTimeout(() => generateMealSuggestions(), 500);
        }
    }
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
        entriesList.innerHTML = `
            <div style="text-align: center; padding: 3rem 2rem; color: var(--color-text-secondary);">
                <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;">🍽️</div>
                <h3 style="color: var(--color-text); margin-bottom: 0.5rem; font-size: 1.5rem;">No entries yet!</h3>
                <p style="margin-bottom: 2rem; line-height: 1.6;">Start tracking your nutrition by adding your first meal above.</p>
                <div style="background: rgba(0, 255, 136, 0.05); padding: 1rem; border-radius: 8px; border-left: 3px solid var(--color-primary);">
                    <strong style="color: var(--color-primary);">💡 Pro Tip:</strong>
                    <p style="margin: 0.5rem 0 0 0;">Enter the macros from your food's nutrition label. Most packaged foods show calories, protein, carbs, and sugar!</p>
                </div>
            </div>
        `;
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
        
        // Show helpful tip for first-time users
        if (entries.length === 1) {
            setTimeout(() => {
                safeShowFirstTimeTip('first_entry', 'Great start! Keep tracking to see your progress over time 📊', 5000);
            }, 1000);
        }
    }
    
    // Update goal progress if goals are set
    updateGoalProgress();
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
    const hasAnyGoals = goals.calories || goals.protein || goals.carbs || goals.sugar;
    
    // Update display
    if (goals.calories) {
        document.getElementById('displayGoalCalories').textContent = goals.calories;
        document.getElementById('goalCalories').value = goals.calories;
    } else {
        document.getElementById('displayGoalCalories').textContent = 'Not Set';
        document.getElementById('goalCalories').value = '';
    }
    
    if (goals.protein) {
        document.getElementById('displayGoalProtein').textContent = goals.protein + 'g';
        document.getElementById('goalProtein').value = goals.protein;
    } else {
        document.getElementById('displayGoalProtein').textContent = 'Not Set';
        document.getElementById('goalProtein').value = '';
    }
    
    if (goals.carbs) {
        document.getElementById('displayGoalCarbs').textContent = goals.carbs + 'g';
        document.getElementById('goalCarbs').value = goals.carbs;
    } else {
        document.getElementById('displayGoalCarbs').textContent = 'Not Set';
        document.getElementById('goalCarbs').value = '';
    }
    
    if (goals.sugar) {
        document.getElementById('displayGoalSugar').textContent = goals.sugar + 'g';
        document.getElementById('goalSugar').value = goals.sugar;
    } else {
        document.getElementById('displayGoalSugar').textContent = 'Not Set';
        document.getElementById('goalSugar').value = '';
    }
    
    // Show macro breakdown if goals exist
    const macroBreakdown = document.getElementById('macroBreakdown');
    if (macroBreakdown && hasAnyGoals && goals.calories && goals.protein && goals.carbs) {
        macroBreakdown.style.display = 'block';
        
        // Calculate percentages
        const proteinCals = (goals.protein || 0) * 4;
        const carbsCals = (goals.carbs || 0) * 4;
        const fatCals = (goals.calories || 0) - proteinCals - carbsCals;
        
        const proteinPct = Math.round((proteinCals / goals.calories) * 100);
        const carbsPct = Math.round((carbsCals / goals.calories) * 100);
        const fatsPct = 100 - proteinPct - carbsPct;
        
        document.getElementById('proteinPercentage').textContent = proteinPct + '%';
        document.getElementById('carbsPercentage').textContent = carbsPct + '%';
        document.getElementById('fatsPercentage').textContent = fatsPct + '%';
    } else if (macroBreakdown) {
        macroBreakdown.style.display = 'none';
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
    
    // Enhanced meal database
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
        { name: 'Tuna Sandwich', icon: '🥪', calories: 300, protein: 25, carbs: 35, fat: 7 },
        { name: 'Protein Pancakes', icon: '🥞', calories: 280, protein: 22, carbs: 32, fat: 6 },
        { name: 'Chicken & Rice', icon: '🍛', calories: 450, protein: 42, carbs: 52, fat: 8 }
    ];
    
    // Find best matches
    const suggestions = meals
        .map(meal => {
            const calDiff = Math.abs(meal.calories - remaining.calories);
            const proteinDiff = Math.abs(meal.protein - remaining.protein);
            const score = -(calDiff + proteinDiff * 2);
            return { ...meal, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    
    const container = document.getElementById('mealSuggestions');
    if (!container) return;
    
    if (remaining.calories <= 100) {
        container.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center; padding: 2rem;">You\'re at your calorie goal! Great job! 🎯</p>';
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

// Weekly Meal Plan Generator

function generateWeeklyMealPlan() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const goalsKey = `goals_${currentUser.email}`;
    const goals = JSON.parse(localStorage.getItem(goalsKey) || '{}');
    
    if (!goals.calories) {
        alert('Please set your nutrition goals first!');
        return;
    }
    
    const targetCals = goals.calories;
    const targetProtein = goals.protein;
    
    const mealTemplates = {
        breakfast: [
            { name: 'Protein Oatmeal with Berries', cals: Math.round(targetCals * 0.25), protein: Math.round(targetProtein * 0.25) },
            { name: 'Egg White Scramble with Toast', cals: Math.round(targetCals * 0.25), protein: Math.round(targetProtein * 0.3) },
            { name: 'Greek Yogurt Parfait', cals: Math.round(targetCals * 0.2), protein: Math.round(targetProtein * 0.25) },
            { name: 'Protein Pancakes with Fruit', cals: Math.round(targetCals * 0.28), protein: Math.round(targetProtein * 0.27) }
        ],
        lunch: [
            { name: 'Grilled Chicken Salad', cals: Math.round(targetCals * 0.35), protein: Math.round(targetProtein * 0.4) },
            { name: 'Turkey Wrap with Veggies', cals: Math.round(targetCals * 0.32), protein: Math.round(targetProtein * 0.35) },
            { name: 'Salmon Bowl with Quinoa', cals: Math.round(targetCals * 0.38), protein: Math.round(targetProtein * 0.42) },
            { name: 'Lean Beef Stir-Fry', cals: Math.round(targetCals * 0.36), protein: Math.round(targetProtein * 0.38) }
        ],
        dinner: [
            { name: 'Chicken Breast with Sweet Potato', cals: Math.round(targetCals * 0.35), protein: Math.round(targetProtein * 0.35) },
            { name: 'Fish Tacos with Rice', cals: Math.round(targetCals * 0.33), protein: Math.round(targetProtein * 0.32) },
            { name: 'Lean Steak with Vegetables', cals: Math.round(targetCals * 0.37), protein: Math.round(targetProtein * 0.38) },
            { name: 'Turkey Meatballs with Pasta', cals: Math.round(targetCals * 0.35), protein: Math.round(targetProtein * 0.33) }
        ]
    };
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const plan = days.map((day, i) => {
        const breakfast = mealTemplates.breakfast[i % mealTemplates.breakfast.length];
        const lunch = mealTemplates.lunch[i % mealTemplates.lunch.length];
        const dinner = mealTemplates.dinner[i % mealTemplates.dinner.length];
        
        const totalCals = breakfast.cals + lunch.cals + dinner.cals;
        const totalProtein = breakfast.protein + lunch.protein + dinner.protein;
        
        return { day, breakfast, lunch, dinner, totalCals, totalProtein };
    });
    
    const container = document.getElementById('weeklyMealPlan');
    container.innerHTML = plan.map(dayPlan => `
        <div class="meal-day-card">
            <div class="meal-day-header">
                <span class="meal-day-title">${dayPlan.day}</span>
                <span class="meal-day-macros">${dayPlan.totalCals} cal • ${dayPlan.totalProtein}g protein</span>
            </div>
            <div class="meal-slots">
                <div class="meal-slot">
                    <div class="meal-slot-header">🌅 Breakfast</div>
                    <div class="meal-slot-content">${dayPlan.breakfast.name} - ${dayPlan.breakfast.cals} cal, ${dayPlan.breakfast.protein}g protein</div>
                </div>
                <div class="meal-slot">
                    <div class="meal-slot-header">☀️ Lunch</div>
                    <div class="meal-slot-content">${dayPlan.lunch.name} - ${dayPlan.lunch.cals} cal, ${dayPlan.lunch.protein}g protein</div>
                </div>
                <div class="meal-slot">
                    <div class="meal-slot-header">🌙 Dinner</div>
                    <div class="meal-slot-content">${dayPlan.dinner.name} - ${dayPlan.dinner.cals} cal, ${dayPlan.dinner.protein}g protein</div>
                </div>
            </div>
        </div>
    `).join('');
    
    showSuccessMessage('7-day meal plan generated!');
}

// Recipe Database

const recipeDatabase = [
    { id: 1, name: 'Chicken & Broccoli', icon: '🥦', category: 'lunch', tags: ['high-protein'], cals: 380, protein: 45, carbs: 25, fat: 12, description: 'Simple, clean, and protein-packed' },
    { id: 2, name: 'Protein Smoothie Bowl', icon: '🥤', category: 'breakfast', tags: ['high-protein'], cals: 320, protein: 35, carbs: 28, fat: 8, description: 'Refreshing and filling breakfast' },
    { id: 3, name: 'Salmon & Asparagus', icon: '🐟', category: 'dinner', tags: ['high-protein'], cals: 420, protein: 48, carbs: 12, fat: 18, description: 'Omega-3 rich dinner option' },
    { id: 4, name: 'Egg White Omelet', icon: '🍳', category: 'breakfast', tags: ['high-protein', 'low-carb'], cals: 180, protein: 28, carbs: 6, fat: 4, description: 'Perfect morning protein boost' },
    { id: 5, name: 'Turkey Chili', icon: '🍲', category: 'dinner', tags: ['high-protein'], cals: 350, protein: 38, carbs: 32, fat: 8, description: 'Hearty and satisfying' },
    { id: 6, name: 'Greek Yogurt Parfait', icon: '🥣', category: 'snacks', tags: ['high-protein'], cals: 220, protein: 22, carbs: 28, fat: 3, description: 'Great pre or post workout' },
    { id: 7, name: 'Cauliflower Rice Bowl', icon: '🍚', category: 'lunch', tags: ['low-carb'], cals: 280, protein: 32, carbs: 18, fat: 10, description: 'Low-carb lunch option' },
    { id: 8, name: 'Protein Pancakes', icon: '🥞', category: 'breakfast', tags: ['high-protein'], cals: 310, protein: 28, carbs: 35, fat: 7, description: 'Weekend breakfast treat' },
    { id: 9, name: 'Tuna Lettuce Wraps', icon: '🥬', category: 'lunch', tags: ['low-carb', 'high-protein'], cals: 200, protein: 30, carbs: 8, fat: 6, description: 'Light and refreshing lunch' },
    { id: 10, name: 'Beef & Veggie Stir-Fry', icon: '🥘', category: 'dinner', tags: ['high-protein'], cals: 450, protein: 42, carbs: 35, fat: 15, description: 'Quick weeknight dinner' },
    { id: 11, name: 'Cottage Cheese Bowl', icon: '🥛', category: 'snacks', tags: ['high-protein', 'low-carb'], cals: 160, protein: 24, carbs: 10, fat: 4, description: 'Perfect before bed snack' },
    { id: 12, name: 'Chicken Fajitas', icon: '🌮', category: 'dinner', tags: ['high-protein'], cals: 420, protein: 45, carbs: 38, fat: 12, description: 'Flavorful and filling' }
];

function loadRecipes() {
    displayRecipes(recipeDatabase);
}

function filterRecipes(filter) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    let filtered = recipeDatabase;
    
    if (filter !== 'all') {
        filtered = recipeDatabase.filter(recipe => 
            recipe.category === filter || recipe.tags.includes(filter)
        );
    }
    
    displayRecipes(filtered);
}

function displayRecipes(recipes) {
    const container = document.getElementById('recipeGrid');
    if (!container) return;
    
    container.innerHTML = recipes.map(recipe => `
        <div class="recipe-card" onclick="showRecipeDetails(${recipe.id})">
            <div class="recipe-image">${recipe.icon}</div>
            <div class="recipe-content">
                <div class="recipe-title">${recipe.name}</div>
                <div class="recipe-description">${recipe.description}</div>
                <div class="recipe-macros-row">
                    <div class="recipe-macro-item">
                        <span class="recipe-macro-value">${recipe.cals}</span>
                        <span class="recipe-macro-label">cal</span>
                    </div>
                    <div class="recipe-macro-item">
                        <span class="recipe-macro-value">${recipe.protein}g</span>
                        <span class="recipe-macro-label">protein</span>
                    </div>
                    <div class="recipe-macro-item">
                        <span class="recipe-macro-value">${recipe.carbs}g</span>
                        <span class="recipe-macro-label">carbs</span>
                    </div>
                    <div class="recipe-macro-item">
                        <span class="recipe-macro-value">${recipe.fat}g</span>
                        <span class="recipe-macro-label">fat</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function showRecipeDetails(recipeId) {
    const recipe = recipeDatabase.find(r => r.id === recipeId);
    if (!recipe) return;
    
    alert(`${recipe.name}\n\nMacros:\n• ${recipe.cals} calories\n• ${recipe.protein}g protein\n• ${recipe.carbs}g carbs\n• ${recipe.fat}g fat\n\n${recipe.description}\n\nDetailed recipe instructions would appear here in a modal!`);
}

// Rest Timer

let timerInterval = null;
let timerSeconds = 120;
let timerRunning = false;

function setTimer(seconds) {
    timerSeconds = seconds;
    updateTimerDisplay();
}

function startTimer() {
    if (timerRunning) return;
    
    timerRunning = true;
    timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
        } else {
            pauseTimer();
            playTimerAlert();
        }
    }, 1000);
}

function pauseTimer() {
    timerRunning = false;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 120;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    document.getElementById('timerMinutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('timerSeconds').textContent = String(seconds).padStart(2, '0');
}

function playTimerAlert() {
    alert('⏰ Rest period complete! Time to lift!');
}

// Personal Records Tracker

function openPRModal(exercise) {
    const weight = prompt(`Enter your new PR weight for ${exercise} (in lbs):`);
    const reps = prompt('How many reps?');
    
    if (!weight || !reps) return;
    
    savePR(exercise, parseInt(weight), parseInt(reps));
}

function savePR(exercise, weight, reps) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const prKey = `prs_${currentUser.email}`;
    const prs = JSON.parse(localStorage.getItem(prKey) || '{}');
    
    if (!prs[exercise]) {
        prs[exercise] = [];
    }
    
    prs[exercise].push({
        weight: weight,
        reps: reps,
        date: new Date().toISOString(),
        oneRM: Math.round(weight * (1 + reps / 30)) // Epley formula
    });
    
    localStorage.setItem(prKey, JSON.stringify(prs));
    
    // Sync to Firebase
    if (isFirebaseReady() && currentUser.uid) {
        firebase.database().ref('users/' + currentUser.uid + '/prs').set(prs);
    }
    
    loadPRs();
    showSuccessMessage(`New PR logged for ${exercise}!`);
}

function loadPRs() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const prKey = `prs_${currentUser.email}`;
    const prs = JSON.parse(localStorage.getItem(prKey) || '{}');
    
    ['bench', 'squat', 'deadlift', 'ohp'].forEach(exercise => {
        const exercisePRs = prs[exercise] || [];
        if (exercisePRs.length > 0) {
            const sorted = exercisePRs.sort((a, b) => b.oneRM - a.oneRM);
            const best1RM = sorted[0];
            const best5RM = sorted.find(pr => pr.reps >= 5);
            
            document.getElementById(`${exercise}-1rm`).textContent = `${best1RM.weight} lbs`;
            if (best5RM) {
                document.getElementById(`${exercise}-5rm`).textContent = `${best5RM.weight} lbs`;
            }
        }
    });
}

// Body Measurements

function saveMeasurements() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const measurement = {
        date: new Date().toISOString(),
        weight: parseFloat(document.getElementById('measureWeight').value) || null,
        bodyFat: parseFloat(document.getElementById('measureBodyFat').value) || null,
        chest: parseFloat(document.getElementById('measureChest').value) || null,
        waist: parseFloat(document.getElementById('measureWaist').value) || null,
        arms: parseFloat(document.getElementById('measureArms').value) || null,
        legs: parseFloat(document.getElementById('measureLegs').value) || null
    };
    
    if (!measurement.weight && !measurement.chest && !measurement.waist) {
        alert('Please enter at least one measurement');
        return;
    }
    
    const measureKey = `measurements_${currentUser.email}`;
    const measurements = JSON.parse(localStorage.getItem(measureKey) || '[]');
    
    measurements.push(measurement);
    localStorage.setItem(measureKey, JSON.stringify(measurements));
    
    // Sync to Firebase
    if (isFirebaseReady() && currentUser.uid) {
        firebase.database().ref('users/' + currentUser.uid + '/measurements').set(measurements);
    }
    
    // Clear inputs
    document.getElementById('measureWeight').value = '';
    document.getElementById('measureBodyFat').value = '';
    document.getElementById('measureChest').value = '';
    document.getElementById('measureWaist').value = '';
    document.getElementById('measureArms').value = '';
    document.getElementById('measureLegs').value = '';
    
    loadMeasurements();
    showSuccessMessage('Measurements saved!');
}

function loadMeasurements() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const measureKey = `measurements_${currentUser.email}`;
    const measurements = JSON.parse(localStorage.getItem(measureKey) || '[]');
    
    if (measurements.length === 0) return;
    
    const latest = measurements[measurements.length - 1];
    const previous = measurements.length > 1 ? measurements[measurements.length - 2] : null;
    
    const progressHTML = `
        ${generateMeasurementStat('Weight', latest.weight, previous?.weight, 'lbs')}
        ${generateMeasurementStat('Body Fat', latest.bodyFat, previous?.bodyFat, '%')}
        ${generateMeasurementStat('Chest', latest.chest, previous?.chest, '"')}
        ${generateMeasurementStat('Waist', latest.waist, previous?.waist, '"')}
        ${generateMeasurementStat('Arms', latest.arms, previous?.arms, '"')}
        ${generateMeasurementStat('Legs', latest.legs, previous?.legs, '"')}
    `;
    
    document.getElementById('measurementProgress').innerHTML = progressHTML;
    
    // History
    const historyHTML = measurements.slice(-5).reverse().map(m => {
        const date = new Date(m.date).toLocaleDateString();
        return `
            <div class="timeline-item">
                <div class="timeline-date">${date}</div>
                <div class="timeline-data">
                    ${m.weight ? `Weight: ${m.weight} lbs` : ''}
                    ${m.chest ? `Chest: ${m.chest}"` : ''}
                    ${m.waist ? `Waist: ${m.waist}"` : ''}
                    ${m.arms ? `Arms: ${m.arms}"` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('measurementHistory').innerHTML = historyHTML;
}

function generateMeasurementStat(label, current, previous, unit) {
    if (!current) return '';
    
    let changeHTML = '';
    if (previous && current !== previous) {
        const diff = current - previous;
        const changeClass = diff > 0 ? 'positive' : 'negative';
        const sign = diff > 0 ? '+' : '';
        changeHTML = `<span class="measurement-change ${changeClass}">${sign}${diff.toFixed(1)}${unit}</span>`;
    }
    
    return `
        <div class="measurement-stat-item">
            <span class="measurement-stat-label">${label}</span>
            <span>
                <span class="measurement-stat-value">${current}${unit}</span>
                ${changeHTML}
            </span>
        </div>
    `;
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

// Success message display
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--color-primary), #00dd77);
        color: var(--color-bg);
        padding: 1rem 2rem;
        border-radius: 10px;
        font-weight: 600;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

// Safe wrappers for UX functions (in case ux-enhancements.js not loaded)
function safeShowTooltip(element, message, duration) {
    if (typeof showTooltip === 'function') {
        showTooltip(element, message, duration);
    } else {
        alert(message);
    }
}

function safeConfirmDialog(message, onConfirm, onCancel) {
    if (typeof confirmDialog === 'function') {
        confirmDialog(message, onConfirm, onCancel);
    } else {
        if (confirm(message)) {
            if (onConfirm) onConfirm();
        } else {
            if (onCancel) onCancel();
        }
    }
}

function safeCelebrateSuccess(message) {
    if (typeof celebrateSuccess === 'function') {
        celebrateSuccess(message);
    } else {
        showSuccessMessage(message);
    }
}

function safeShowFirstTimeTip(key, message, duration) {
    if (typeof showFirstTimeTip === 'function') {
        showFirstTimeTip(key, message, duration);
    }
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

// Initialize app when DOM is ready
function initializeApp() {
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        // User is logged in, load their data
        console.log('🔄 Initializing app for user:', currentUser.email);
        
        // Display today's date
        updateTodayDate();
        
        // Load nutrition data for active tab
        setTimeout(() => {
            loadNutritionData();
            updateGoalProgress();
        }, 100);
        
        // Display profile if exists
        if (typeof displayProfile === 'function') {
            setTimeout(() => displayProfile(), 200);
        }
    }
}

// Update today's date display
function updateTodayDate() {
    const todayDateEl = document.getElementById('todayDate');
    if (todayDateEl) {
        const today = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        todayDateEl.textContent = today.toLocaleDateString('en-US', options);
    }
}

// Run initialization when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Update date every minute (in case app stays open overnight)
setInterval(updateTodayDate, 60000);
