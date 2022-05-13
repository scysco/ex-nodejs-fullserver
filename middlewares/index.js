
const fieldValidator = require('../middlewares/field-validator');
const validateJwt = require('../middlewares/validate-jwt');
const validateRole = require('../middlewares/validate-role');
const validateFile = require('../middlewares/validate-file');

module.exports = {
    ...fieldValidator,
    ...validateJwt,
    ...validateRole,
    ...validateFile,
}
