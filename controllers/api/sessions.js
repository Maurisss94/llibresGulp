var router = require("express").Router();
var jwt = require('jwt-simple');
var User = require("../../models/user");
var secretKey = "paraulaSecreta";
var bcrypt = require('bcrypt');

router.post('/', function(req,res, next) {
    User.findOne({username: req.body.username})
            .select('password')
            .select('username')
            .exec(function(err,user) {
                if (err) return next(err);
                if (!user) return res.status(401).json({"missatge": "usuari no existeix"});
                bcrypt.compare(req.body.password, user.password, function(err, valid) {
                    if (err) return next(err);
                    if (!valid) return res.status(401).json({"missatge": "contrasenya o usuari invàlid"});
                    var token = jwt.encode({username:user.username}, secretKey);
                    res.status(201).send(token);
                });

            });
});
module.exports = router;
