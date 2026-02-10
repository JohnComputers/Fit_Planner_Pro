// Personalization Survey System
// Collects user data and generates customized workout/nutrition plans

// Show personalization survey after tier upgrade
function showPersonalizationSurvey(tier) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Check if user already has a profile
    const profileKey = `profile_${currentUser.email}`;
    const existingProfile = JSON.parse(localStorage.getItem(profileKey) || 'null');
    
    // Always show survey for new tier upgrade
    createSurveyModal(tier, existingProfile);
}

// Create the survey modal
function createSurveyModal(tier, existingProfile) {
    const modal = document.createElement('div');
    modal.id = 'personalizationModal';
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    const surveyStep = existingProfile ? 2 : 1; // Skip to step 2 if profile exists
    
    modal.innerHTML = `
        <div class="modal-content personalization-modal">
            <div class="personalization-header">
                <h2>🎯 Let's Personalize Your Experience</h2>
                <p>Answer a few questions to get your customized ${tier} plan</p>
                <div class="progress-dots">
                    <span class="dot active" id="dot1"></span>
                    <span class="dot" id="dot2"></span>
                    <span class="dot" id="dot3"></span>
                </div>
            </div>
            
            <!-- Step 1: Basic Info -->
            <div class="survey-step active" id="step1">
                <h3>About You</h3>
                <div class="survey-inputs">
                    <div class="input-group">
                        <label>Age</label>
                        <input type="number" id="surveyAge" value="${existingProfile?.age || ''}" placeholder="25" min="13" max="100">
                    </div>
                    <div class="input-group">
                        <label>Gender</label>
                        <select id="surveyGender">
                            <option value="male" ${existingProfile?.gender === 'male' ? 'selected' : ''}>Male</option>
                            <option value="female" ${existingProfile?.gender === 'female' ? 'selected' : ''}>Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Current Weight (lbs)</label>
                        <input type="number" id="surveyWeight" value="${existingProfile?.weight || ''}" placeholder="170" step="0.1">
                    </div>
                    <div class="input-group">
                        <label>Height (inches)</label>
                        <input type="number" id="surveyHeight" value="${existingProfile?.height || ''}" placeholder="70">
                        <small style="color: var(--color-text-secondary);">Tip: 5'10" = 70 inches</small>
                    </div>
                    <div class="input-group">
                        <label>Target Weight (lbs)</label>
                        <input type="number" id="surveyTargetWeight" value="${existingProfile?.targetWeight || ''}" placeholder="165" step="0.1">
                    </div>
                </div>
                <button onclick="nextSurveyStep(2)" class="btn-primary">Next</button>
            </div>
            
            <!-- Step 2: Fitness Level & Goals -->
            <div class="survey-step" id="step2">
                <h3>Your Fitness Journey</h3>
                <div class="survey-inputs">
                    <div class="input-group">
                        <label>Primary Goal</label>
                        <select id="surveyGoal">
                            <option value="lose_fat" ${existingProfile?.goal === 'lose_fat' ? 'selected' : ''}>Lose Fat / Get Lean</option>
                            <option value="build_muscle" ${existingProfile?.goal === 'build_muscle' ? 'selected' : ''}>Build Muscle / Bulk Up</option>
                            <option value="get_toned" ${existingProfile?.goal === 'get_toned' ? 'selected' : ''}>Get Toned / Athletic</option>
                            <option value="maintain" ${existingProfile?.goal === 'maintain' ? 'selected' : ''}>Maintain / Stay Healthy</option>
                            <option value="strength" ${existingProfile?.goal === 'strength' ? 'selected' : ''}>Build Strength</option>
                            <option value="endurance" ${existingProfile?.goal === 'endurance' ? 'selected' : ''}>Improve Endurance</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Current Fitness Level</label>
                        <select id="surveyFitnessLevel">
                            <option value="beginner" ${existingProfile?.fitnessLevel === 'beginner' ? 'selected' : ''}>Beginner (0-6 months training)</option>
                            <option value="intermediate" ${existingProfile?.fitnessLevel === 'intermediate' ? 'selected' : ''}>Intermediate (6 months - 2 years)</option>
                            <option value="advanced" ${existingProfile?.fitnessLevel === 'advanced' ? 'selected' : ''}>Advanced (2+ years)</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Activity Level</label>
                        <select id="surveyActivity">
                            <option value="1.2" ${existingProfile?.activityLevel == 1.2 ? 'selected' : ''}>Sedentary (desk job, little exercise)</option>
                            <option value="1.375" ${existingProfile?.activityLevel == 1.375 ? 'selected' : ''}>Lightly Active (1-3 days/week)</option>
                            <option value="1.55" ${existingProfile?.activityLevel == 1.55 ? 'selected' : ''}>Moderately Active (3-5 days/week)</option>
                            <option value="1.725" ${existingProfile?.activityLevel == 1.725 ? 'selected' : ''}>Very Active (6-7 days/week)</option>
                            <option value="1.9" ${existingProfile?.activityLevel == 1.9 ? 'selected' : ''}>Extremely Active (athlete/physical job)</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>How many days can you workout?</label>
                        <select id="surveyWorkoutDays">
                            <option value="3" ${existingProfile?.workoutDays == 3 ? 'selected' : ''}>3 days per week</option>
                            <option value="4" ${existingProfile?.workoutDays == 4 ? 'selected' : ''}>4 days per week</option>
                            <option value="5" ${existingProfile?.workoutDays == 5 ? 'selected' : ''}>5 days per week</option>
                            <option value="6" ${existingProfile?.workoutDays == 6 ? 'selected' : ''}>6 days per week</option>
                        </select>
                    </div>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button onclick="previousSurveyStep(1)" class="btn-secondary">Back</button>
                    <button onclick="nextSurveyStep(3)" class="btn-primary">Next</button>
                </div>
            </div>
            
            <!-- Step 3: Preferences & Restrictions -->
            <div class="survey-step" id="step3">
                <h3>Final Details</h3>
                <div class="survey-inputs">
                    <div class="input-group">
                        <label>Dietary Preferences</label>
                        <select id="surveyDiet">
                            <option value="none" ${existingProfile?.diet === 'none' ? 'selected' : ''}>No Restrictions</option>
                            <option value="vegetarian" ${existingProfile?.diet === 'vegetarian' ? 'selected' : ''}>Vegetarian</option>
                            <option value="vegan" ${existingProfile?.diet === 'vegan' ? 'selected' : ''}>Vegan</option>
                            <option value="keto" ${existingProfile?.diet === 'keto' ? 'selected' : ''}>Keto / Low Carb</option>
                            <option value="paleo" ${existingProfile?.diet === 'paleo' ? 'selected' : ''}>Paleo</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Equipment Available</label>
                        <select id="surveyEquipment">
                            <option value="full_gym" ${existingProfile?.equipment === 'full_gym' ? 'selected' : ''}>Full Gym Access</option>
                            <option value="basic" ${existingProfile?.equipment === 'basic' ? 'selected' : ''}>Basic Equipment (dumbbells, bench)</option>
                            <option value="minimal" ${existingProfile?.equipment === 'minimal' ? 'selected' : ''}>Minimal (bodyweight, resistance bands)</option>
                            <option value="home" ${existingProfile?.equipment === 'home' ? 'selected' : ''}>Home Gym</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Any injuries or limitations?</label>
                        <textarea id="surveyLimitations" placeholder="e.g., bad knee, lower back issues, shoulder injury..." style="
                            width: 100%;
                            padding: 0.875rem;
                            background: var(--color-surface);
                            border: 2px solid var(--color-border);
                            border-radius: 10px;
                            color: var(--color-text);
                            font-family: inherit;
                            min-height: 80px;
                        ">${existingProfile?.limitations || ''}</textarea>
                        <small style="color: var(--color-text-secondary);">This helps us modify exercises for your safety</small>
                    </div>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button onclick="previousSurveyStep(2)" class="btn-secondary">Back</button>
                    <button onclick="completeSurvey()" class="btn-primary">Generate My Plan!</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // If existing profile, skip to step 2
    if (existingProfile && surveyStep === 2) {
        nextSurveyStep(2);
    }
}

// Navigate survey steps
function nextSurveyStep(step) {
    // Validate current step
    const currentStep = document.querySelector('.survey-step.active');
    const inputs = currentStep.querySelectorAll('input[required], select[required]');
    
    for (let input of inputs) {
        if (!input.value) {
            alert('Please fill in all required fields');
            return;
        }
    }
    
    // Hide current step
    document.querySelectorAll('.survey-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
    
    // Show next step
    document.getElementById(`step${step}`).classList.add('active');
    document.getElementById(`dot${step}`).classList.add('active');
}

function previousSurveyStep(step) {
    document.querySelectorAll('.survey-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
    
    document.getElementById(`step${step}`).classList.add('active');
    document.getElementById(`dot${step}`).classList.add('active');
}

// Complete survey and generate personalized plan
function completeSurvey() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Collect all survey data
    const profile = {
        // Step 1
        age: parseInt(document.getElementById('surveyAge').value),
        gender: document.getElementById('surveyGender').value,
        weight: parseFloat(document.getElementById('surveyWeight').value),
        height: parseInt(document.getElementById('surveyHeight').value),
        targetWeight: parseFloat(document.getElementById('surveyTargetWeight').value),
        
        // Step 2
        goal: document.getElementById('surveyGoal').value,
        fitnessLevel: document.getElementById('surveyFitnessLevel').value,
        activityLevel: parseFloat(document.getElementById('surveyActivity').value),
        workoutDays: parseInt(document.getElementById('surveyWorkoutDays').value),
        
        // Step 3
        diet: document.getElementById('surveyDiet').value,
        equipment: document.getElementById('surveyEquipment').value,
        limitations: document.getElementById('surveyLimitations').value,
        
        // Meta
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Validate
    if (!profile.age || !profile.weight || !profile.height) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Save profile
    const profileKey = `profile_${currentUser.email}`;
    localStorage.setItem(profileKey, JSON.stringify(profile));
    
    // Sync to Firebase
    if (isFirebaseReady() && currentUser.uid) {
        firebase.database().ref('users/' + currentUser.uid + '/profile').set(profile);
    }
    
    // Generate personalized nutrition goals
    generatePersonalizedNutrition(profile);
    
    // Generate personalized workout plan (for ELITE tier)
    if (currentUser.tier === 'ELITE') {
        generatePersonalizedWorkout(profile);
    }
    
    // Close survey
    document.getElementById('personalizationModal').remove();
    
    // Show success message
    showSuccessMessage('Your personalized plan is ready!');
    
    // Navigate to appropriate tab
    if (currentUser.tier === 'ELITE') {
        setTimeout(() => switchTab('workouts'), 500);
    } else {
        setTimeout(() => switchTab('goals'), 500);
    }
}

// Generate personalized nutrition goals
function generatePersonalizedNutrition(profile) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Calculate BMR using Mifflin-St Jeor
    const weightKg = profile.weight * 0.453592;
    const heightCm = profile.height * 2.54;
    
    let bmr;
    if (profile.gender === 'male') {
        bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * profile.age) + 5;
    } else {
        bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * profile.age) - 161;
    }
    
    // Calculate TDEE
    const tdee = bmr * profile.activityLevel;
    
    // Adjust for goal
    let calories;
    if (profile.goal === 'lose_fat') {
        calories = Math.round(tdee * 0.8); // 20% deficit
    } else if (profile.goal === 'build_muscle') {
        calories = Math.round(tdee * 1.1); // 10% surplus
    } else if (profile.goal === 'get_toned') {
        calories = Math.round(tdee * 0.95); // Small deficit
    } else if (profile.goal === 'strength') {
        calories = Math.round(tdee * 1.05); // Small surplus
    } else {
        calories = Math.round(tdee); // Maintenance
    }
    
    // Calculate macros based on goal
    let proteinGrams, carbGrams, fatGrams;
    
    if (profile.goal === 'lose_fat' || profile.goal === 'get_toned') {
        proteinGrams = Math.round(profile.weight * 1.2); // High protein for cutting
        fatGrams = Math.round(profile.weight * 0.35);
        const remainingCals = calories - (proteinGrams * 4) - (fatGrams * 9);
        carbGrams = Math.round(remainingCals / 4);
    } else if (profile.goal === 'build_muscle' || profile.goal === 'strength') {
        proteinGrams = Math.round(profile.weight * 1.0); // 1g per lb
        fatGrams = Math.round(profile.weight * 0.4);
        const remainingCals = calories - (proteinGrams * 4) - (fatGrams * 9);
        carbGrams = Math.round(remainingCals / 4);
    } else {
        proteinGrams = Math.round(profile.weight * 0.8);
        fatGrams = Math.round(profile.weight * 0.35);
        const remainingCals = calories - (proteinGrams * 4) - (fatGrams * 9);
        carbGrams = Math.round(remainingCals / 4);
    }
    
    // Adjust for diet type
    if (profile.diet === 'keto') {
        carbGrams = Math.round(calories * 0.05 / 4); // 5% carbs
        fatGrams = Math.round((calories - (proteinGrams * 4) - (carbGrams * 4)) / 9);
    }
    
    // Save goals
    const goals = {
        calories: calories,
        protein: proteinGrams,
        carbs: carbGrams,
        sugar: 50, // Standard recommendation
        generatedFrom: 'personalization',
        updatedAt: new Date().toISOString()
    };
    
    const goalsKey = `goals_${currentUser.email}`;
    localStorage.setItem(goalsKey, JSON.stringify(goals));
    
    // Sync to Firebase
    if (isFirebaseReady() && currentUser.uid) {
        firebase.database().ref('users/' + currentUser.uid + '/goals').set(goals);
    }
    
    // Update UI
    loadGoals();
}

// Generate personalized workout plan
function generatePersonalizedWorkout(profile) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Create workout plan based on profile
    const workoutPlan = {
        schedule: generateWorkoutSchedule(profile),
        exercises: customizeExercises(profile),
        generatedAt: new Date().toISOString()
    };
    
    const planKey = `workout_plan_${currentUser.email}`;
    localStorage.setItem(planKey, JSON.stringify(workoutPlan));
    
    // Sync to Firebase
    if (isFirebaseReady() && currentUser.uid) {
        firebase.database().ref('users/' + currentUser.uid + '/workoutPlan').set(workoutPlan);
    }
}

// Generate workout schedule based on days available
function generateWorkoutSchedule(profile) {
    const schedules = {
        3: { name: 'Push-Pull-Legs (3 day)', split: ['Push', 'Pull', 'Legs'] },
        4: { name: 'Upper-Lower (4 day)', split: ['Upper Push', 'Lower', 'Upper Pull', 'Lower'] },
        5: { name: 'PPL + Upper-Lower', split: ['Push', 'Pull', 'Legs', 'Upper', 'Lower'] },
        6: { name: 'PPL x2', split: ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs'] }
    };
    
    return schedules[profile.workoutDays] || schedules[6];
}

// Customize exercises based on equipment and limitations
function customizeExercises(profile) {
    // This would contain logic to swap exercises based on:
    // - Equipment available
    // - Injuries/limitations
    // - Fitness level
    // Returns modified exercise list
    
    return {
        equipment: profile.equipment,
        modifications: profile.limitations,
        level: profile.fitnessLevel
    };
}

// Get user profile
function getUserProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;
    
    const profileKey = `profile_${currentUser.email}`;
    return JSON.parse(localStorage.getItem(profileKey) || 'null');
}

// Display profile in UI
function displayProfile() {
    const profile = getUserProfile();
    if (!profile) return;
    
    // Show nutrition profile banner
    const nutritionBanner = document.getElementById('nutritionProfileBanner');
    if (nutritionBanner) {
        nutritionBanner.style.display = 'flex';
        document.getElementById('profileAge').textContent = profile.age;
        document.getElementById('profileWeight').textContent = profile.weight + ' lbs';
        
        // Format goal name
        const goalNames = {
            'lose_fat': 'Fat Loss',
            'build_muscle': 'Build Muscle',
            'get_toned': 'Get Toned',
            'maintain': 'Maintain',
            'strength': 'Strength',
            'endurance': 'Endurance'
        };
        document.getElementById('profileGoal').textContent = goalNames[profile.goal] || profile.goal;
    }
    
    // Show workout profile banner
    const workoutBanner = document.getElementById('workoutProfileBanner');
    if (workoutBanner) {
        workoutBanner.style.display = 'flex';
        
        const levelNames = {
            'beginner': 'Beginner',
            'intermediate': 'Intermediate',
            'advanced': 'Advanced'
        };
        document.getElementById('profileFitnessLevel').textContent = levelNames[profile.fitnessLevel] || profile.fitnessLevel;
        document.getElementById('profileWorkoutDays').textContent = profile.workoutDays + ' days';
        
        const equipmentNames = {
            'full_gym': 'Full Gym',
            'basic': 'Basic',
            'minimal': 'Minimal',
            'home': 'Home Gym'
        };
        document.getElementById('profileEquipment').textContent = equipmentNames[profile.equipment] || profile.equipment;
    }
    
    // Add personalized badges
    const nutritionBadge = document.getElementById('personalizedBadgeNutrition');
    const workoutBadge = document.getElementById('personalizedBadgeWorkout');
    
    if (nutritionBadge) {
        nutritionBadge.innerHTML = '<span class="personalized-badge">Personalized</span>';
    }
    if (workoutBadge) {
        workoutBadge.innerHTML = '<span class="personalized-badge">Personalized</span>';
    }
}

// Edit profile (opens survey again with current values)
function editProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    showPersonalizationSurvey(currentUser.tier);
}

// Check if user needs to complete profile
function checkProfileCompletion() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Only check for paid tiers
    if (currentUser.tier === 'FREE') return;
    
    const profile = getUserProfile();
    
    // If no profile exists and user has been a member for >1 minute, show survey
    if (!profile) {
        const userKey = `user_${currentUser.email}_created`;
        const created = localStorage.getItem(userKey);
        
        if (!created) {
            localStorage.setItem(userKey, new Date().toISOString());
        } else {
            const createdDate = new Date(created);
            const now = new Date();
            const minutesSinceCreation = (now - createdDate) / 1000 / 60;
            
            // If user has been around for 1+ minutes without completing profile, prompt them
            if (minutesSinceCreation > 1) {
                setTimeout(() => {
                    if (confirm('Complete your profile to get personalized nutrition and workout plans!\n\nWould you like to do this now?')) {
                        showPersonalizationSurvey(currentUser.tier);
                    }
                }, 2000);
            }
        }
    }
}

// Initialize profile display on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        displayProfile();
        checkProfileCompletion();
    });
} else {
    displayProfile();
    checkProfileCompletion();
}

// Export functions
window.showPersonalizationSurvey = showPersonalizationSurvey;
window.nextSurveyStep = nextSurveyStep;
window.previousSurveyStep = previousSurveyStep;
window.completeSurvey = completeSurvey;
window.getUserProfile = getUserProfile;
window.displayProfile = displayProfile;
window.editProfile = editProfile;
