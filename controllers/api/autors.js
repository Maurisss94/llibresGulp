var Autor = require("../../models/autor");
var router = require("express").Router();
var jwt = require("jwt-simple");

router.get("/", function(req, res, next){
    
    Autor.find(function(err, autors){
       if(err){
           return next(err);
       }else{
           res.status(201).json(autors);
       }
    });
    });
router.post("/", function(req, res, next){
    
   if((req.body.nom == null)||(req.body.cognom == null )||(req.body.descripcio == null)){
       console.log(req.body);
       console.log("No es pot fer POST");
   }else{
       var autor = new Autor({
           nom: req.body.nom,
           cognom: req.body.cognom,
           descripcio: req.body.descripcio
       });
       autor.save(function(err, autor){
          if(err){
              return next(err);
          }else{
              res.status(201).json(autor);
          } 
       });
   } 
});
router.delete("/", function(req, res, next){
    console.log("Error no es pot fer DELETE");
    res.status(400).send("Error no es pot fer DELETE");
});
router.get("/:id", function(req, res, next){
   Autor.find({_id:req.params.id}, function(err, autor){
       if(err){
           return next(err);
       }else{
           res.status(201).json(autor);
       }
   }); 
});
router.put("/", function(req, res, next){
    Autor.findByIdAndUpdate(req.body._id, req.body, function(err){
        if(err){
            return next(err);
        }else{
            res.status(201).json("Put fet del "+ req.body);
        }
    });
});

router.delete("/:id", function(req, res, next){
    Autor.remove({_id:req.params.id}, function(err){
        if(err){
            return next(err);
        }else{
            res.status(201).json("Autor esborrat");
        }
    });
});



module.exports = router;