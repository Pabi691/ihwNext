const axios = require('axios');

const API_URL = 'https://server.indianhairworld.com/api/v1/global-content';
const TOKEN = '2|SwAXG9wWqc4rwZPstwG42DUVpRhmkWjO5Vj2VpRF';

async function testEndpoint() {
    try {
        console.log(`Testing endpoint: ${API_URL}`);
        console.log(`Using token: ${TOKEN}`);

        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        });

        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testEndpoint();
