const {Router} = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/field-validator');


const router = Router();

router.post('/login',[
    check('mail','the email has an invalid format').isEmail(),
    check('password','the password parameter is required').not().isEmpty(),
    fieldValidator
],login);

router.post('/google',[
    check('id_token','id_token is required').not().isEmpty(),
    fieldValidator
],googleSignIn);

module.exports = router;