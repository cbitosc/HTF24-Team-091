import React from 'react';

export default function PreviousSearches({ searches, onSearchClick }) {
    return (
        <div className="previous-searches">
            <h2>Previous Searches</h2>
            <ul>
                {searches.map((search, index) => (
                    <li key={index} onClick={() => onSearchClick(search)}>
                        {search}
                    </li>
                ))}
            </ul>
        </div>
    );
}
