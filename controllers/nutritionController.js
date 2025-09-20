// controllers/nutritionController.js

const axios = require('axios');

exports.analyzeRecipe = async (req, res) => {
    try {
        const { ingredients } = req.body;

        if (!ingredients || ingredients.length === 0) {
            return res.status(400).json({ success: false, error: 'Please provide a list of ingredients' });
        }

        const NUTRITIONIX_APP_ID = "ff2ce41d";
        const NUTRITIONIX_APP_KEY = "1747cb57c5db0b1693ac87860ef8cb3a";

        const apiUrl = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
        const ingredientsString = ingredients.join('\n');

        const payload = {
            query: ingredientsString,
        };
        
        const headers = {
            'x-app-id': NUTRITIONIX_APP_ID,
            'x-app-key': NUTRITIONIX_APP_KEY,
            'Content-Type': 'application/json'
        };

        const response = await axios.post(apiUrl, payload, { headers: headers });
        const nutritionData = response.data;

        if (!nutritionData.foods || nutritionData.foods.length === 0) {
            return res.status(400).json({ success: false, error: 'Could not calculate nutrition. Check ingredient spelling and format.' });
        }
        
        // Use a helper function to sum up all nutrients
        const totals = sumNutrients(nutritionData.foods);

        const detailedResult = {
            // Macronutrients
            calories: totals.calories.toFixed(0),
            protein_g: totals.protein.toFixed(1),
            carbs_g: totals.carbs.toFixed(1),
            fat_g: totals.fat.toFixed(1),
            fiber_g: totals.fiber.toFixed(1),
            sugar_g: totals.sugar.toFixed(1),
            
            // Key Minerals (in mg)
            sodium_mg: totals.sodium.toFixed(0),
            potassium_mg: totals.potassium.toFixed(0),
            calcium_mg: totals.calcium.toFixed(0),
            iron_mg: totals.iron.toFixed(1),
            magnesium_mg: totals.magnesium.toFixed(0),

            // Key Vitamins
            vitamin_c_mg: totals.vitC.toFixed(1),
            vitamin_d_mcg: totals.vitD.toFixed(1), // mcg (micrograms)
            cholesterol_mg: totals.cholesterol.toFixed(0)
        };

        res.status(200).json({ success: true, data: detailedResult });

    } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        res.status(500).json({ success: false, error: 'Server Error or Invalid API Key' });
    }
};

// Helper function to aggregate nutrients from all food items
function sumNutrients(foods) {
    const nutrientTotals = {
        calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0,
        sodium: 0, potassium: 0, calcium: 0, iron: 0, magnesium: 0,
        vitC: 0, vitD: 0, cholesterol: 0
    };

    foods.forEach(food => {
        nutrientTotals.calories += food.nf_calories || 0;
        nutrientTotals.protein += food.nf_protein || 0;
        nutrientTotals.carbs += food.nf_total_carbohydrate || 0;
        nutrientTotals.fat += food.nf_total_fat || 0;
        nutrientTotals.fiber += food.nf_dietary_fiber || 0;
        nutrientTotals.sugar += food.nf_sugars || 0;
        nutrientTotals.sodium += food.nf_sodium || 0;
        nutrientTotals.potassium += food.nf_potassium || 0;
        nutrientTotals.cholesterol += food.nf_cholesterol || 0;

        // Vitamins and minerals are in the 'full_nutrients' array
        food.full_nutrients.forEach(nutrient => {
            switch (nutrient.attr_id) {
                case 301: nutrientTotals.calcium += nutrient.value; break;
                case 303: nutrientTotals.iron += nutrient.value; break;
                case 304: nutrientTotals.magnesium += nutrient.value; break;
                case 401: nutrientTotals.vitC += nutrient.value; break;
                case 324: nutrientTotals.vitD += nutrient.value; break;
            }
        });
    });

    return nutrientTotals;
}