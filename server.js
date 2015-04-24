var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json());
app.use(require("./auth"));
app.use("/api/llibres", require("./controllers/api/llibres"));
app.use("/api/session", require("./controllers/api/sessions"));
app.use("/api/user", require("./controllers/api/users"));
app.use("/api/autors", require("./controllers/api/autors"));


app.use("/", require("./controllers/static"));



app.listen(8000, function(){
   console.log("Servidor escolta pel port "+ 8000); 
});
