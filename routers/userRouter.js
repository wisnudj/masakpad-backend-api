const router = require('express').Router()
const userController = require('../controllers/userController')

router.post('/signup', userController.SignUp)
router.post('/signin', userController.SignIn)

module.exports = router;
