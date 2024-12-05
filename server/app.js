const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for top 10 crypto data
let cryptoData = [];

// Function to fetch and store top 10 crypto data
const fetchCryptoData = async () => {
    try {
        // Fetch data from the API
        const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
        const tickers = Object.values(response.data)
            .sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume)) // Sort by volume (descending)
            .slice(0, 10); // Get the top 10 entries

        // Update in-memory storage
        cryptoData = tickers.map((ticker, index) => ({
            id: index + 1,
            name: ticker.name,
            last_price: parseFloat(ticker.last),
            buy_price: parseFloat(ticker.buy),
            sell_price: parseFloat(ticker.sell),
            volume: parseFloat(ticker.volume),
            base_unit: ticker.base_unit,
        }));

        console.log('Data fetched and updated successfully!');
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
};

// Automatically fetch data every minute
fetchCryptoData(); // Initial fetch
setInterval(fetchCryptoData, 60000); // Fetch data every 60 seconds

// Get stored data
app.get('/get-data', (req, res) => {
    try {
        res.json(cryptoData);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Error fetching data');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
