const UserMembership = require('../models/userMembership.model');
const Student = require('../models/student.model');

/**
 * Middleware to check and track feature usage
 * @param {string} feature - The feature to check (e.g., 'ytSummary', 'quiz', etc.)
 * @param {boolean} autoDecrement - Whether to automatically decrement usage count (default: true)
 * @returns {Function} Express middleware
 */
const checkFeatureUsage = (feature, autoDecrement = true) => {
    return async (req, res, next) => {
        try {
            const userId = req.userId;
            
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required',
                    code: 'AUTH_REQUIRED'
                });
            }

            // Check if the user has remaining usage for this feature
            const usageCheck = await UserMembership.checkFeatureUsage(userId, feature);
            
            // Store usage info in the request for later use
            req.featureUsage = usageCheck;
            
            if (!usageCheck.hasAccess) {
                return res.status(403).json({
                    success: false,
                    message: usageCheck.message,
                    code: 'FEATURE_USAGE_LIMIT_REACHED',
                    data: {
                        feature,
                        limit: usageCheck.limit,
                        used: usageCheck.used || 0,
                        remaining: usageCheck.remaining
                    }
                });
            }
            
            // If autoDecrement is true, increment usage count before proceeding
            if (autoDecrement) {
                const result = await UserMembership.incrementFeatureUsage(userId, feature);
                
                // Update the usage info in the request
                req.featureUsage = {
                    ...usageCheck,
                    remaining: result.remaining
                };
                
                // Also update the student model for backward compatibility
                await updateStudentUsage(userId, feature);
            }
            
            // Proceed to the next middleware/route handler
            next();
            
        } catch (error) {
            console.error('Error in feature usage middleware:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                code: 'SERVER_ERROR'
            });
        }
    };
};

/**
 * Update usage count in the student model for backward compatibility
 * @param {string} userId - The user ID
 * @param {string} feature - The feature being used
 */
async function updateStudentUsage(userId, feature) {
    try {
        // Map feature names to student model usage fields
        const featureToUsageField = {
            ytSummary: 'ytSummary',
            quiz: 'quiz',
            chatbot: 'chatbot',
            mindmap: 'mindmap'
        };
        
        const field = featureToUsageField[feature];
        if (!field) return; // Skip if no mapping exists
        
        // Update the usage count in the student model
        const updateQuery = { $inc: {} };
        updateQuery.$inc[`usage.${field}`] = 1;
        updateQuery.$set = { 'usage.lastActive': new Date() };
        
        await Student.findByIdAndUpdate(userId, updateQuery);
    } catch (error) {
        console.error('Error updating student usage:', error);
        // Don't throw error, just log it - this is a secondary update
    }
}

/**
 * Get feature usage information for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} Usage information for all features
 */
const getFeatureUsage = async (userId) => {
    try {
        const membership = await UserMembership.getActiveMembership(userId);
        
        if (!membership) {
            return {
                hasActiveMembership: false,
                features: {}
            };
        }
        
        // Get usage for each feature
        const features = ['ytSummary', 'quiz', 'chatbot', 'mindmap', 'p2pDoubt', 'joinQuiz', 'modelselect', 'difficultychoose'];
        const usageInfo = {};
        
        for (const feature of features) {
            usageInfo[feature] = await UserMembership.checkFeatureUsage(userId, feature);
        }
        
        return {
            hasActiveMembership: true,
            membershipType: membership.membershipType,
            expiryDate: membership.expiryDate,
            features: usageInfo
        };
    } catch (error) {
        console.error('Error getting feature usage:', error);
        throw error;
    }
};

module.exports = {
    checkFeatureUsage,
    getFeatureUsage
};
