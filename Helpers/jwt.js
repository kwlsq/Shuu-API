const jwt = require('jsonwebtoken');

module.exports = {
    createJWToken: (payload) => {
        return jwt.sign(payload, 'shuu')
    }
}