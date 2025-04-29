const express = require('express');
const router = express.Router();
const { getOrderStats, getOrders } = require('../controller/payment.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');
const { getPendingTeacherRequests, handleTeacherRequest } = require('../controller/admin.controller');

router.get('/orders/stats', verifyAdmin, getOrderStats);
router.get('/orders', verifyAdmin, getOrders);
router.get('/teachers/pending', verifyAdmin, getPendingTeacherRequests);
router.post('/teachers/handle-request', verifyAdmin, handleTeacherRequest);

module.exports = router;