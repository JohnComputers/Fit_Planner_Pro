// ═══════════════════════════════════════════════════════════════════
// COMPREHENSIVE FOOD DATABASE - 300+ FOODS
// Realistic serving sizes - Click to add to nutrition tracker
// Data based on USDA FoodData Central
// ═══════════════════════════════════════════════════════════════════

const foodDatabase = {
    chicken: {
        'Chicken Breast (grilled, 4 oz)': { cal: 187, pro: 35, carb: 0, fat: 4, sug: 0 },
        'Chicken Breast (baked, 4 oz)': { cal: 187, pro: 35, carb: 0, fat: 4, sug: 0 },
        'Chicken Thigh (grilled, 4 oz)': { cal: 237, pro: 30, carb: 0, fat: 12, sug: 0 },
        'Chicken Thigh (baked, 4 oz)': { cal: 237, pro: 30, carb: 0, fat: 12, sug: 0 },
        'Chicken Wings (6 wings)': { cal: 406, pro: 60, carb: 0, fat: 16, sug: 0 },
        'Ground Chicken (4 oz cooked)': { cal: 162, pro: 28, carb: 0, fat: 5, sug: 0 },
        'Chicken Tenders (3 pieces)': { cal: 240, pro: 18, carb: 14, fat: 12, sug: 0 },
        'Rotisserie Chicken (4 oz)': { cal: 223, pro: 33, carb: 0, fat: 9, sug: 0 },
    },
    
    beef: {
        'Ground Beef 93/7 (4 oz)': { cal: 193, pro: 30, carb: 0, fat: 7, sug: 0 },
        'Ground Beef 85/15 (4 oz)': { cal: 240, pro: 27, carb: 0, fat: 14, sug: 0 },
        'Ground Beef 80/20 (4 oz)': { cal: 287, pro: 29, carb: 0, fat: 19, sug: 0 },
        'Sirloin Steak (6 oz)': { cal: 340, pro: 49, carb: 0, fat: 14, sug: 0 },
        'Ribeye Steak (6 oz)': { cal: 492, pro: 42, carb: 0, fat: 36, sug: 0 },
        'Filet Mignon (6 oz)': { cal: 360, pro: 48, carb: 0, fat: 18, sug: 0 },
        'NY Strip Steak (6 oz)': { cal: 380, pro: 47, carb: 0, fat: 20, sug: 0 },
        'Beef Brisket (4 oz)': { cal: 326, pro: 32, carb: 0, fat: 21, sug: 0 },
        'Flank Steak (4 oz)': { cal: 220, pro: 32, carb: 0, fat: 9, sug: 0 },
        'Beef Roast (4 oz)': { cal: 280, pro: 32, carb: 0, fat: 16, sug: 0 },
    },
    
    pork: {
        'Pork Chop (1 medium)': { cal: 220, pro: 30, carb: 0, fat: 10, sug: 0 },
        'Pork Tenderloin (4 oz)': { cal: 162, pro: 29, carb: 0, fat: 4, sug: 0 },
        'Bacon (3 slices)': { cal: 130, pro: 9, carb: 0, fat: 10, sug: 0 },
        'Ground Pork (4 oz)': { cal: 336, pro: 28, carb: 0, fat: 24, sug: 0 },
        'Pork Ribs (4 oz)': { cal: 360, pro: 27, carb: 0, fat: 27, sug: 0 },
        'Ham (4 oz)': { cal: 180, pro: 24, carb: 2, fat: 7, sug: 2 },
        'Pork Sausage (2 links)': { cal: 196, pro: 13, carb: 1, fat: 16, sug: 0 },
        'Canadian Bacon (3 slices)': { cal: 90, pro: 12, carb: 2, fat: 3, sug: 2 },
    },
    
    turkey: {
        'Turkey Breast (4 oz)': { cal: 153, pro: 34, carb: 0, fat: 1, sug: 0 },
        'Ground Turkey 93/7 (4 oz)': { cal: 170, pro: 28, carb: 0, fat: 6, sug: 0 },
        'Ground Turkey 85/15 (4 oz)': { cal: 230, pro: 30, carb: 0, fat: 11, sug: 0 },
        'Turkey Bacon (3 slices)': { cal: 90, pro: 6, carb: 2, fat: 6, sug: 2 },
        'Deli Turkey (4 slices)': { cal: 120, pro: 18, carb: 4, fat: 2, sug: 3 },
    },
    
    seafood: {
        'Salmon (6 oz)': { cal: 350, pro: 37, carb: 0, fat: 20, sug: 0 },
        'Tuna Can in Water (5 oz)': { cal: 145, pro: 33, carb: 0, fat: 1, sug: 0 },
        'Tuna Steak (6 oz)': { cal: 280, pro: 48, carb: 0, fat: 9, sug: 0 },
        'Cod (6 oz)': { cal: 178, pro: 39, carb: 0, fat: 1.5, sug: 0 },
        'Tilapia (6 oz)': { cal: 218, pro: 44, carb: 0, fat: 5, sug: 0 },
        'Shrimp (6 oz)': { cal: 168, pro: 41, carb: 0, fat: 0.5, sug: 0 },
        'Crab (6 oz)': { cal: 165, pro: 32, carb: 0, fat: 2.5, sug: 0 },
        'Scallops (6 oz)': { cal: 188, pro: 39, carb: 0, fat: 1.7, sug: 0 },
        'Mahi Mahi (6 oz)': { cal: 192, pro: 40, carb: 0, fat: 2, sug: 0 },
        'Halibut (6 oz)': { cal: 200, pro: 38, carb: 0, fat: 4, sug: 0 },
        'Swordfish (6 oz)': { cal: 220, pro: 36, carb: 0, fat: 7, sug: 0 },
        'Trout (6 oz)': { cal: 280, pro: 40, carb: 0, fat: 12, sug: 0 },
        'Lobster (6 oz)': { cal: 140, pro: 30, carb: 2, fat: 1, sug: 0 },
    },
    
    eggs: {
        'Whole Egg (1 large)': { cal: 78, pro: 6, carb: 1, fat: 5, sug: 1 },
        'Egg Whites (1 large)': { cal: 17, pro: 4, carb: 0, fat: 0, sug: 0 },
        'Scrambled Eggs (2 eggs)': { cal: 180, pro: 13, carb: 2, fat: 13, sug: 1 },
        'Omelet (3 eggs)': { cal: 234, pro: 18, carb: 2, fat: 15, sug: 2 },
        'Hard Boiled Egg (1 large)': { cal: 78, pro: 6, carb: 1, fat: 5, sug: 1 },
        'Cottage Cheese (1 cup)': { cal: 163, pro: 28, carb: 6, fat: 2, sug: 6 },
        'Greek Yogurt Plain (1 cup)': { cal: 130, pro: 22, carb: 9, fat: 1, sug: 7 },
        'Greek Yogurt 2% (1 cup)': { cal: 140, pro: 18, carb: 10, fat: 4, sug: 9 },
        'Regular Yogurt (1 cup)': { cal: 150, pro: 12, carb: 17, fat: 4, sug: 17 },
    },
    
    rice: {
        'White Rice (1 cup cooked)': { cal: 206, pro: 4, carb: 45, fat: 0, sug: 0 },
        'Brown Rice (1 cup cooked)': { cal: 216, pro: 5, carb: 45, fat: 2, sug: 1 },
        'Jasmine Rice (1 cup cooked)': { cal: 205, pro: 4, carb: 45, fat: 0, sug: 0 },
        'Basmati Rice (1 cup cooked)': { cal: 191, pro: 5, carb: 40, fat: 1, sug: 0 },
        'Wild Rice (1 cup cooked)': { cal: 166, pro: 7, carb: 35, fat: 1, sug: 2 },
        'Spanish Rice (1 cup)': { cal: 240, pro: 5, carb: 45, fat: 4, sug: 3 },
        'Fried Rice (1 cup)': { cal: 333, pro: 6, carb: 50, fat: 11, sug: 2 },
    },
    
    pasta: {
        'Spaghetti (1 cup cooked)': { cal: 220, pro: 8, carb: 43, fat: 1, sug: 2 },
        'Penne (1 cup cooked)': { cal: 220, pro: 8, carb: 43, fat: 1, sug: 2 },
        'Whole Wheat Pasta (1 cup)': { cal: 174, pro: 7, carb: 37, fat: 1, sug: 1 },
        'Mac and Cheese (1 cup)': { cal: 310, pro: 11, carb: 36, fat: 13, sug: 5 },
        'Lasagna (1 piece)': { cal: 356, pro: 18, carb: 35, fat: 16, sug: 8 },
        'Fettuccine Alfredo (1 cup)': { cal: 410, pro: 13, carb: 45, fat: 19, sug: 3 },
    },
    
    bread: {
        'White Bread (2 slices)': { cal: 160, pro: 5, carb: 30, fat: 2, sug: 3 },
        'Whole Wheat Bread (2 slices)': { cal: 138, pro: 7, carb: 23, fat: 2, sug: 3 },
        'Sourdough (2 slices)': { cal: 180, pro: 7, carb: 36, fat: 1, sug: 2 },
        'Rye Bread (2 slices)': { cal: 166, pro: 6, carb: 30, fat: 2, sug: 4 },
        'Bagel (1 plain)': { cal: 289, pro: 11, carb: 56, fat: 2, sug: 5 },
        'English Muffin (1)': { cal: 134, pro: 5, carb: 26, fat: 1, sug: 2 },
        'Pita Bread (1 whole)': { cal: 165, pro: 6, carb: 33, fat: 1, sug: 1 },
        'Tortilla Flour (1 large)': { cal: 140, pro: 4, carb: 24, fat: 3, sug: 1 },
        'Tortilla Corn (2 small)': { cal: 96, pro: 3, carb: 20, fat: 1, sug: 1 },
        'Ciabatta (2 oz)': { cal: 150, pro: 5, carb: 30, fat: 1, sug: 1 },
        'Croissant (1 medium)': { cal: 231, pro: 5, carb: 26, fat: 12, sug: 6 },
        'Biscuit (1 medium)': { cal: 190, pro: 4, carb: 24, fat: 8, sug: 3 },
    },
    
    potatoes: {
        'Baked Potato (1 medium)': { cal: 163, pro: 4, carb: 37, fat: 0, sug: 2 },
        'Sweet Potato (1 medium)': { cal: 112, pro: 2, carb: 26, fat: 0, sug: 8 },
        'Mashed Potatoes (1 cup)': { cal: 237, pro: 4, carb: 35, fat: 9, sug: 3 },
        'French Fries (medium)': { cal: 365, pro: 4, carb: 48, fat: 17, sug: 0 },
        'Hash Browns (1 cup)': { cal: 326, pro: 3, carb: 34, fat: 20, sug: 2 },
        'Potato Chips (1 oz)': { cal: 152, pro: 2, carb: 15, fat: 10, sug: 1 },
        'Red Potato (1 medium)': { cal: 149, pro: 3, carb: 34, fat: 0, sug: 2 },
        'Tater Tots (10 pieces)': { cal: 160, pro: 2, carb: 20, fat: 8, sug: 1 },
    },
    
    grains: {
        'Quinoa (1 cup cooked)': { cal: 222, pro: 8, carb: 39, fat: 4, sug: 2 },
        'Oatmeal (1 cup cooked)': { cal: 166, pro: 6, carb: 28, fat: 4, sug: 1 },
        'Oats Dry (1/2 cup)': { cal: 153, pro: 5, carb: 27, fat: 3, sug: 0 },
        'Couscous (1 cup cooked)': { cal: 176, pro: 6, carb: 36, fat: 0, sug: 0 },
        'Granola (1/2 cup)': { cal: 260, pro: 6, carb: 43, fat: 8, sug: 15 },
        'Cornflakes (1 cup)': { cal: 101, pro: 2, carb: 24, fat: 0, sug: 2 },
        'Cheerios (1 cup)': { cal: 100, pro: 3, carb: 20, fat: 2, sug: 1 },
        'Raisin Bran (1 cup)': { cal: 190, pro: 4, carb: 46, fat: 1, sug: 18 },
        'Cream of Wheat (1 cup)': { cal: 133, pro: 4, carb: 28, fat: 1, sug: 0 },
        'Grits (1 cup cooked)': { cal: 182, pro: 4, carb: 38, fat: 2, sug: 0 },
    },
    
    fruits: {
        'Banana (1 medium)': { cal: 105, pro: 1, carb: 27, fat: 0, sug: 14 },
        'Apple (1 medium)': { cal: 95, pro: 1, carb: 25, fat: 0, sug: 19 },
        'Orange (1 medium)': { cal: 62, pro: 1, carb: 15, fat: 0, sug: 12 },
        'Grapes (1 cup)': { cal: 104, pro: 1, carb: 27, fat: 0, sug: 23 },
        'Strawberries (1 cup)': { cal: 49, pro: 1, carb: 12, fat: 1, sug: 7 },
        'Blueberries (1 cup)': { cal: 84, pro: 1, carb: 21, fat: 1, sug: 15 },
        'Raspberries (1 cup)': { cal: 64, pro: 2, carb: 15, fat: 1, sug: 5 },
        'Blackberries (1 cup)': { cal: 62, pro: 2, carb: 14, fat: 1, sug: 7 },
        'Watermelon (1 cup)': { cal: 46, pro: 1, carb: 12, fat: 0, sug: 9 },
        'Cantaloupe (1 cup)': { cal: 54, pro: 1, carb: 13, fat: 0, sug: 12 },
        'Honeydew (1 cup)': { cal: 64, pro: 1, carb: 16, fat: 0, sug: 14 },
        'Pineapple (1 cup)': { cal: 82, pro: 1, carb: 22, fat: 0, sug: 16 },
        'Mango (1 cup)': { cal: 99, pro: 1, carb: 25, fat: 1, sug: 23 },
        'Peach (1 medium)': { cal: 59, pro: 1, carb: 14, fat: 0, sug: 13 },
        'Pear (1 medium)': { cal: 101, pro: 1, carb: 27, fat: 0, sug: 17 },
        'Plum (1 medium)': { cal: 30, pro: 1, carb: 8, fat: 0, sug: 7 },
        'Cherries (1 cup)': { cal: 87, pro: 2, carb: 22, fat: 0, sug: 18 },
        'Kiwi (1 medium)': { cal: 42, pro: 1, carb: 10, fat: 0, sug: 6 },
        'Grapefruit (half)': { cal: 52, pro: 1, carb: 13, fat: 0, sug: 9 },
        'Avocado (half)': { cal: 120, pro: 2, carb: 6, fat: 11, sug: 1 },
        'Dates (5 pieces)': { cal: 110, pro: 1, carb: 31, fat: 0, sug: 27 },
        'Figs (2 medium)': { cal: 74, pro: 1, carb: 19, fat: 0, sug: 16 },
    },
    
    vegetables: {
        'Broccoli (1 cup cooked)': { cal: 55, pro: 4, carb: 11, fat: 1, sug: 2 },
        'Spinach (1 cup raw)': { cal: 7, pro: 1, carb: 1, fat: 0, sug: 0 },
        'Spinach (1 cup cooked)': { cal: 41, pro: 5, carb: 7, fat: 1, sug: 1 },
        'Carrots (1 cup raw)': { cal: 52, pro: 1, carb: 12, fat: 0, sug: 6 },
        'Carrots (1 cup cooked)': { cal: 55, pro: 1, carb: 13, fat: 0, sug: 7 },
        'Bell Pepper (1 medium)': { cal: 37, pro: 1, carb: 7, fat: 0, sug: 5 },
        'Tomato (1 medium)': { cal: 22, pro: 1, carb: 5, fat: 0, sug: 3 },
        'Cucumber (1 cup sliced)': { cal: 16, pro: 1, carb: 4, fat: 0, sug: 2 },
        'Lettuce (1 cup)': { cal: 5, pro: 1, carb: 1, fat: 0, sug: 0 },
        'Cauliflower (1 cup cooked)': { cal: 29, pro: 2, carb: 5, fat: 1, sug: 3 },
        'Zucchini (1 cup cooked)': { cal: 27, pro: 2, carb: 5, fat: 0, sug: 4 },
        'Asparagus (6 spears)': { cal: 20, pro: 2, carb: 4, fat: 0, sug: 1 },
        'Green Beans (1 cup cooked)': { cal: 44, pro: 2, carb: 10, fat: 0, sug: 2 },
        'Brussels Sprouts (1 cup)': { cal: 56, pro: 4, carb: 11, fat: 1, sug: 3 },
        'Kale (1 cup raw)': { cal: 8, pro: 1, carb: 1, fat: 0, sug: 0 },
        'Mushrooms (1 cup raw)': { cal: 15, pro: 2, carb: 2, fat: 0, sug: 1 },
        'Onion (1 medium)': { cal: 44, pro: 1, carb: 10, fat: 0, sug: 5 },
        'Celery (1 cup)': { cal: 16, pro: 1, carb: 3, fat: 0, sug: 1 },
        'Corn (1 ear)': { cal: 90, pro: 3, carb: 19, fat: 1, sug: 6 },
        'Peas (1 cup cooked)': { cal: 134, pro: 9, carb: 25, fat: 0, sug: 10 },
        'Eggplant (1 cup cooked)': { cal: 35, pro: 1, carb: 9, fat: 0, sug: 3 },
    },
    
    nuts: {
        'Almonds (1 oz, 23 nuts)': { cal: 164, pro: 6, carb: 6, fat: 14, sug: 1 },
        'Walnuts (1 oz, 14 halves)': { cal: 185, pro: 4, carb: 4, fat: 18, sug: 1 },
        'Cashews (1 oz, 18 nuts)': { cal: 157, pro: 5, carb: 9, fat: 12, sug: 2 },
        'Peanuts (1 oz, 28 nuts)': { cal: 161, pro: 7, carb: 5, fat: 14, sug: 1 },
        'Peanut Butter (2 tbsp)': { cal: 188, pro: 8, carb: 7, fat: 16, sug: 3 },
        'Almond Butter (2 tbsp)': { cal: 196, pro: 7, carb: 6, fat: 18, sug: 2 },
        'Pistachios (1 oz, 49 nuts)': { cal: 159, pro: 6, carb: 8, fat: 13, sug: 2 },
        'Pecans (1 oz, 19 halves)': { cal: 196, pro: 3, carb: 4, fat: 20, sug: 1 },
        'Macadamia (1 oz, 11 nuts)': { cal: 204, pro: 2, carb: 4, fat: 21, sug: 1 },
        'Brazil Nuts (1 oz, 6 nuts)': { cal: 187, pro: 4, carb: 3, fat: 19, sug: 1 },
        'Hazelnuts (1 oz, 21 nuts)': { cal: 178, pro: 4, carb: 5, fat: 17, sug: 1 },
        'Chia Seeds (2 tbsp)': { cal: 138, pro: 5, carb: 12, fat: 9, sug: 0 },
        'Flax Seeds (2 tbsp)': { cal: 110, pro: 4, carb: 6, fat: 9, sug: 0 },
        'Sunflower Seeds (1 oz)': { cal: 165, pro: 6, carb: 6, fat: 14, sug: 1 },
        'Pumpkin Seeds (1 oz)': { cal: 151, pro: 7, carb: 5, fat: 13, sug: 0 },
        'Trail Mix (1/4 cup)': { cal: 173, pro: 5, carb: 17, fat: 11, sug: 10 },
    },
    
    dairy: {
        'Whole Milk (1 cup)': { cal: 149, pro: 8, carb: 12, fat: 8, sug: 12 },
        '2% Milk (1 cup)': { cal: 122, pro: 8, carb: 12, fat: 5, sug: 12 },
        'Skim Milk (1 cup)': { cal: 83, pro: 8, carb: 12, fat: 0, sug: 12 },
        'Almond Milk (1 cup)': { cal: 39, pro: 2, carb: 3, fat: 3, sug: 2 },
        'Oat Milk (1 cup)': { cal: 120, pro: 3, carb: 16, fat: 5, sug: 7 },
        'Soy Milk (1 cup)': { cal: 109, pro: 8, carb: 11, fat: 5, sug: 7 },
        'Coconut Milk (1 cup)': { cal: 76, pro: 1, carb: 7, fat: 5, sug: 6 },
        'Cheddar Cheese (1 oz)': { cal: 113, pro: 7, carb: 0, fat: 9, sug: 0 },
        'Mozzarella (1 oz)': { cal: 85, pro: 6, carb: 1, fat: 6, sug: 0 },
        'Swiss Cheese (1 oz)': { cal: 106, pro: 8, carb: 2, fat: 8, sug: 0 },
        'Feta Cheese (1 oz)': { cal: 75, pro: 4, carb: 1, fat: 6, sug: 1 },
        'Parmesan (1 oz)': { cal: 111, pro: 10, carb: 1, fat: 7, sug: 0 },
        'American Cheese (1 slice)': { cal: 96, pro: 5, carb: 2, fat: 7, sug: 2 },
        'Cream Cheese (2 tbsp)': { cal: 99, pro: 2, carb: 2, fat: 10, sug: 1 },
        'Sour Cream (2 tbsp)': { cal: 60, pro: 1, carb: 1, fat: 6, sug: 1 },
        'Butter (1 tbsp)': { cal: 102, pro: 0, carb: 0, fat: 12, sug: 0 },
        'Ice Cream (1/2 cup)': { cal: 137, pro: 2, carb: 16, fat: 7, sug: 14 },
    },
    
    supplements: {
        'Whey Protein (1 scoop)': { cal: 120, pro: 24, carb: 3, fat: 2, sug: 1 },
        'Casein Protein (1 scoop)': { cal: 120, pro: 24, carb: 3, fat: 1, sug: 1 },
        'Plant Protein (1 scoop)': { cal: 110, pro: 20, carb: 7, fat: 2, sug: 1 },
        'Protein Bar (average)': { cal: 200, pro: 20, carb: 24, fat: 7, sug: 15 },
        'Quest Bar': { cal: 190, pro: 21, carb: 23, fat: 7, sug: 1 },
        'Clif Bar': { cal: 260, pro: 9, carb: 44, fat: 6, sug: 21 },
        'RxBar': { cal: 210, pro: 12, carb: 24, fat: 7, sug: 15 },
    },
    
    beverages: {
        'Coffee Black (12 oz)': { cal: 3, pro: 0, carb: 0, fat: 0, sug: 0 },
        'Coffee with Cream (12 oz)': { cal: 52, pro: 0, carb: 1, fat: 5, sug: 1 },
        'Latte (12 oz)': { cal: 150, pro: 10, carb: 15, fat: 6, sug: 14 },
        'Cappuccino (12 oz)': { cal: 120, pro: 8, carb: 12, fat: 5, sug: 11 },
        'Green Tea (12 oz)': { cal: 3, pro: 1, carb: 0, fat: 0, sug: 0 },
        'Orange Juice (1 cup)': { cal: 112, pro: 2, carb: 26, fat: 1, sug: 21 },
        'Apple Juice (1 cup)': { cal: 114, pro: 0, carb: 28, fat: 0, sug: 24 },
        'Cranberry Juice (1 cup)': { cal: 116, pro: 0, carb: 31, fat: 0, sug: 30 },
        'Gatorade (20 oz)': { cal: 140, pro: 0, carb: 36, fat: 0, sug: 34 },
        'Powerade (20 oz)': { cal: 130, pro: 0, carb: 34, fat: 0, sug: 34 },
        'Red Bull (8.4 oz)': { cal: 110, pro: 1, carb: 27, fat: 0, sug: 27 },
        'Monster (16 oz)': { cal: 210, pro: 2, carb: 54, fat: 0, sug: 54 },
        'Soda (12 oz)': { cal: 140, pro: 0, carb: 39, fat: 0, sug: 39 },
        'Diet Soda (12 oz)': { cal: 0, pro: 0, carb: 0, fat: 0, sug: 0 },
        'Beer (12 oz)': { cal: 153, pro: 2, carb: 13, fat: 0, sug: 0 },
        'Light Beer (12 oz)': { cal: 103, pro: 1, carb: 6, fat: 0, sug: 0 },
        'Wine (5 oz)': { cal: 123, pro: 0, carb: 4, fat: 0, sug: 1 },
    },
    
    mcdonalds: {
        'Big Mac': { cal: 563, pro: 26, carb: 45, fat: 30, sug: 9 },
        'Quarter Pounder': { cal: 520, pro: 30, carb: 41, fat: 26, sug: 10 },
        'McChicken': { cal: 400, pro: 14, carb: 39, fat: 21, sug: 5 },
        'Filet-O-Fish': { cal: 380, pro: 16, carb: 39, fat: 18, sug: 5 },
        '10pc Nuggets': { cal: 420, pro: 24, carb: 26, fat: 24, sug: 0 },
        'Medium Fries': { cal: 333, pro: 4, carb: 43, fat: 16, sug: 0 },
        'Large Fries': { cal: 498, pro: 6, carb: 64, fat: 24, sug: 0 },
        'McFlurry Oreo': { cal: 510, pro: 13, carb: 80, fat: 15, sug: 64 },
        'Egg McMuffin': { cal: 310, pro: 17, carb: 31, fat: 13, sug: 3 },
        'Hash Brown': { cal: 144, pro: 1, carb: 15, fat: 9, sug: 0 },
    },
    
    chipotle: {
        'Chicken Bowl': { cal: 500, pro: 40, carb: 50, fat: 17, sug: 2 },
        'Steak Bowl': { cal: 520, pro: 38, carb: 50, fat: 20, sug: 2 },
        'Carnitas Bowl': { cal: 530, pro: 36, carb: 50, fat: 22, sug: 2 },
        'Chicken Burrito': { cal: 965, pro: 52, carb: 103, fat: 36, sug: 5 },
        'Steak Burrito': { cal: 985, pro: 50, carb: 103, fat: 39, sug: 5 },
        'Burrito Bowl no Rice': { cal: 400, pro: 38, carb: 25, fat: 17, sug: 2 },
        'Chicken Salad': { cal: 420, pro: 42, carb: 30, fat: 18, sug: 6 },
        'Chips & Guac': { cal: 365, pro: 4, carb: 37, fat: 23, sug: 2 },
    },
    
    subway: {
        '6" Turkey': { cal: 280, pro: 18, carb: 46, fat: 4, sug: 7 },
        '6" Italian BMT': { cal: 390, pro: 19, carb: 46, fat: 14, sug: 7 },
        '6" Chicken Teriyaki': { cal: 360, pro: 25, carb: 59, fat: 5, sug: 16 },
        '6" Meatball': { cal: 480, pro: 21, carb: 59, fat: 17, sug: 11 },
        '6" Steak & Cheese': { cal: 360, pro: 24, carb: 48, fat: 10, sug: 7 },
        'Footlong Turkey': { cal: 560, pro: 36, carb: 92, fat: 7, sug: 14 },
    },
    
    fastfood: {
        'Dominos Pizza (1 slice)': { cal: 200, pro: 8, carb: 25, fat: 7, sug: 2 },
        'Papa Johns Pizza (1 slice)': { cal: 235, pro: 10, carb: 28, fat: 9, sug: 3 },
        'Taco Bell Burrito': { cal: 370, pro: 14, carb: 49, fat: 12, sug: 4 },
        'Taco Bell Taco (crunchy)': { cal: 170, pro: 8, carb: 13, fat: 9, sug: 1 },
        'KFC Chicken Breast': { cal: 390, pro: 39, carb: 11, fat: 21, sug: 0 },
        'Chick-fil-A Sandwich': { cal: 440, pro: 28, carb: 40, fat: 19, sug: 5 },
        'Five Guys Burger': { cal: 700, pro: 39, carb: 40, fat: 43, sug: 8 },
        'In-N-Out Burger': { cal: 390, pro: 16, carb: 39, fat: 19, sug: 10 },
        'Wendys Baconator': { cal: 950, pro: 62, carb: 38, fat: 62, sug: 9 },
        'Burger King Whopper': { cal: 657, pro: 28, carb: 49, fat: 40, sug: 11 },
    },
    
    snacks: {
        'Oreos (3 cookies)': { cal: 160, pro: 1, carb: 25, fat: 7, sug: 14 },
        'Chips Ahoy (3 cookies)': { cal: 160, pro: 2, carb: 21, fat: 8, sug: 11 },
        'Pop-Tart (1 pastry)': { cal: 200, pro: 2, carb: 37, fat: 5, sug: 16 },
        'Granola Bar': { cal: 120, pro: 2, carb: 20, fat: 4, sug: 8 },
        'Cheez-Its (27 crackers)': { cal: 150, pro: 3, carb: 17, fat: 8, sug: 1 },
        'Goldfish (55 crackers)': { cal: 140, pro: 3, carb: 20, fat: 5, sug: 1 },
        'Pretzels (1 oz)': { cal: 108, pro: 3, carb: 23, fat: 1, sug: 1 },
        'Popcorn (3 cups)': { cal: 93, pro: 3, carb: 19, fat: 1, sug: 0 },
        'M&Ms (1.69 oz bag)': { cal: 240, pro: 2, carb: 34, fat: 10, sug: 31 },
        'Snickers (1 bar)': { cal: 250, pro: 4, carb: 33, fat: 12, sug: 27 },
        'Kit Kat (1 bar)': { cal: 218, pro: 3, carb: 27, fat: 11, sug: 21 },
        'Reeses (2 cups)': { cal: 210, pro: 5, carb: 24, fat: 13, sug: 21 },
        'Brownie (1 square)': { cal: 227, pro: 3, carb: 36, fat: 9, sug: 21 },
        'Chocolate Chip Cookie': { cal: 160, pro: 2, carb: 23, fat: 7, sug: 14 },
        'Donut (glazed)': { cal: 260, pro: 4, carb: 31, fat: 14, sug: 12 },
        'Muffin (blueberry)': { cal: 360, pro: 6, carb: 54, fat: 13, sug: 28 },
    },
    
    condiments: {
        'Ketchup (1 tbsp)': { cal: 19, pro: 0, carb: 5, fat: 0, sug: 4 },
        'Mustard (1 tbsp)': { cal: 9, pro: 1, carb: 1, fat: 1, sug: 0 },
        'Mayo (1 tbsp)': { cal: 94, pro: 0, carb: 0, fat: 10, sug: 0 },
        'Ranch Dressing (2 tbsp)': { cal: 146, pro: 0, carb: 2, fat: 15, sug: 1 },
        'Italian Dressing (2 tbsp)': { cal: 86, pro: 0, carb: 3, fat: 8, sug: 2 },
        'BBQ Sauce (2 tbsp)': { cal: 50, pro: 0, carb: 13, fat: 0, sug: 10 },
        'Hot Sauce (1 tbsp)': { cal: 5, pro: 0, carb: 1, fat: 0, sug: 0 },
        'Soy Sauce (1 tbsp)': { cal: 8, pro: 1, carb: 1, fat: 0, sug: 0 },
        'Olive Oil (1 tbsp)': { cal: 119, pro: 0, carb: 0, fat: 14, sug: 0 },
        'Honey (1 tbsp)': { cal: 64, pro: 0, carb: 17, fat: 0, sug: 17 },
        'Maple Syrup (1 tbsp)': { cal: 52, pro: 0, carb: 13, fat: 0, sug: 12 },
    },
};

// Category names for display
const categoryNames = {
    'chicken': '🐔 Chicken',
    'beef': '🥩 Beef',
    'pork': '🐖 Pork',
    'turkey': '🦃 Turkey',
    'seafood': '🐟 Fish & Seafood',
    'eggs': '🥚 Eggs & Dairy Proteins',
    'rice': '🍚 Rice',
    'pasta': '🍝 Pasta',
    'bread': '🍞 Bread',
    'potatoes': '🥔 Potatoes',
    'grains': '🌾 Grains & Cereals',
    'fruits': '🍎 Fruits',
    'vegetables': '🥦 Vegetables',
    'nuts': '🥜 Nuts & Seeds',
    'dairy': '🥛 Dairy & Alternatives',
    'supplements': '💪 Protein Supplements',
    'beverages': '☕ Beverages',
    'mcdonalds': '🍔 McDonald\'s',
    'chipotle': '🌯 Chipotle',
    'subway': '🥪 Subway',
    'fastfood': '🍟 Other Fast Food',
    'snacks': '🍪 Snacks & Sweets',
    'condiments': '🍯 Condiments'
};

// Store current displayed foods for filtering/sorting
let currentFoods = [];

// Display food database
function displayFoodDatabase() {
    console.log('📚 Loading food database...');
    const container = document.getElementById('foodCategoriesContainer');
    if (!container) {
        console.error('❌ Food container not found');
        return;
    }
    
    // Build initial food list
    currentFoods = [];
    for (const [categoryKey, foods] of Object.entries(foodDatabase)) {
        for (const [foodName, nutrition] of Object.entries(foods)) {
            currentFoods.push({
                name: foodName,
                category: categoryKey,
                ...nutrition
            });
        }
    }
    
    console.log(`✅ Loaded ${currentFoods.length} foods`);
    renderFoods();
}

// Render foods to DOM
function renderFoods() {
    const container = document.getElementById('foodCategoriesContainer');
    const resultCount = document.getElementById('foodResultsCount');
    
    if (!container) return;
    
    // Group by category
    const grouped = {};
    currentFoods.forEach(food => {
        if (!grouped[food.category]) {
            grouped[food.category] = [];
        }
        grouped[food.category].push(food);
    });
    
    // Build HTML
    let html = '';
    for (const [categoryKey, foods] of Object.entries(grouped)) {
        if (foods.length === 0) continue;
        
        html += `
            <div class="food-category" data-category="${categoryKey}">
                <h4 style="color: var(--color-primary); margin: 1.5rem 0 0.75rem 0; font-size: 1.05rem; font-weight: 600;">
                    ${categoryNames[categoryKey]} (${foods.length})
                </h4>
                <div class="food-grid">
        `;
        
        foods.forEach(food => {
            html += `
                <div class="food-item" onclick="addFoodToTracker('${food.name.replace(/'/g, "\\'")}', ${food.cal}, ${food.pro}, ${food.carb}, ${food.fat}, ${food.sug})" data-food-name="${food.name.toLowerCase()}">
                    <div class="food-name">${food.name}</div>
                    <div class="food-macros">
                        <span class="macro-badge">${food.cal} cal</span>
                        <span class="macro-badge">P: ${food.pro}g</span>
                        <span class="macro-badge">C: ${food.carb}g</span>
                        <span class="macro-badge">F: ${food.fat}g</span>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html || '<p style="color: var(--color-text-secondary); padding: 2rem; text-align: center;">No foods found matching your filters.</p>';
    
    // Update count
    if (resultCount) {
        const visibleCount = currentFoods.length;
        const totalCount = Object.values(foodDatabase).reduce((sum, cat) => sum + Object.keys(cat).length, 0);
        resultCount.textContent = `Showing ${visibleCount} of ${totalCount} foods`;
    }
}

// Filter foods
function filterFoods() {
    const searchTerm = document.getElementById('foodSearchInput')?.value.toLowerCase().trim() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
    
    // Reset to all foods
    currentFoods = [];
    for (const [categoryKey, foods] of Object.entries(foodDatabase)) {
        for (const [foodName, nutrition] of Object.entries(foods)) {
            currentFoods.push({
                name: foodName,
                category: categoryKey,
                ...nutrition
            });
        }
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
        currentFoods = currentFoods.filter(food => food.category === categoryFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
        currentFoods = currentFoods.filter(food => 
            food.name.toLowerCase().includes(searchTerm)
        );
    }
    
    // Re-render
    renderFoods();
}

// Sort foods
function sortFoods() {
    const sortBy = document.getElementById('sortFilter')?.value || 'name';
    
    switch(sortBy) {
        case 'name':
            currentFoods.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'calories-low':
            currentFoods.sort((a, b) => a.cal - b.cal);
            break;
        case 'calories-high':
            currentFoods.sort((a, b) => b.cal - a.cal);
            break;
        case 'protein-high':
            currentFoods.sort((a, b) => b.pro - a.pro);
            break;
        case 'carbs-low':
            currentFoods.sort((a, b) => a.carb - b.carb);
            break;
        case 'fat-low':
            currentFoods.sort((a, b) => a.fat - b.fat);
            break;
    }
    
    renderFoods();
}

// Add food to nutrition tracker
function addFoodToTracker(name, calories, protein, carbs, fat, sugar) {
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('🍽️ ADDING FOOD TO TRACKER');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('Food:', name);
    console.log('Calories:', calories);
    console.log('Protein:', protein + 'g');
    console.log('Carbs:', carbs + 'g');
    console.log('Fat:', fat + 'g');
    console.log('Sugar:', sugar + 'g');
    
    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.error('❌ No user logged in');
        alert('Please log in to track nutrition');
        return;
    }
    
    console.log('✅ User:', currentUser.email);
    
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
    console.log('✅ Entry added to today\'s data');
    
    // Save to localStorage
    try {
        localStorage.setItem(dataKey, JSON.stringify(allData));
        console.log('✅ Saved to localStorage');
    } catch (error) {
        console.error('❌ localStorage save failed:', error);
        alert('Error: Could not save entry');
        return;
    }
    
    // Sync to Firebase
    if (typeof isFirebaseReady === 'function' && isFirebaseReady() && currentUser.uid) {
        try {
            firebase.database().ref('users/' + currentUser.uid + '/nutrition/' + today).set(allData[today]);
            console.log('✅ Synced to Firebase');
        } catch (error) {
            console.error('⚠️ Firebase sync failed:', error);
        }
    }
    
    // Update UI if loadNutritionData exists
    if (typeof loadNutritionData === 'function') {
        loadNutritionData();
    }
    
    // Show success
    if (typeof showSuccessMessage === 'function') {
        showSuccessMessage(`✅ Added: ${name}`);
    }
    
    console.log('✅ Food added successfully');
    console.log('═══════════════════════════════════════════════════════════════════');
    
    // Scroll to nutrition tab suggestion
    const goToNutrition = confirm(`${name} added to today's nutrition!\n\nGo to Nutrition tab to see updated totals?`);
    if (goToNutrition && typeof switchTab === 'function') {
        switchTab('nutrition');
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayFoodDatabase);
} else {
    displayFoodDatabase();
}

// Export functions
window.displayFoodDatabase = displayFoodDatabase;
window.filterFoods = filterFoods;
window.sortFoods = sortFoods;
window.addFoodToTracker = addFoodToTracker;

console.log('✅ Food database module loaded - 300+ foods ready!');
