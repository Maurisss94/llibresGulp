var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var http = require('http').Server(app);

var port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(require("./auth"));
var canal = require("./controllers/api/canal")(http);
app.use("/api/llibres", require("./controllers/api/llibres")(canal));
app.use("/api/session", require("./controllers/api/sessions"));
app.use("/api/user", require("./controllers/api/users"));
app.use("/api/autors", require("./controllers/api/autors"));


app.use("/", require("./controllers/static"));



http.listen(port, function(){
   console.log("Servidor escolta pel port "+ port); 
});
