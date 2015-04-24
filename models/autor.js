var db = require("../db");
var Autor = db.model("Autor", {
   nom: {
       type: String,
       required: true,
       unique: false
   },
    cognom: {
        type: String,
        required: true,
        unique: false
    },
    descripcio: {
        type: String,
        required: true,
        unique: false
    }
});
module.exports = Autor;