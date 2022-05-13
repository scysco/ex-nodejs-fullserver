const {Router} = require('express');
const { check } = require('express-validator');
const { upload, updateImg, getImage } = require('../controllers/uploads');
const { isAllowedCollections } = require('../helpers');

const { fieldValidator, validateFile } = require('../middlewares');


const router = Router();

router.post('/',upload);
router.put('/:collection/:id',[
    validateFile,
    check('id','invalid id').isMongoId(),
    check('collection').custom(c => isAllowedCollections(c,['users','products'])),
    fieldValidator
],updateImg);
router.get('/:collection/:id',[
    check('id','invalid id').isMongoId(),
    check('collection').custom(c => isAllowedCollections(c,['users','products'])),
    fieldValidator
],getImage);


module.exports = router;