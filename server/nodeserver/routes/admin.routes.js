const express = require('express');
const router = express.Router();
const { getOrderStats, getOrders } = require('../controller/payment.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

router.get('/orders/stats', verifyAdmin, getOrderStats);
router.get('/orders', verifyAdmin, getOrders);

module.exports = router;