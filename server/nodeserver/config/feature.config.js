/**
 * Feature configuration with environment-specific settings
 */
const config = {
    development: {
        caching: {
            enabled: true,
            ttl: {
                user: 3600, // 1 hour in seconds
                membership: 86400 // 24 hours in seconds
            }
        },
        tracking: {
            logRequests: true,
            detailedErrors: true
        },
        features: {
            ytSummary: {
                rateLimit: 10, // requests per minute
                processingTime: 30, // seconds
            },
            quiz: {
                rateLimit: 5, // requests per minute
                maxQuestions: 20
            },
            p2pDoubt: {
                maxActiveChats: 3
            }
        }
    },
    production: {
        caching: {
            enabled: true,
            ttl: {
                user: 1800, // 30 minutes in seconds
                membership: 86400 // 24 hours in seconds
            }
        },
        tracking: {
            logRequests: true,
            detailedErrors: false
        },
        features: {
            ytSummary: {
                rateLimit: 6, // requests per minute
                processingTime: 30, // seconds
            },
            quiz: {
                rateLimit: 3, // requests per minute 
                maxQuestions: 15
            },
            p2pDoubt: {
                maxActiveChats: 2
            }
        }
    }
};

// Export the configuration based on environment
const env = process.env.NODE_ENV || 'development';
module.exports = config[env];