const router = require('express').Router()
const loginmiddle = require('../middleware/login');
const gcp = require('../middleware/gcp')
const recookController = require('../controllers/recookController');

router.get('/', recookController.Read)
router.get('/byresep/:id', recookController.ReadOne)
router.post('/create', loginmiddle.isLogin, gcp.multer.single('file'), gcp.sendUploadToGCS, recookController.Create)
router.put('/like/:id', loginmiddle.isLogin, recookController.Like)
router.delete('/delete/:id', recookController.Delete)

module.exports = router;
