const router = require('express').Router()
const loginmiddle = require('../middleware/login');
const userController = require('../controllers/userController')

router.post('/signup', userController.SignUp)
router.post('/signin', userController.SignIn)
router.put('/ikuti/:id', loginmiddle.isLogin, userController.Ikuti)

module.exports = router;
