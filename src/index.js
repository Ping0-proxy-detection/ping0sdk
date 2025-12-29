const Client = require('./client');
const Rules = require('./rules');

class Ping0 {
    /**
     * Initialize the Ping0 SDK.
     * @param {string} apiKey - Your RapidAPI Key.
     * @param {Object} options - Configuration options.
     */
    constructor(apiKey, options = {}) {
        if (!apiKey) {
            throw new Error('Ping0 SDK: API Key is required.');
        }
        this.client = new Client(apiKey);
        this.rules = new Rules(options.rules || {});
    }

    /**
     * Check an IP address against the configured rules.
     * @param {string} ip - The IP address to check.
     * @returns {Promise<Object>} - The decision and full data.
     */
    async check(ip) {
        try {
            const data = await this.client.lookup(ip);
            const decision = this.rules.evaluate(data);
            return {
                ...decision, // action, reason
                data: data   // full API response
            };
        } catch (error) {
            console.error('Ping0 SDK Error:', error);
            // Fail open or closed based on preference? Defaulting to allow with error info
            return {
                action: 'allow',
                reason: 'SDK Error',
                error: error.message
            };
        }
    }
}

module.exports = Ping0;
