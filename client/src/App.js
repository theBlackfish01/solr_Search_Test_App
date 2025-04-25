import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';
import { searchSolr } from './services/solrService';
import './App.css';

function App() {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [lastQuery, setLastQuery] = useState('');

    const handleSearch = async (query) => {
        setLoading(true);
        setError(null);
        setHasSearched(true);
        setLastQuery(query);

        try {
            const response = await searchSolr(query);
            setSearchResults(response.response.docs);
        } catch (err) {
            setError(err);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <header>
                <div className="container">
                    <h1>📚 Solr Book Search</h1>
                </div>
            </header>

            <main className="container">
                <SearchBar onSearch={handleSearch} />

                {hasSearched && (
                    <ResultsList
                        results={searchResults}
                        loading={loading}
                        error={error}
                        query={lastQuery}
                    />
                )}
            </main>

            <footer>
                <div className="container">
                    <p className="footer-text">© {new Date().getFullYear()} Solr Search Integration Demo | Powered by Apache Solr</p>
                </div>
            </footer>
        </div>
    );
}

export default App;