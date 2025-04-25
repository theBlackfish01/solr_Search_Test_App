const API_BASE_URL = 'http://localhost:3001';

const formatQuery = (query) => {
    if (!query) return '*:*';
    
    const queryString = String(query).trim();
    
    if (queryString === '') return '*:*';
    if (queryString.includes(':')) return queryString;
    
    return queryString;
};

export const searchSolr = async (query, filters = {}) => {
    try {
        const formattedQuery = formatQuery(query);
        
        const params = new URLSearchParams({
            q: formattedQuery,
            ...filters
        });
        
        const url = `${API_BASE_URL}/api/search?${params}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Search failed: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error searching:', error);
        throw error;
    }
};

export const getSuggestions = async (query, limit = 5) => {
    try {
        const queryString = query !== null && query !== undefined ? String(query) : '';
        
        if (!queryString || queryString.trim() === '') {
            return [];
        }

        const params = new URLSearchParams({
            q: queryString,
            limit
        });
        
        const url = `${API_BASE_URL}/api/suggestions?${params}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to get suggestions: ${response.status}`);
        }
        
        const data = await response.json();
        return data.response.docs;
    } catch (error) {
        console.error('Error getting suggestions:', error);
        throw error;
    }
};

export const searchByField = async (field, value, limit = 20) => {
    if (!field || !value) {
        throw new Error('Field and value are required');
    }
    
    const query = `${field}:"${value}"`;
    return searchSolr(query, { rows: limit });
};