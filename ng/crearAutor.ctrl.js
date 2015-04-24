angular.module('app-llibres')
        .controller('crearAutorController', function($scope, $location, AutorsFactory){
    
    $scope.afegirAutor = function(){
        AutorsFactory.srv.save({
           nom: $scope.nomAutorNou,
            cognom: $scope.cognomAutorNou,
            descripcio: $scope.descripcioAutorNou
        }, function(){
            $location.path("/llistaAutors");
        });
    }
    
})