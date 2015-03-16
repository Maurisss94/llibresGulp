var mongoose = require("mongoose");
mongoose.connect("mongodb://Maurisss94:patata@ds049219.mongolab.com:49219/llibres", function(){
   console.log("Connectat a mongolab"); 
});

module.exports = mongoose;