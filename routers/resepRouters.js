const router = require('express').Router()
const loginmiddle = require('../middleware/login');
const gcp = require('../middleware/gcp')
const resepController = require('../controllers/resepController');

router.get('/', resepController.Read)
router.post('/create', loginmiddle.isLogin, gcp.multer.single('file'), gcp.sendUploadToGCS, resepController.Create)
router.put('/like/:id', loginmiddle.isLogin, resepController.Like)
router.delete('/delete/:id', resepController.Delete)

module.exports = router;
