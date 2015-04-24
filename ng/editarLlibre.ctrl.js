angular.module('app-llibres')
        .controller("editarLlibreController", function($scope, $location, LlibresFactory){

        console.log(LlibresFactory.edit);
        $scope.titolLlibreEdit = LlibresFactory.edit.titol;
        $scope.isbnLlibreEdit = LlibresFactory.edit.isbn;
        
    
    
    $scope.actualitzar = function(){
        if(($scope.titolLlibreEdit) &&($scope.isbnLlibreEdit)){

        LlibresFactory.srv.update({"_id": LlibresFactory.edit._id, "isbn": $scope.isbnLlibreEdit, "titol": $scope.titolLlibreEdit}, function(){

            LlibresFactory .edit.isbn = $scope.isbnLlibreEdit;
            LlibresFactory.edit.titol = $scope.titolLlibreEdit;
            $scope.titolLlibreEdit = null;
            $scope.isbnLlibreEdit = null;
            $location.path("/");
            
        });
        }
        
    }
    
});