import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RecipeGenerator = () => {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); 

    const handleInputChange = (e) => setIngredients(e.target.value);

    const handleSearch = async () => {
        setLoading(true);
        const ingredientArray = ingredients
            .toLowerCase()
            .split(',')
            .map((ingredient) => ingredient.trim());

        try {
            const response = await fetch('http://localhost:3000/recipes');
            if (response.ok) {
                const data = await response.json();
                const matchedRecipes = findBestRecipes(data, ingredientArray);

                if (matchedRecipes.length > 0) {
                    setRecipes(matchedRecipes);
                    setError(null);
                } else {
                    setError('No recipes found with the provided ingredients');
                    setRecipes([]);
                }
            } else {
                setError('Failed to fetch recipes');
            }
        } catch (error) {
            setError('An error occurred while fetching recipes');
        } finally {
            setLoading(false); 
        }
    };

    const findBestRecipes = (recipes, ingredientArray) => {
        const matchedRecipes = recipes.map((recipe) => {
            const recipeIngredients = recipe.ingredients
                .toLowerCase()
                .split(',')
                .map((ingredient) => ingredient.trim());

            const matchCount = recipeIngredients.filter((ingredient) =>
                ingredientArray.includes(ingredient)
            ).length;

            return { ...recipe, matchCount };
        });


        return matchedRecipes
            .filter((recipe) => recipe.matchCount > 0) 
            .sort((a, b) => b.matchCount - a.matchCount);
    };

    const highlightIngredients = (recipeIngredients, inputIngredients) => {
        return recipeIngredients
            .split(',')
            .map((ing) => {
                const trimmedIng = ing.trim();
                const isHighlighted = inputIngredients.includes(trimmedIng.toLowerCase());
                return isHighlighted ? <mark key={trimmedIng}>{trimmedIng}</mark> : trimmedIng;
            })
            .reduce((prev, curr) => [prev, ', ', curr]);
    };

    return (
        <div className="recipe-generator">
            <h1>Recipe Generator</h1>
            <p>Tell us your ingredients, and we’ll give you the best possible recipes!</p>

            <input
                type="text"
                value={ingredients}
                onChange={handleInputChange}
                placeholder="Enter ingredients, separated by commas"
            />

            <button className="btn" onClick={handleSearch} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Recipes'}
            </button>

            {error && <p className="error-message">{error}</p>}

            {recipes.length > 0 && (
                <div className="recipe-list">
                    {recipes.map((recipe) => (
                        <Link key={recipe._id} to={`/recipes/${recipe._id}`} className="recipe-card">
                            <img
                                src={`http://localhost:3000/${recipe.mainImage}`}
                                alt={recipe.name}
                            />
                            <h2>{recipe.name}</h2>
                            <p>{recipe.description}</p>

                            <h3>Ingredients:</h3>
                            <ul>
                                <li>
                                    {highlightIngredients(
                                        recipe.ingredients,
                                        ingredients.split(',').map((ing) => ing.trim().toLowerCase())
                                    )}
                                </li>
                            </ul>

                            <h3>Steps:</h3>
                            <ol>
                                {recipe.steps.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ol>

                            <p className="match-count">
                                <strong>Match Count:</strong> {recipe.matchCount} ingredients
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecipeGenerator;
