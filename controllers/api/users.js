var router = require("express").Router();
var bcrypt = require("bcrypt");
var jwt = require('jwt-simple');
var User = require("../../models/user");
var secretKey = "paraulaSecreta";


router.get('/', function(req, res, next) {
    if (!req.headers['x-auth']) {
       return res.status(401).json({"missatge": "Error autenticació"});
    }else{
        var auth = jwt.decode(req.headers['x-auth'], secretKey);
        User.findOne({username: auth.username}, function(err,user) {
        if (err) {
            return next(err);
        }else{
            res.status(200).json(user);
        }
    });
    }

});
router.post('/', function(req, res, next) {
    /* Primer cerquem l'usuari a la mongo */
    User.findOne({username:req.body.username}, function(err, user) {
        if (err) return next(err);
        if  (user) {
            res.status(409).json({"missatge":"L'usuari ja existeix"});
        } else {
                var nouUser = new User({username: req.body.username});
                bcrypt.hash(req.body.password, 11, function(err, hash) {
                    if (err) return next(err);
                    nouUser.password = hash;
                    nouUser.save(function(err) {
                        if (err) return next(err);
                        res.status(201).json({"missatge": "Usuari creat"});
                    });
                });
        }
    });

});

module.exports= router;
