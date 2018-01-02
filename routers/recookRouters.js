const router = require('express').Router()
const loginmiddle = require('../middleware/login');
const recookController = require('../controllers/recookController');

router.get('/', recookController.Read)
router.post('/create', loginmiddle.isLogin, gcp.multer.single('file'), gcp.sendUploadToGCS, recookController.Create)
router.put('/like/:id', loginmiddle.isLogin, recookController.Like)

module.exports = router;
