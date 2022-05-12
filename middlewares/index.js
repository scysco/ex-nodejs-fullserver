
const fieldValidator = require('../middlewares/field-validator');
const validateJwt = require('../middlewares/validate-jwt');
const validateRole = require('../middlewares/validate-role');

module.exports = {
    ...fieldValidator,
    ...validateJwt,
    ...validateRole
}
