var jwt = require("jwt-simple");
var secretKey = "paraulaSecreta";

module.exports = function (req, res, next) {
    if (req.headers['x-auth']) {
        req.auth = jwt.decode(req.headers['x-auth'], secretKey);
    }
    next();
};