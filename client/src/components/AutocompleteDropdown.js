import React from 'react';

const AutocompleteDropdown = ({ suggestions, onSelect, visible }) => {
    if (!visible || suggestions.length === 0) {
        return null;
    }

    return (
        <div className="autocomplete-dropdown">
            <ul>
                {suggestions.map((suggestion, index) => (
                    <li
                        key={index}
                        onClick={() => onSelect(suggestion)}
                    >
                        {suggestion.title || suggestion.author}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AutocompleteDropdown;
