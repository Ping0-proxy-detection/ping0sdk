const Ping0 = require('../src/index');

// Initialize with your API Key
// You can get one at: https://rapidapi.com/smstrek1/api/ping0-api
const apiKey = 'YOUR_RAPIDAPI_KEY';

// Configure your rules
const sdk = new Ping0(apiKey, {
    rules: {
        max_risk_score: 80,
        block_vpn: true,
        block_proxy: true,
        block_tor: true,
        allowed_countries: ['US', 'GB', 'DE']
    }
});

async function checkVisitor(ip) {
    console.log(`Checking IP: ${ip}...`);

    // Perform the check
    const result = await sdk.check(ip);

    if (result.action === 'block') {
        console.log(`[BLOCK] Visitor blocked. Reason: ${result.reason}`);
        // Handle block (e.g., show error page, return 403)
    } else {
        console.log('[ALLOW] Visitor allowed.');
        // Allow access
        console.log('Geo:', result.data.location.country);
    }
}

// Example usage (replace with real IP)
checkVisitor('8.8.8.8');
