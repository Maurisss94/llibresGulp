var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json());
app.use("/api/llibres", require("./controllers/api/llibres"));
app.use("/", require("./controllers/static"));

app.listen(8000, function(){
   console.log("Servidor escolta pel port "+ 8000); 
});