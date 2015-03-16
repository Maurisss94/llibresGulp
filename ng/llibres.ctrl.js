angular.module("app-llibres")
    .controller("LlibresController", function($scope, LlibresFactory){

    $scope.llibres = [];
    
    LlibresFactory.query(function(llibres){
        $scope.llibres = llibres;
    });
    
    $scope.afegirLlibre = function(){
        LlibresFactory.save({
            titol: $scope.titolLlibreNou,
            isbn: $scope.isbnLlibreNou,
            autors: ["hola"]
        },function() {
            $scope.llibres.unshift ({
            titol: $scope.titolLlibreNou,
            isbn: $scope.isbnLlibreNou,
            autors: ["hola"]
            });
            $scope.titolLlibreNou = "";
            $scope.isbnLlibreNou = "";
        });
            
        
        
    };
    
    $scope.editar = function(llibre){
        $scope.titolLlibreEdit = llibre.titol;
        $scope.isbnLlibreEdit = llibre.isbn;
        $scope.llibreEdit = llibre;
    }
    $scope.esborrar = function(llibre){
        LlibresFactory.delete({
            id: llibre.isbn
        }, function(){
        
            $scope.llibres.splice(llibre, 1);
        });
    }
    $scope.actualitzar = function(){
        LlibresFactory.update({"_id": $scope.llibreEdit._id, "isbn": $scope.isbnLlibreEdit, "titol": $scope.titolLlibreEdit}, function(){

            $scope.llibreEdit.isbn = $scope.isbnLlibreEdit  ;
            $scope.llibreEdit.titol = $scope.titolLlibreEdit;
            $scope.titolLlibreEdit = null;
            $scope.isbnLlibreEdit = null;
        });
    }
   
});