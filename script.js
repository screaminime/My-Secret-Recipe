// Replace with your own API keys from Edamam
const APP_ID = 'YOUR_APP_ID';
const APP_KEY = 'YOUR_APP_KEY';

async function searchRecipes() {
    const searchInput = document.getElementById('searchInput').value;
    const recipeResults = document.getElementById('recipeResults');
    
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`);
        const data = await response.json();
        
        if (data.meals) {
            displayRecipes(data.meals);
        } else {
            recipeResults.innerHTML = '<p>No recipes found. Try another search term.</p>';
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        recipeResults.innerHTML = '<p>Error fetching recipes. Please try again.</p>';
    }
}

function displayRecipes(recipes) {
    const recipeResults = document.getElementById('recipeResults');
    recipeResults.innerHTML = '';
    
    recipes.forEach(recipe => {
        const recipeCard = `
            <div class="recipe-card">
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <h3>${recipe.strMeal}</h3>
                <p>Category: ${recipe.strCategory}</p>
                <p>Cuisine: ${recipe.strArea}</p>
                <button onclick="showRecipeDetails('${recipe.idMeal}')">View Recipe</button>
            </div>
        `;
        recipeResults.innerHTML += recipeCard;
    });
}

async function showRecipeDetails(mealId) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        const recipe = data.meals[0];
        
        // Create ingredients list
        let ingredients = [];
        for (let i = 1; i <= 20; i++) {
            if (recipe[`strIngredient${i}`]) {
                ingredients.push(`${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}`);
            }
        }

        const recipeDetails = `
            <div class="recipe-details">
                <h2>${recipe.strMeal}</h2>
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <h3>Ingredients:</h3>
                <ul>
                    ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
                <h3>Instructions:</h3>
                <p>${recipe.strInstructions}</p>
                <button onclick="searchRecipes()">Back to Results</button>
            </div>
        `;
        
        document.getElementById('recipeResults').innerHTML = recipeDetails;
    } catch (error) {
        console.error('Error fetching recipe details:', error);
    }
} 