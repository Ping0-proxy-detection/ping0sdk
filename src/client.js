const https = require('https');

class Client {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiHost = 'ping0.p.rapidapi.com';
        this.baseUrl = `https://${this.apiHost}/rapidapi/lookup/ip`;
    }

    /**
     * Perform an IP lookup.
     * @param {string} ip - The IP address to lookup.
     * @returns {Promise<Object>} - The JSON response from the API.
     */
    lookup(ip) {
        return new Promise((resolve, reject) => {
            const url = `${this.baseUrl}/${ip}`;

            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': this.apiKey,
                    'x-rapidapi-host': this.apiHost
                }
            };

            const req = https.request(url, options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            const parsed = JSON.parse(data);
                            resolve(parsed);
                        } catch (e) {
                            reject(new Error('Failed to parse API response'));
                        }
                    } else {
                        reject(new Error(`API Request failed with status code ${res.statusCode}: ${data}`));
                    }
                });
            });

            req.on('error', (e) => {
                reject(e);
            });

            req.end();
        });
    }
}

module.exports = Client;
