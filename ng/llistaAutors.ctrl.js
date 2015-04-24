angular.module('app-llibres')
        .controller("llistaAutors", function($scope, $location, AutorsFactory){
    
    $scope.autors = [];
    
    AutorsFactory.srv.query(function(autors){
       $scope.autors = autors; 
        console.log($scope.autors);
    });
    
    $scope.editar = function(autor){
        AutorsFactory.edit = autor;
        $location.path("/editarAutor");
    }
    $scope.esborrar = function(autor){
        AutorsFactory.srv.delete({
           id: autor._id 
        }, function(){
            var pos = $scope.autors.indexOf(autor);
            $scope.autors.splice(pos, 1);
        })
    }
    
    
});