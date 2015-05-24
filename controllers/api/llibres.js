module.exports = function(canal) {
    var Llibre = require("../../models/llibre");
    var router = require("express").Router();
    var jwt = require("jwt-simple");


    router.get('/', function(req, res, next){
        Llibre.find()
            .populate('autors')
            .exec(
                function(err, llibres){
                   if(err){
                       return next(err);
                   }else{

                       res.status(201).json(llibres);
                   } 
                });

    });
    router.post("/", function(req, res, next){
        console.log(req.body);
        if((req.body.isbn ==null)||(req.body.titol == null)){
            console.log("No es pot fer POST");
        }else{
       var llibre = new Llibre({
 
           isbn: req.body.isbn,
           titol: req.body.titol,
           autors: req.body.autors


       }); 
            console.log(llibre);
        llibre.save(function(err, llibre){
           if(err){
               return next(err);
           }else{
               canal.crear(llibre);
               res.status(201).json(llibre);
           }
        });
        }
    });

    router.delete("/", function(req, res, next){
        console.log("Error no es pot fer DELETE");
        res.status(400).send("Error no es pot fer DELETE");
    });
    router.get("/:id", function(req, res, next){
       Llibre.find({isbn:req.params.id},function(err,llibre) {
           if(err){
               return next(err);
           }else{
               res.status(201).json(llibre);
           }

       });
    });
    //router.post("/:id", function(req, res, next){
      //  res.status(400).send("Error no es pot fer POST");
    //});
    router.put("/", function(req, res, next){
        Llibre.findByIdAndUpdate(req.body._id, req.body, function(err, llibre){
           if(err){
               return next(err);
           }else{
               res.status(201).json("Put fet del"+ req.body);
               canal.editar(llibre);
           } 
        });
    });

    router.delete("/:id", function(req, res, next){
        Llibre.remove({isbn:req.params.id}, function(err){
           if(err){
               return next(err);
           }else{

               res.status(201).json("Llibre esborrat");
               canal.esborrar();
           } 
        });

    });



    return router;
    
}
