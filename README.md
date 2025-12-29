# Ping0 SDK - Detect proxies, VPNs & Suspicious behaviour

The official Node.js SDK for [Ping0.xyz](https://ping0.xyz) IP intelligence. Easily integrate fraud prevention, VPN detection, and geolocation restrictions into your application.

## Installation

```bash
npm install ping0sdk
```

## Quick Start

```javascript
const Ping0 = require('ping0sdk');

// 1. Initialize with your RapidAPI Key (Get one at https://rapidapi.com/smstrek1/api/ping0-api)
const ping0 = new Ping0('YOUR_API_KEY', {
    rules: {
        block_vpn: true,      // Block known VPNs
        block_proxy: true,    // Block proxies
        max_risk_score: 85,   // Block IPs with risk score > 85
    }
});

// 2. Check an IP address
async function example() {
    const ip = '1.1.1.1'; // The visitor's IP
    const decision = await ping0.check(ip);

    if (decision.action === 'block') {
        console.log('Blocked:', decision.reason);
    } else {
        console.log('Allowed!');
        console.log('Location:', decision.data.location.country);
    }
}

example();
```

## Configuration Options

| Option | Type | Default | Description |
|Args|---|---|---|
| `api_key` | String | required | Your RapidAPI Key. |
| `rules.max_risk_score` | Number | undefined | Block IPs with a risk score higher than this value (0-100). |
| `rules.block_vpn` | Boolean | false | Block detected VPNs. |
| `rules.block_proxy` | Boolean | false | Block detected Proxies. |
| `rules.block_tor` | Boolean | false | Block Tor exit nodes. |
| `rules.allowed_countries` | Array | undefined | Whitelist of country codes (e.g. `['US', 'CA']`). |
| `rules.blocked_countries` | Array | undefined | Blacklist of country codes. |

## Response Object

The `check(ip)` method returns a Promise that resolves to:

```javascript
{
  "action": "allow" | "block",
  "reason": null | "Reason for block",
  "data": { ... } // The full JSON response from Ping0 API
}
```
