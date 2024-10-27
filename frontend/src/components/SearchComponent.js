import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchComponent = ({ onResults, onNewSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('name');
    const [mealType, setMealType] = useState(''); 

    const handleInputChange = (e) => setSearchTerm(e.target.value);
    const handleMealTypeChange = (e) => setMealType(e.target.value); 
    const handleTabChange = (tab) => setActiveTab(tab);

    const handleSearchSubmit = async () => {
        const queryType = activeTab === 'name' ? 'search' : 'ingredient';
        await searchRecipes(queryType, searchTerm, mealType);

        if (searchTerm || mealType) {
            const formattedSearch = `${activeTab}: ${searchTerm}`; 
            onNewSearch(formattedSearch);
        }
    };

    const searchRecipes = async (queryType, queryValue, mealType) => {
        const query = new URLSearchParams();
        query.append(queryType, queryValue);
        if (mealType) query.append('mealType', mealType);

        try {
            const response = await fetch(`http://localhost:3000/recipes?${query.toString()}`); 
            if (response.ok) {
                const data = await response.json();
                onResults(data);
            } else {
                console.error('Failed to fetch recipes:', response.statusText);
                onResults([]);
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
            onResults([]);
        }
    };

    return (
        <div className="search-box">
            <div className="search-input">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder={`Search by ${activeTab}`} 
                />
                <button className="btn" onClick={handleSearchSubmit}>
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </div>

            <div className="tab-options">
                <button
                    className={`tab ${activeTab === 'name' ? 'active' : ''}`} 
                    onClick={() => handleTabChange('name')}
                >
                    Search by Name
                </button>
                <button
                    className={`tab ${activeTab === 'ingredient' ? 'active' : ''}`} 
                    onClick={() => handleTabChange('ingredient')}
                >
                    Search by Ingredient
                </button>
            </div>

            <div className="options">
                <select value={mealType} onChange={handleMealTypeChange}>
                    <option value="">Sort by Type of Meal</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                </select>
            </div>
        </div>
    );
};

export default SearchComponent;
