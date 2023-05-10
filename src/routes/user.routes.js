const {Router} = require('express');
const router = Router();

const {renderSignupForm,
    renderSigninForm,
    signin,
    signup,
    logout 
} = require('../controllers/user.controller');

router.get('/user/signup', renderSignupForm);
router.post('/user/signup', signup);
router.get('/user/signin', renderSigninForm);
router.post('/user/signin', signin);
router.get('/user/logout', logout);

module.exports = router;