const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const API_BASE_URL = "https://server.indianhairworld.com";
const WEB_TOKEN = process.env.NEXT_PUBLIC_WEB_TOKEN;

const authHeaders = WEB_TOKEN ? { Authorization: `Bearer ${WEB_TOKEN}` } : {};

const fetchJsonWithAuthFallback = async (url) => {
    const baseHeaders = {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    };

    try {
        let res = await axios.get(url, { headers: { ...baseHeaders, ...authHeaders } });
        return res.data;
    } catch (error) {
        if (WEB_TOKEN) {
            try {
                let res = await axios.get(url, { headers: baseHeaders });
                return res.data;
            } catch (err) {
                return null;
            }
        }
    }
    return null;
};

const run = async () => {
    try {
        console.log("--- DEBUG START ---");

        // Products Default
        const prodUrl = `${API_BASE_URL}/api/v1/get_active_products`;
        console.log(`Fetching Default Products from ${prodUrl}`);
        const prodData = await fetchJsonWithAuthFallback(prodUrl);
        const list1 = prodData?.products || prodData?.product_list || [];
        console.log(`Default Count: ${list1.length}`);

        // Products Limit 1000
        const prodUrl2 = `${API_BASE_URL}/api/v1/get_active_products?limit=1000`;
        console.log(`Fetching Limit=1000 from ${prodUrl2}`);
        const prodData2 = await fetchJsonWithAuthFallback(prodUrl2);
        const list2 = prodData2?.products || prodData2?.product_list || [];
        console.log(`Limit 1000 Count: ${list2.length}`);

        // Products Limit 10000
        const prodUrl3 = `${API_BASE_URL}/api/v1/get_active_products?limit=10000`;
        console.log(`Fetching Limit=10000 from ${prodUrl3}`);
        const prodData3 = await fetchJsonWithAuthFallback(prodUrl3);
        const list3 = prodData3?.products || prodData3?.product_list || [];
        console.log(`Limit 10000 Count: ${list3.length}`);

        console.log("--- DEBUG END ---");

    } catch (e) {
        console.log("FATAL:", e.message);
    }
};

run();
