/**
 * Environment Variable Loader
 * Loads configuration from .env file
 * 
 * This script fetches and parses the .env file to make environment variables
 * available to the application. In production, you would use a proper build
 * system or server-side environment variables.
 */

// Environment variables object
const ENV = {};

/**
 * Load environment variables from .env file
 * @returns {Promise<Object>} Environment variables object
 */
async function loadEnv() {
    try {
        // Fetch .env file
        const response = await fetch('.env');
        
        if (!response.ok) {
            console.warn('⚠️ .env file not found. Using default configuration.');
            console.warn('📝 Copy .env.example to .env and configure your settings.');
            return ENV;
        }
        
        const text = await response.text();
        
        // Parse .env file
        const lines = text.split('\n');
        
        for (const line of lines) {
            // Skip empty lines and comments
            if (!line.trim() || line.trim().startsWith('#')) {
                continue;
            }
            
            // Parse KEY=VALUE format
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                
                ENV[key] = value;
            }
        }
        
        console.log('✅ Environment variables loaded successfully');
        return ENV;
        
    } catch (error) {
        console.error('❌ Error loading .env file:', error);
        console.warn('📝 Using default configuration. Copy .env.example to .env and configure your settings.');
        return ENV;
    }
}

/**
 * Get environment variable value
 * @param {string} key - Environment variable key
 * @param {string} defaultValue - Default value if key not found
 * @returns {string} Environment variable value
 */
function getEnv(key, defaultValue = '') {
    return ENV[key] || defaultValue;
}

/**
 * Check if environment variables are loaded
 * @returns {boolean} True if loaded
 */
function isEnvLoaded() {
    return Object.keys(ENV).length > 0;
}

/**
 * Get all environment variables
 * @returns {Object} All environment variables
 */
function getAllEnv() {
    return { ...ENV };
}

// Export functions
// In vanilla JS with script tags, these are available globally

// Made with Bob
