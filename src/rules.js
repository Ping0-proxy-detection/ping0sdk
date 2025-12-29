class Rules {
    /**
     * Initialize the Rule Engine.
     * @param {Object} config - Rule configuration.
     * Example config:
     * {
     *   block_vpn: true,
     *   block_proxy: true,
     *   block_tor: true,
     *   max_risk_score: 80,
     *   allowed_countries: ['US', 'CA']
     * }
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * Evaluate the data against the rules.
     * @param {Object} data - The IP intelligence data.
     * @returns {Object} - { action: 'allow' | 'block', reason: string | null }
     */
    evaluate(data) {
        // 1. Check Risk Score
        if (this.config.max_risk_score !== undefined) {
            if (data.risk_score && data.risk_score > this.config.max_risk_score) {
                return { action: 'block', reason: `Risk score too high (${data.risk_score} > ${this.config.max_risk_score})` };
            }
        }

        // 2. Check Booleans (VPN, Proxy, Tor, etc.)
        const checks = [
            { key: 'is_vpn', configKey: 'block_vpn', label: 'VPN' },
            { key: 'is_proxy', configKey: 'block_proxy', label: 'Proxy' },
            { key: 'is_tor', configKey: 'block_tor', label: 'Tor' },
            { key: 'is_crawler', configKey: 'block_crawler', label: 'Crawler' },
            { key: 'is_abuser', configKey: 'block_abuser', label: 'Abuser' },
            { key: 'is_bogon', configKey: 'block_bogon', label: 'Bogon' },
            { key: 'is_datacenter', configKey: 'block_datacenter', label: 'Datacenter' }
        ];

        for (const check of checks) {
            if (this.config[check.configKey] && data[check.key]) {
                return { action: 'block', reason: `Detected ${check.label}` };
            }
        }

        // 3. Check Location (Country)
        // If allowed_countries is set, ONLY allow those.
        if (this.config.allowed_countries && Array.isArray(this.config.allowed_countries)) {
            const countryCode = data.location?.country; // e.g., "US"
            if (!countryCode || !this.config.allowed_countries.includes(countryCode)) {
                return { action: 'block', reason: `Country not allowed (${countryCode})` };
            }
        }

        // If blocked_countries is set, block those.
        if (this.config.blocked_countries && Array.isArray(this.config.blocked_countries)) {
            const countryCode = data.location?.country;
            if (countryCode && this.config.blocked_countries.includes(countryCode)) {
                return { action: 'block', reason: `Country blocked (${countryCode})` };
            }
        }

        // Default: Allow
        return { action: 'allow', reason: null };
    }
}

module.exports = Rules;
