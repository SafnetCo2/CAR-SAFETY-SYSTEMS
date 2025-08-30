// src/components/Navbar.js
import React from "react";


function Navbar({ sidebarOpen, setSidebarOpen, onSearch, suggestionsData = [] }) {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [suggestions, setSuggestions] = React.useState([]);

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSuggestions(
            value.length > 0
                ? suggestionsData.filter((item) =>
                    item.toLowerCase().includes(value.toLowerCase())
                )
                : []
        );
    };

    const handleSuggestionClick = (item) => {
        setSearchQuery(item);
        setSuggestions([]);
        if (onSearch) onSearch(item);
    };

    return (
        <header className="dashboard-navbar">
            <div className="navbar-left">
                <h1>🚗 Car Safety</h1>
                {/* Single hamburger toggle */}
                <button
                    className="hamburger"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    ☰
                </button>
                
            </div>

            <div className="navbar-right">
                <form
                    className="navbar-search"
                    onSubmit={(e) => {
                        e.preventDefault();
                        setSuggestions([]);
                        if (onSearch) onSearch(searchQuery);
                    }}
                >
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleChange}
                        placeholder="Search..."
                    />
                    <button type="submit">🔍</button>
                </form>

                {suggestions.length > 0 && (
                    <ul className="autocomplete-list">
                        {suggestions.map((item, idx) => (
                            <li key={idx} onClick={() => handleSuggestionClick(item)}>
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </header>
    );
}

export default Navbar;
