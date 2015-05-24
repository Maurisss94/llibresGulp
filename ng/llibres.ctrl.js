angular.module('app-llibres')
        .controller("LlibresController", function($scope, $location, $interval ,LlibresFactory, AutorsFactory, CanalService){
 

    $scope.llibres = [];
    $scope.autors = [];
    $scope.mostrar = false;
    
    $scope.$on('actualitzar', function(){
        $scope.mostrar =true;
        var stop;
        stop = $interval(function(){
            $scope.mostrar = false;
        }, 5000);
         LlibresFactory.srv.query(function(llibres){
        $scope.llibres = llibres;
        
    });
    });
    
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