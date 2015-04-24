angular.module('app-llibres')
        .controller('editarAutorController', function($scope, $location, AutorsFactory){
    
    $scope.nomAutorEdit = AutorsFactory.edit.nom;
    $scope.cognomAutorEdit = AutorsFactory.edit.cognom;
    $scope.descripcioAutorEdit = AutorsFactory.edit.descripcio;
    
    $scope.actualitzar = function(){
        
        if(($scope.nomAutorEdit)&&($scope.cognomAutorEdit)&&($scope.descripcioAutorEdit)){
            AutorsFactory.srv.update({"_id": AutorsFactory.edit._id, "nom": $scope.nomAutorEdit, "cognom": $scope.cognomAutorEdit, "descripcio": $scope.descripcioAutorEdit}, function(){
               
                AutorsFactory.edit.nom = $scope.nomAutorEdit;
                AutorsFactory.edit.cognom = $scope.cognomAutorEdit;
                AutorsFactory.edit.descripcio = $scope.descripcioAutorEdit;
                $scope.nomAutorEdit = null;
                $scope.cognomAutorEdit = null;
                $scope.descripcioAutorEdit = null;
                $location.path("/llistaAutors");
                
            });
        }
    }
    
})