import React, { useEffect, useState } from 'react';
import PreviousSearches from "../components/PreviousSearches";
import RecipeCard from "../components/RecipeCard";
import CreateRecipe from '../components/CreateRecipe'; 
import SearchComponent from '../components/SearchComponent'; 

export default function Recipes() {
    const [recipes, setRecipes] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [searchLoading, setSearchLoading] = useState(false); 
    const [error, setError] = useState(null); 
    const [searchResults, setSearchResults] = useState([]); 
    const [previousSearches, setPreviousSearches] = useState([]); 

    const fetchRecipes = async (query = '') => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/recipes${query}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setRecipes(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setError('Failed to load recipes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const handleSearchResults = async (results) => {
        setSearchLoading(true);
        setSearchResults(results);
        setSearchLoading(false);
    };

    const handlePreviousSearchClick = async (searchTerm) => {
        const [type, value] = searchTerm.split(': ');
        const query = new URLSearchParams({ [type]: value }).toString();
        await fetchRecipes(`?${query}`);
    };

    return (
        <div>
            <div className="recipes-tab">
                <h2>Create Your Own Recipe</h2>
                <CreateRecipe />
                <hr />
            </div>

            <div className="search-section">
                <PreviousSearches 
                    searches={previousSearches} 
                    onSearchClick={handlePreviousSearchClick} 
                />
                <SearchComponent 
                    onResults={handleSearchResults} 
                    onNewSearch={(search) => setPreviousSearches((prev) => [search, ...prev])} 
                    isLoading={searchLoading} 
                />
                <hr />
            </div>

            <div className="recipes-container">
                {loading ? (
                    <p>Loading recipes...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : searchResults.length > 0 ? (
                    searchResults.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)
                ) : (
                    recipes.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)
                )}
            </div>
        </div>
    );
}
