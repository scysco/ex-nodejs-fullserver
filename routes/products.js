const {Router} = require('express');
const { check } = require('express-validator');
const { deleteProduct, putProduct, postProduct, getProduct, getProducts } = require('../controllers/products');
const { existsProductById } = require('../helpers/db-validators');
const { validateJWT, fieldValidator, validateRole} = require('../middlewares');
const { validateCategory } = require('../middlewares/validate-category');

const router = Router();

router.get('/',getProducts);


router.get('/:id',[
    check('id', 'it is not a valid id').isMongoId(),
    check('id').custom(existsProductById),
    fieldValidator
],getProduct); 


router.post('/',[
    validateJWT,
    check('name','the name is required').not().isEmpty(),
    validateCategory,
    fieldValidator,
],postProduct); 


router.put('/:id',[
    validateJWT,
    check('id', 'it is not a valid id').isMongoId(),
    check('id').custom(existsProductById),
    check('name', 'name is required').not().isEmpty(),
    validateCategory,
    fieldValidator
],putProduct); 


router.delete('/:id',[
    validateJWT,
    check('id', 'it is not a valid id').isMongoId(),
    check('id').custom(existsProductById),
    validateRole('ADMIN_ROLE'),
    fieldValidator
],deleteProduct); 

module.exports = router;