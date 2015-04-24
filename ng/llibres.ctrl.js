angular.module('app-llibres')
        .controller("LlibresController", function($scope, $location ,LlibresFactory, AutorsFactory){
 

    $scope.llibres = [];
    $scope.autors = [];
    
    AutorsFactory.srv.query(function(autor){
        $scope.autors = autor;
    })
    
    LlibresFactory.srv.query(function(llibres){
        $scope.llibres = llibres;
        
    });

    $scope.editar = function(llibre){
        LlibresFactory.edit = llibre;
        $location.path("/editarLlibre");
    }
    $scope.esborrar = function(llibre){
        LlibresFactory.srv.delete({
            id: llibre.isbn
        }, function(){
            var pos = $scope.llibres.indexOf(llibre);
            $scope.llibres.splice(pos, 1);
        });
    }
   
});