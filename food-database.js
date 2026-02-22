// ═══════════════════════════════════════════════════════════════════
// COMPREHENSIVE FOOD DATABASE
// All values are per 100g unless otherwise specified
// Data based on USDA FoodData Central
// ═══════════════════════════════════════════════════════════════════

const foodDatabase = {
    // PROTEINS - MEATS
    proteins: {
        // Chicken
        'Chicken Breast (cooked)': { calories: 165, protein: 31, carbs: 0, fat: 3.6, sugar: 0, serving: '100g' },
        'Chicken Thigh (cooked)': { calories: 209, protein: 26, carbs: 0, fat: 10.9, sugar: 0, serving: '100g' },
        'Chicken Wings (cooked)': { calories: 203, protein: 30, carbs: 0, fat: 8.1, sugar: 0, serving: '100g' },
        'Ground Chicken (cooked)': { calories: 143, protein: 25, carbs: 0, fat: 4, sugar: 0, serving: '100g' },
        
        // Beef
        'Ground Beef 90/10 (cooked)': { calories: 176, protein: 25, carbs: 0, fat: 8, sugar: 0, serving: '100g' },
        'Ground Beef 80/20 (cooked)': { calories: 254, protein: 26, carbs: 0, fat: 17, sugar: 0, serving: '100g' },
        'Sirloin Steak (cooked)': { calories: 201, protein: 29, carbs: 0, fat: 8.5, sugar: 0, serving: '100g' },
        'Ribeye Steak (cooked)': { calories: 291, protein: 25, carbs: 0, fat: 21, sugar: 0, serving: '100g' },
        'Beef Brisket (cooked)': { calories: 288, protein: 28, carbs: 0, fat: 19, sugar: 0, serving: '100g' },
        
        // Pork
        'Pork Chop (cooked)': { calories: 206, protein: 28, carbs: 0, fat: 9.7, sugar: 0, serving: '100g' },
        'Pork Tenderloin (cooked)': { calories: 143, protein: 26, carbs: 0, fat: 3.5, sugar: 0, serving: '100g' },
        'Bacon (cooked)': { calories: 541, protein: 37, carbs: 1.4, fat: 42, sugar: 1.3, serving: '100g' },
        'Ground Pork (cooked)': { calories: 297, protein: 25, carbs: 0, fat: 21, sugar: 0, serving: '100g' },
        
        // Turkey
        'Turkey Breast (cooked)': { calories: 135, protein: 30, carbs: 0, fat: 0.7, sugar: 0, serving: '100g' },
        'Ground Turkey (cooked)': { calories: 203, protein: 27, carbs: 0, fat: 10, sugar: 0, serving: '100g' },
        
        // Fish & Seafood
        'Salmon (cooked)': { calories: 206, protein: 22, carbs: 0, fat: 12, sugar: 0, serving: '100g' },
        'Tuna (canned in water)': { calories: 116, protein: 26, carbs: 0, fat: 0.8, sugar: 0, serving: '100g' },
        'Cod (cooked)': { calories: 105, protein: 23, carbs: 0, fat: 0.9, sugar: 0, serving: '100g' },
        'Tilapia (cooked)': { calories: 128, protein: 26, carbs: 0, fat: 2.7, sugar: 0, serving: '100g' },
        'Shrimp (cooked)': { calories: 99, protein: 24, carbs: 0.2, fat: 0.3, sugar: 0, serving: '100g' },
        'Crab (cooked)': { calories: 97, protein: 19, carbs: 0, fat: 1.5, sugar: 0, serving: '100g' },
        'Scallops (cooked)': { calories: 111, protein: 23, carbs: 0, fat: 1, sugar: 0, serving: '100g' },
        
        // Eggs & Dairy Proteins
        'Whole Egg (large)': { calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, sugar: 0.6, serving: '1 egg (50g)' },
        'Egg White (large)': { calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1, sugar: 0.2, serving: '1 egg white' },
        'Cottage Cheese (low-fat)': { calories: 72, protein: 12, carbs: 2.7, fat: 1, sugar: 2.7, serving: '100g' },
        'Greek Yogurt (plain, nonfat)': { calories: 59, protein: 10, carbs: 3.6, fat: 0.4, sugar: 3.2, serving: '100g' },
        'Greek Yogurt (plain, 2%)': { calories: 73, protein: 9, carbs: 5, fat: 2, sugar: 4.5, serving: '100g' },
    },
    
    // CARBOHYDRATES - GRAINS & STARCHES
    carbs: {
        // Rice
        'White Rice (cooked)': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, sugar: 0.1, serving: '100g' },
        'Brown Rice (cooked)': { calories: 112, protein: 2.6, carbs: 24, fat: 0.9, sugar: 0.2, serving: '100g' },
        'Jasmine Rice (cooked)': { calories: 129, protein: 2.7, carbs: 28, fat: 0.2, sugar: 0, serving: '100g' },
        'Basmati Rice (cooked)': { calories: 121, protein: 3, carbs: 25, fat: 0.4, sugar: 0, serving: '100g' },
        'Wild Rice (cooked)': { calories: 101, protein: 4, carbs: 21, fat: 0.3, sugar: 1, serving: '100g' },
        
        // Pasta
        'Pasta (cooked)': { calories: 131, protein: 5, carbs: 25, fat: 1.1, sugar: 0.6, serving: '100g' },
        'Whole Wheat Pasta (cooked)': { calories: 124, protein: 5.3, carbs: 26, fat: 0.5, sugar: 0.8, serving: '100g' },
        
        // Bread
        'White Bread': { calories: 265, protein: 9, carbs: 49, fat: 3.2, sugar: 5, serving: '100g (3.5 slices)' },
        'Whole Wheat Bread': { calories: 247, protein: 13, carbs: 41, fat: 3.4, sugar: 6, serving: '100g (3.5 slices)' },
        'Bagel (plain)': { calories: 257, protein: 10, carbs: 50, fat: 1.5, sugar: 5, serving: '100g' },
        'English Muffin': { calories: 235, protein: 8, carbs: 46, fat: 2, sugar: 2, serving: '100g' },
        'Pita Bread (white)': { calories: 275, protein: 9, carbs: 56, fat: 1.2, sugar: 3, serving: '100g' },
        
        // Potatoes
        'Sweet Potato (baked)': { calories: 90, protein: 2, carbs: 21, fat: 0.2, sugar: 6.5, serving: '100g' },
        'Potato (baked with skin)': { calories: 93, protein: 2.5, carbs: 21, fat: 0.1, sugar: 1.2, serving: '100g' },
        'Red Potato (boiled)': { calories: 87, protein: 1.9, carbs: 20, fat: 0.1, sugar: 1.3, serving: '100g' },
        'French Fries (baked)': { calories: 172, protein: 2.7, carbs: 28, fat: 5.5, sugar: 0.3, serving: '100g' },
        
        // Other Starches
        'Quinoa (cooked)': { calories: 120, protein: 4.4, carbs: 21, fat: 1.9, sugar: 0.9, serving: '100g' },
        'Oats (dry)': { calories: 389, protein: 17, carbs: 66, fat: 7, sugar: 1, serving: '100g' },
        'Oatmeal (cooked)': { calories: 71, protein: 2.5, carbs: 12, fat: 1.5, sugar: 0.3, serving: '100g' },
        'Couscous (cooked)': { calories: 112, protein: 3.8, carbs: 23, fat: 0.2, sugar: 0.1, serving: '100g' },
        'Tortilla (flour, 8-inch)': { calories: 304, protein: 8, carbs: 51, fat: 7, sugar: 2, serving: '100g' },
        'Tortilla (corn, 6-inch)': { calories: 218, protein: 5.7, carbs: 45, fat: 2.8, sugar: 1.1, serving: '100g' },
    },
    
    // FRUITS
    fruits: {
        'Banana (medium)': { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, sugar: 14, serving: '1 medium (118g)' },
        'Apple (medium)': { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, sugar: 19, serving: '1 medium (182g)' },
        'Orange (medium)': { calories: 62, protein: 1.2, carbs: 15, fat: 0.2, sugar: 12, serving: '1 medium (131g)' },
        'Grapes (1 cup)': { calories: 104, protein: 1.1, carbs: 27, fat: 0.2, sugar: 23, serving: '1 cup (151g)' },
        'Strawberries (1 cup)': { calories: 49, protein: 1, carbs: 12, fat: 0.5, sugar: 7, serving: '1 cup (152g)' },
        'Blueberries (1 cup)': { calories: 84, protein: 1.1, carbs: 21, fat: 0.5, sugar: 15, serving: '1 cup (148g)' },
        'Raspberries (1 cup)': { calories: 64, protein: 1.5, carbs: 15, fat: 0.8, sugar: 5.4, serving: '1 cup (123g)' },
        'Blackberries (1 cup)': { calories: 62, protein: 2, carbs: 14, fat: 0.7, sugar: 7, serving: '1 cup (144g)' },
        'Watermelon (1 cup)': { calories: 46, protein: 0.9, carbs: 11.5, fat: 0.2, sugar: 9.4, serving: '1 cup (152g)' },
        'Pineapple (1 cup)': { calories: 82, protein: 0.9, carbs: 22, fat: 0.2, sugar: 16, serving: '1 cup (165g)' },
        'Mango (1 cup)': { calories: 99, protein: 1.4, carbs: 25, fat: 0.6, sugar: 23, serving: '1 cup (165g)' },
        'Peach (medium)': { calories: 59, protein: 1.4, carbs: 14, fat: 0.4, sugar: 13, serving: '1 medium (150g)' },
        'Pear (medium)': { calories: 101, protein: 0.6, carbs: 27, fat: 0.2, sugar: 17, serving: '1 medium (178g)' },
        'Cherries (1 cup)': { calories: 87, protein: 1.5, carbs: 22, fat: 0.3, sugar: 18, serving: '1 cup (138g)' },
        'Kiwi (medium)': { calories: 42, protein: 0.8, carbs: 10, fat: 0.4, sugar: 6, serving: '1 medium (69g)' },
        'Avocado (half)': { calories: 120, protein: 1.5, carbs: 6, fat: 11, sugar: 0.5, serving: '1/2 avocado (68g)' },
    },
    
    // VEGETABLES
    vegetables: {
        'Broccoli (cooked)': { calories: 35, protein: 2.4, carbs: 7, fat: 0.4, sugar: 1.4, serving: '100g' },
        'Spinach (raw)': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, sugar: 0.4, serving: '100g' },
        'Carrots (raw)': { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, sugar: 5, serving: '100g' },
        'Bell Pepper (raw)': { calories: 31, protein: 1, carbs: 6, fat: 0.3, sugar: 4, serving: '100g' },
        'Tomato (medium)': { calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, sugar: 3.2, serving: '1 medium (123g)' },
        'Cucumber (raw)': { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, sugar: 1.7, serving: '100g' },
        'Lettuce (raw)': { calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, sugar: 0.8, serving: '100g' },
        'Cauliflower (cooked)': { calories: 23, protein: 1.8, carbs: 4.1, fat: 0.5, sugar: 2, serving: '100g' },
        'Zucchini (cooked)': { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, sugar: 2.5, serving: '100g' },
        'Asparagus (cooked)': { calories: 22, protein: 2.4, carbs: 4, fat: 0.2, sugar: 1.3, serving: '100g' },
        'Green Beans (cooked)': { calories: 35, protein: 1.9, carbs: 8, fat: 0.1, sugar: 1.6, serving: '100g' },
        'Brussels Sprouts (cooked)': { calories: 36, protein: 2.6, carbs: 7, fat: 0.5, sugar: 2.2, serving: '100g' },
        'Kale (raw)': { calories: 35, protein: 2.9, carbs: 4.4, fat: 1.5, sugar: 0.8, serving: '100g' },
        'Mushrooms (raw)': { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, sugar: 2, serving: '100g' },
        'Onion (raw)': { calories: 40, protein: 1.1, carbs: 9, fat: 0.1, sugar: 4.2, serving: '100g' },
    },
    
    // NUTS & SEEDS
    nuts: {
        'Almonds': { calories: 579, protein: 21, carbs: 22, fat: 50, sugar: 4.4, serving: '100g' },
        'Walnuts': { calories: 654, protein: 15, carbs: 14, fat: 65, sugar: 2.6, serving: '100g' },
        'Cashews': { calories: 553, protein: 18, carbs: 30, fat: 44, sugar: 6, serving: '100g' },
        'Peanuts (roasted)': { calories: 567, protein: 26, carbs: 16, fat: 49, sugar: 4, serving: '100g' },
        'Peanut Butter (2 tbsp)': { calories: 188, protein: 7.7, carbs: 7.7, fat: 16, sugar: 3.4, serving: '2 tbsp (32g)' },
        'Almond Butter (2 tbsp)': { calories: 196, protein: 6.7, carbs: 6, fat: 18, sugar: 2.1, serving: '2 tbsp (32g)' },
        'Pistachios': { calories: 560, protein: 20, carbs: 28, fat: 45, sugar: 8, serving: '100g' },
        'Pecans': { calories: 691, protein: 9, carbs: 14, fat: 72, sugar: 4, serving: '100g' },
        'Chia Seeds (2 tbsp)': { calories: 138, protein: 4.7, carbs: 12, fat: 8.7, sugar: 0, serving: '2 tbsp (28g)' },
        'Flax Seeds (2 tbsp)': { calories: 110, protein: 3.8, carbs: 6, fat: 8.7, sugar: 0.3, serving: '2 tbsp (21g)' },
        'Sunflower Seeds': { calories: 584, protein: 21, carbs: 20, fat: 51, sugar: 2.6, serving: '100g' },
    },
    
    // DAIRY & ALTERNATIVES
    dairy: {
        'Whole Milk (1 cup)': { calories: 149, protein: 7.7, carbs: 12, fat: 7.9, sugar: 12, serving: '1 cup (244g)' },
        '2% Milk (1 cup)': { calories: 122, protein: 8, carbs: 12, fat: 4.8, sugar: 12, serving: '1 cup (244g)' },
        'Skim Milk (1 cup)': { calories: 83, protein: 8.3, carbs: 12, fat: 0.2, sugar: 12, serving: '1 cup (245g)' },
        'Almond Milk Unsweetened (1 cup)': { calories: 39, protein: 1.5, carbs: 3.4, fat: 2.9, sugar: 2, serving: '1 cup (240g)' },
        'Oat Milk (1 cup)': { calories: 120, protein: 3, carbs: 16, fat: 5, sugar: 7, serving: '1 cup (240g)' },
        'Cheddar Cheese (1 slice)': { calories: 113, protein: 7, carbs: 0.4, fat: 9.3, sugar: 0.2, serving: '1 slice (28g)' },
        'Mozzarella Cheese (1 oz)': { calories: 85, protein: 6.3, carbs: 0.6, fat: 6.3, sugar: 0.4, serving: '1 oz (28g)' },
        'Feta Cheese (1 oz)': { calories: 75, protein: 4, carbs: 1.2, fat: 6, sugar: 1.2, serving: '1 oz (28g)' },
        'Parmesan Cheese (1 oz)': { calories: 111, protein: 10, carbs: 0.9, fat: 7.3, sugar: 0.2, serving: '1 oz (28g)' },
        'Cream Cheese (1 oz)': { calories: 99, protein: 1.8, carbs: 1.6, fat: 9.9, sugar: 1, serving: '1 oz (28g)' },
        'Butter (1 tbsp)': { calories: 102, protein: 0.1, carbs: 0, fat: 11.5, sugar: 0, serving: '1 tbsp (14g)' },
    },
    
    // PROTEIN SUPPLEMENTS & BARS
    supplements: {
        'Whey Protein Powder (1 scoop)': { calories: 120, protein: 24, carbs: 3, fat: 1.5, sugar: 1, serving: '1 scoop (30g)' },
        'Casein Protein Powder (1 scoop)': { calories: 120, protein: 24, carbs: 3, fat: 1, sugar: 1, serving: '1 scoop (33g)' },
        'Plant Protein Powder (1 scoop)': { calories: 110, protein: 20, carbs: 7, fat: 2, sugar: 1, serving: '1 scoop (30g)' },
        'Protein Bar (average)': { calories: 200, protein: 20, carbs: 24, fat: 7, sugar: 15, serving: '1 bar (60g)' },
        'Quest Bar': { calories: 190, protein: 21, carbs: 23, fat: 7, sugar: 1, serving: '1 bar (60g)' },
    },
    
    // BEVERAGES
    beverages: {
        'Coffee (black)': { calories: 2, protein: 0.3, carbs: 0, fat: 0, sugar: 0, serving: '1 cup (240ml)' },
        'Green Tea': { calories: 2, protein: 0.5, carbs: 0, fat: 0, sugar: 0, serving: '1 cup (240ml)' },
        'Orange Juice (1 cup)': { calories: 112, protein: 1.7, carbs: 26, fat: 0.5, sugar: 21, serving: '1 cup (248g)' },
        'Apple Juice (1 cup)': { calories: 114, protein: 0.2, carbs: 28, fat: 0.3, sugar: 24, serving: '1 cup (248g)' },
        'Sports Drink (1 cup)': { calories: 63, protein: 0, carbs: 17, fat: 0, sugar: 17, serving: '1 cup (240ml)' },
    },
    
    // FAST FOOD (Common Items)
    fastfood: {
        'McDonald\'s Big Mac': { calories: 563, protein: 26, carbs: 45, fat: 30, sugar: 9, serving: '1 burger' },
        'McDonald\'s Quarter Pounder': { calories: 530, protein: 31, carbs: 42, fat: 26, sugar: 10, serving: '1 burger' },
        'McDonald\'s 6pc Nuggets': { calories: 258, protein: 15, carbs: 16, fat: 15, sugar: 0, serving: '6 pieces' },
        'McDonald\'s Medium Fries': { calories: 378, protein: 4, carbs: 48, fat: 18, sugar: 0, serving: '1 medium' },
        'Chipotle Chicken Bowl': { calories: 500, protein: 40, carbs: 50, fat: 17, sugar: 2, serving: '1 bowl' },
        'Chipotle Burrito (chicken)': { calories: 965, protein: 52, carbs: 103, fat: 36, sugar: 5, serving: '1 burrito' },
        'Subway 6" Turkey': { calories: 280, protein: 18, carbs: 46, fat: 3.5, sugar: 7, serving: '6" sub' },
        'Domino\'s Pizza (1 slice)': { calories: 200, protein: 8, carbs: 25, fat: 7, sugar: 2, serving: '1 slice medium' },
    }
};

// Display food categories and items
function displayFoodDatabase() {
    const container = document.getElementById('foodCategoriesContainer');
    if (!container) return;
    
    const categories = {
        'proteins': '🥩 Proteins (Meats, Fish, Eggs)',
        'carbs': '🍚 Carbs (Rice, Pasta, Bread)',
        'fruits': '🍎 Fruits',
        'vegetables': '🥦 Vegetables',
        'nuts': '🥜 Nuts & Seeds',
        'dairy': '🥛 Dairy & Alternatives',
        'supplements': '💪 Protein Supplements',
        'beverages': '☕ Beverages',
        'fastfood': '🍔 Fast Food'
    };
    
    let html = '';
    
    for (const [categoryKey, categoryName] of Object.entries(categories)) {
        const foods = foodDatabase[categoryKey];
        
        html += `
            <div class="food-category" data-category="${categoryKey}">
                <h4 style="color: var(--color-primary); margin: 1rem 0 0.75rem 0; font-size: 1.05rem;">
                    ${categoryName}
                </h4>
                <div class="food-grid">
        `;
        
        for (const [foodName, nutrition] of Object.entries(foods)) {
            html += `
                <button class="food-item-btn" onclick="addFoodItem('${foodName.replace(/'/g, "\\'")}', ${nutrition.calories}, ${nutrition.protein}, ${nutrition.carbs}, ${nutrition.fat}, ${nutrition.sugar})" data-food-name="${foodName.toLowerCase()}">
                    <div class="food-name">${foodName}</div>
                    <div class="food-serving">${nutrition.serving}</div>
                    <div class="food-macros">
                        <span>${nutrition.calories} cal</span> •
                        <span>P: ${nutrition.protein}g</span> •
                        <span>C: ${nutrition.carbs}g</span> •
                        <span>F: ${nutrition.fat}g</span>
                    </div>
                </button>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Add food item to daily nutrition
function addFoodItem(name, calories, protein, carbs, fat, sugar) {
    console.log('🍽️ Adding food:', name);
    console.log('   Calories:', calories);
    console.log('   Protein:', protein + 'g');
    console.log('   Carbs:', carbs + 'g');
    console.log('   Fat:', fat + 'g');
    
    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Please log in to track nutrition');
        return;
    }
    
    // Get today's key
    const today = new Date().toISOString().split('T')[0];
    const dataKey = `nutrition_${currentUser.email}`;
    
    // Load existing data
    const allData = JSON.parse(localStorage.getItem(dataKey) || '{}');
    if (!allData[today]) {
        allData[today] = [];
    }
    
    // Add entry
    const entry = {
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        calories: calories,
        protein: protein,
        carbs: carbs,
        fat: fat,
        sugar: sugar,
        foodName: name
    };
    
    allData[today].push(entry);
    
    // Save to localStorage
    localStorage.setItem(dataKey, JSON.stringify(allData));
    
    // Sync to Firebase
    if (typeof isFirebaseReady === 'function' && isFirebaseReady() && currentUser.uid) {
        firebase.database().ref('users/' + currentUser.uid + '/nutrition/' + today).set(allData[today]);
    }
    
    // Update UI
    loadNutritionData();
    
    // Show success
    showSuccessMessage(`✅ Added: ${name}`);
    
    // Scroll to summary to see updated totals
    setTimeout(() => {
        document.querySelector('.summary-card')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Filter foods by search query
function filterFoods(query) {
    const searchTerm = query.toLowerCase().trim();
    const allFoodItems = document.querySelectorAll('.food-item-btn');
    const categories = document.querySelectorAll('.food-category');
    
    if (!searchTerm) {
        // Show all
        allFoodItems.forEach(item => item.style.display = 'flex');
        categories.forEach(cat => cat.style.display = 'block');
        return;
    }
    
    // Filter foods
    allFoodItems.forEach(item => {
        const foodName = item.getAttribute('data-food-name');
        if (foodName.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Hide empty categories
    categories.forEach(category => {
        const visibleItems = category.querySelectorAll('.food-item-btn[style="display: flex;"]');
        if (visibleItems.length === 0) {
            category.style.display = 'none';
        } else {
            category.style.display = 'block';
        }
    });
}

// Initialize food database on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayFoodDatabase);
} else {
    displayFoodDatabase();
}

// Export functions
window.addFoodItem = addFoodItem;
window.filterFoods = filterFoods;
window.displayFoodDatabase = displayFoodDatabase;
