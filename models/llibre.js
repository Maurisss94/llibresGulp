var db = require("../db");
var Llibre = db.model("Llibre", {
   isbn:{
       type: String,
       required: true,
       unique:true
   },
    titol: {
        type: String,
        required: true
    },
    autors:[{
        type: db.Schema.Types.ObjectId,
        ref: 'Autor'
    }],
    date: {
        type: String,
        required: true,
        default: Date.now
    }
});
module.exports = Llibre;