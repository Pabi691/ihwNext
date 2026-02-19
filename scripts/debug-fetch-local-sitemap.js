const http = require('http');

const url = 'http://localhost:3000/sitemap.xml';

http.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Sitemap status:', res.statusCode);
        console.log('Sitemap start preview:', data.substring(0, 500)); // First 500 chars to see debug comment
        console.log('Total length:', data.length);
    });

}).on('error', (err) => {
    console.error('Error fetching sitemap:', err.message);
});
