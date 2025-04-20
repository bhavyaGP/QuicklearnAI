const Razorpay = require('razorpay'); 
const Membership = require('../models/membership.model');
const Student = require('../models/student.model');
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
        const options = {
            amount: membership.price * 100,
            currency: 'INR',
            receipt: `order_${Date.now()}_${userId.slice(-6)}`, // ✅ fixed
            payment_capture: 1,
            notes: {
                membershipType: membershipType,
                userId: userId,
                duration: membership.duration
            }
        };
        

        razorpayInstance.orders.create(options, (err, order) => {
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
                order_id: order.id,
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
console.log('Received payment verification request:', req.body);
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
        // Update student membership
        const membershipDetails = {
            startDate: new Date(),
            endDate: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)),
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            amount: price,
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

module.exports = {
    createOrder,
    verifyPayment
};
