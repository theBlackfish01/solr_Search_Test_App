const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// Enable CORS
app.use(cors());

// API endpoint for search
app.get('/api/search', async (req, res) => {
    try {
        let query = req.query.q ? String(req.query.q) : '*:*';
        const rows = req.query.rows ? parseInt(req.query.rows, 10) : 20;
        
        const isFieldSpecificQuery = query.includes(':');
        
        if (!isFieldSpecificQuery && query !== '*:*') {
            query = `(title:"${query}" OR author:"${query}" OR description:"${query}" OR genres:"${query}")`;
        }
        
        const params = new URLSearchParams({
            q: query,
            wt: 'json',
            rows: rows,
            sort: 'score desc'
        });
        
        const url = `http://localhost:8983/solr/tempC/select?${params}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Solr error: ${response.status}`, errorText);
            return res.status(response.status).json({ 
                error: `Solr error: ${response.status}`,
                message: errorText
            });
        }
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            error: 'Server error', 
            message: error.message 
        });
    }
});

// API endpoint for suggestions
app.get('/api/suggestions', async (req, res) => {
    try {
        const query = req.query.q ? String(req.query.q) : '';
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
        
        if (!query || query.trim() === '') {
            return res.json({ response: { docs: [] } });
        }
        
        const formattedQuery = `title:"${query}"* OR author:"${query}"*`;
        
        const params = new URLSearchParams({
            q: formattedQuery,
            wt: 'json',
            fl: 'title,author',
            rows: limit
        });
        
        const url = `http://localhost:8983/solr/tempC/select?${params}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Solr error: ${response.status}`, errorText);
            return res.status(response.status).json({ 
                error: `Solr error: ${response.status}`,
                message: errorText
            });
        }
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            error: 'Server error', 
            message: error.message 
        });
    }
});

// Get Solr collections
app.get('/api/collections', async (req, res) => {
    try {
        const url = 'http://localhost:8983/solr/admin/collections?action=LIST&wt=json';
        const response = await fetch(url);
        
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: `Solr error: ${response.status}`,
                message: await response.text()
            });
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ 
            error: 'Server error', 
            message: error.message 
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
});