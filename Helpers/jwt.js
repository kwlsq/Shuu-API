const jwt = require('jsonwebtoken');

module.exports = {
    createJWTToken : (payload,expire) => {
        return jwt.sign(payload, 'uniqueKey', {
            expiresIn: `${expire}`
        })
    }
}