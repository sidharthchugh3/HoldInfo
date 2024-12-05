// URL of the backend server
const BASE_URL = 'http://localhost:8000';

document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.getElementById('crypto-data');

    try {
        // Automatically fetch the stored data from the backend
        const dataResponse = await fetch(`${BASE_URL}/get-data`);
        const cryptoData = await dataResponse.json();

        // Update the table with data
        tableBody.innerHTML = ''; // Clear existing rows
        cryptoData.forEach((crypto, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${crypto.name.toUpperCase()}</td>
                <td>₹ ${crypto.last_price.toLocaleString()}</td>
                <td>₹ ${crypto.buy_price.toLocaleString()} / ₹ ${crypto.sell_price.toLocaleString()}</td>
                <td>${crypto.volume.toLocaleString()}</td>
                <td>${crypto.base_unit.toUpperCase()}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
