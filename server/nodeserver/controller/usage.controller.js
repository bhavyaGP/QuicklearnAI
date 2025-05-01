const Student = require('../models/student.model');
const redis = require('../redis.connection');
const { logFeatureUsage } = require('../utils/feature-analytics');

/**
 * Track feature usage (internal API)
 * This endpoint is called by the Flask server to track feature usage
 */
async function trackFeatureUsage(req, res) {
    try {
        // Verify internal API key
        const apiKey = req.headers['x-api-key'];
        if (apiKey !== process.env.INTERNAL_API_KEY) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const { userId, featureName, metadata } = req.body;

        if (!userId || !featureName) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Update usage in database
        const updateQuery = { $inc: {} };
        updateQuery.$inc[`usage.${featureName}`] = 1;
        updateQuery.$set = { 'usage.lastActive': new Date() };

        await Student.findByIdAndUpdate(userId, updateQuery);

        // Update Redis cache
        await redis.hincrby(`student:${userId}`, `usage.${featureName}`, 1);
        await redis.hset(`student:${userId}`, 'usage.lastActive', new Date().toISOString());

        // Log usage for analytics
        logFeatureUsage(userId, featureName, metadata);

        res.status(200).json({
            success: true,
            message: 'Usage tracked successfully'
        });
    } catch (error) {
        console.error('Error tracking feature usage:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

/**
 * Get user's feature usage
 */
async function getUserFeatureUsage(req, res) {
    try {
        const userId = req.userId;
        
        // Get user with usage data
        const user = await Student.findById(userId).select('membership membershipDetails usage');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Format the response
        const usageData = {
            membership: user.membership,
            membershipStatus: user.membershipDetails?.status || 'inactive',
            expiresAt: user.membershipDetails?.endDate || null,
            features: {
                ytSummary: {
                    used: user.usage?.ytSummary || 0,
                    limit: user.membershipDetails?.features?.ytSummary || 0
                },
                quiz: {
                    used: user.usage?.quiz || 0,
                    limit: user.membershipDetails?.features?.quiz || 0
                },
                chatbot: {
                    used: user.usage?.chatbot || 0,
                    limit: user.membershipDetails?.features?.chatbot || 0
                },
                mindmap: {
                    used: user.usage?.mindmap || 0,
                    limit: user.membershipDetails?.features?.mindmap || 0
                },
                aiDoubtSolve: {
                    used: user.usage?.aiDoubtSolve || 0,
                    limit: user.membershipDetails?.features?.aiDoubtSolve || 0
                }
            },
            lastActive: user.usage?.lastActive || null
        };
        
        res.status(200).json({
            success: true,
            usage: usageData
        });
    } catch (error) {
        console.error('Error getting user feature usage:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = {
    trackFeatureUsage,
    getUserFeatureUsage
};
