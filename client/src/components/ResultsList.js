import React from 'react';

const ResultsList = ({ results, loading, error }) => {
    if (loading) {
        return <div className="message-container loading-message">Loading results...</div>;
    }

    if (error) {
        return <div className="message-container error-message">Error: {error.message}</div>;
    }

    if (!results || results.length === 0) {
        return <div className="message-container no-results-message">No results found. Try a different search.</div>;
    }

    return (
        <div className="results-container">
            <h2 className="results-heading">Search Results ({results.length})</h2>
            <div className="results-grid">
                {results.map((item, index) => (
                    <div key={index} className="result-card">
                        <h3 className="result-title">{item.title}</h3>
                        <p className="result-author">By {item.author}</p>
                        {item.year && <p className="result-year">Published: {item.year}</p>}
                        {item.genres && (
                            <div className="genre-tags">
                                {item.genres.map((genre, idx) => (
                                    <span key={idx} className="genre-tag">{genre}</span>
                                ))}
                            </div>
                        )}
                        {item.description && (
                            <p className="result-description">{item.description}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResultsList;
