const {Router} = require('express');
const { check } = require('express-validator');
const { validateJWT, fieldValidator, validateRole} = require('../middlewares');

const {postCategory, getCategories, getCategory, putCategory, deleteCategory} = require('../controllers/categories');
const { existsCategoryById } = require('../helpers/db-validators');

const router = Router();

router.get('/',getCategories); 


router.get('/:id',[
    check('id', 'it is not a valid id').isMongoId(),
    check('id').custom(existsCategoryById),
    fieldValidator
],getCategory); 


router.post('/',[
    validateJWT,
    check('name','the name is required').not().isEmpty(),
    fieldValidator,
],postCategory); 


router.put('/:id',[
    validateJWT,
    check('id', 'it is not a valid id').isMongoId(),
    check('id').custom(existsCategoryById),
    check('name', 'name is required').not().isEmpty(),
    fieldValidator
],putCategory); 


router.delete('/:id',[
    validateJWT,
    check('id', 'it is not a valid id').isMongoId(),
    check('id').custom(existsCategoryById),
    validateRole('ADMIN_ROLE'),
    fieldValidator
],deleteCategory); 

module.exports = router;