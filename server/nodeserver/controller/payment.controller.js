const Razorpay = require('razorpay'); 
const Membership = require('../models/membership.model');
const Student = require('../models/student.model');
const Order = require('../models/order.model');
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
const crypto = require('crypto');

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});

const createOrder = async(req, res) => {
    try {
        const { membershipType } = req.body;
        const userId = req.userId;
        
        // Get membership details
        const membership = await Membership.findOne({ type: membershipType });
        if (!membership) {
            return res.status(404).json({ success: false, msg: 'Membership type not found' });
        }

        const razorpayOrderId = `order_${Date.now()}_${userId.slice(-6)}`;
        
        // Create order record
        const order = new Order({
            student: userId,
            membership: membershipType,
            amount: membership.price,
            duration: membership.duration,
            paymentDetails: {
                orderId: razorpayOrderId,
                status: 'pending'
            },
            features: membership.features
        });
        await order.save();

        const options = {
            amount: membership.price * 100,  // Converting to paise
            currency: 'INR',
            receipt: razorpayOrderId,
            payment_capture: 1,
            notes: {
                membershipType: membershipType,
                userId: userId,
                duration: membership.duration
            }
        };

        razorpayInstance.orders.create(options, (err, razorpayOrder) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    msg: 'Error creating order',
                    error: err
                });
            }

            res.status(200).json({
                success: true,
                msg: 'Order Created',
                order_id: razorpayOrder.id,
                amount: membership.price,
                membership: membership,
                currency: 'INR',
                name: "EduTech Platform",
                description: `${membershipType} Membership - ${membership.duration} days`,
                prefill: {
                    name: req.body.name,
                    email: req.body.email,
                    contact: req.body.contact
                }
            });
        });
    } catch (error) {
        console.error('Error in createOrder:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
};

const verifyPayment = async(req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            membership,
            userId
        } = req.body;

        // Verify payment signature
        const generated_signature = crypto
            .createHmac('sha256', RAZORPAY_SECRET_KEY)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ success: false, msg: 'Invalid payment signature' });
        }

        let price
        if(membership == "Achiever"){
            price = 99;
        }
        else{
            price = 49;
        }

        const startDate = new Date();
        const endDate = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));

        // Update order status
        await Order.findOneAndUpdate(
            { "paymentDetails.orderId": razorpay_order_id },
            {
                "paymentDetails.paymentId": razorpay_payment_id,
                "paymentDetails.status": "completed",
                "validityPeriod": {
                    startDate,
                    endDate
                }
            }
        );

        // Update student membership
        const membershipDetails = {
            startDate,
            endDate,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            amount:price,
            status: 'active'
        };

        await Student.findByIdAndUpdate(userId, {
            membership: membership,
            membershipDetails: membershipDetails
        });

        res.status(200).json({
            success: true,
            msg: 'Payment verified successfully',
            membership: membership,
            membershipDetails,
            isverified: true
        });
    } catch (error) {
        console.error('Error in verifyPayment:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
};

// Admin endpoints for order management
const getOrderStats = async(req, res) => {
    try {
        const totalStats = await Order.getTotalRevenue();
        const membershipStats = await Order.getRevenueByMembership();
        
        res.status(200).json({
            success: true,
            stats: {
                total: totalStats,
                byMembership: membershipStats
            }
        });
    } catch (error) {
        console.error('Error getting order stats:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
};

const getOrders = async(req, res) => {
    try {
        const { status, membership, startDate, endDate, page = 1, limit = 10 } = req.query;
        
        let query = {};
        if (status) query["paymentDetails.status"] = status;
        if (membership) query.membership = membership;
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const orders = await Order.find(query)
            .populate('student', 'username email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            orders,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    getOrderStats,
    getOrders
};
