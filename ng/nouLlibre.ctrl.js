angular.module('app-llibres')
        .controller("nouLlibreController", function($scope, $location, LlibresFactory, AutorsFactory){
    
    $scope.autors = [];
    AutorsFactory.srv.query(function(autor){
       $scope.autors = autor; 
    });

            $scope.afegirLlibre = function(){
                console.log($scope.autorSelected);
                console.log($scope.autorSelected);
            LlibresFactory.srv.save({
                titol: $scope.titolLlibreNou,
                isbn: $scope.isbnLlibreNou,
                autors: $scope.autorSelected
            },function() {
                $scope.titolLlibreNou = "";
                $scope.isbnLlibreNou = "";
                $location.path("/");
            });
           }
});
        
        
 