const express = require('express');
const router = express.Router();

const { storestatics, getstatistics, uploadFile, upload, giveratingtoteacher } = require('../controller/student.controller');
const {
    verifyUser
} = require('../middleware/auth.middleware');

router.post('/statistics', verifyUser, storestatics);
router.get('/showhistory', verifyUser, getstatistics);
router.post('/upload', verifyUser, upload.single('image'), uploadFile);
router.post('/rating', verifyUser, giveratingtoteacher);

module.exports = router;    