const {Router} = require('express');
const { check } = require('express-validator');

const {
        fieldValidator,
        validateJWT,
        isAdminRole,
        validateRole
} = require('../middlewares');

const { usersGet, 
        usersPut,
        usersPost,
        usersDelete} = require('../controllers/users');

const { isValidRole, existsEmail, existsUserById} = require('../helpers/db-validators');

const router = Router();

router.get('/',usersGet);
router.put('/:id',[
        check('id', 'it is not a valid id').isMongoId(),
        check('id').custom(existsUserById),
        check('role').custom(isValidRole),
        fieldValidator
] ,usersPut);
router.post('/', [
        check('mail','the email has an invalid format').isEmail(),
        check('mail').custom(existsEmail),
        check('name','the name parameter is required').not().isEmpty(),
        check('password','the password parameter is required').not().isEmpty(),
        check('password','the password parameter must have at least 6 characters').isLength({min:6}),
        check('role').custom(isValidRole),
        fieldValidator
],usersPost);
router.delete('/:id',[
        validateJWT,
        // isAdminRole,
        validateRole('ADMIN_ROLE', 'SALES_ROLE'),
        check('id', 'it is not a valid id').isMongoId(),
        check('id').custom(existsUserById),
        fieldValidator
],usersDelete);


module.exports = router;