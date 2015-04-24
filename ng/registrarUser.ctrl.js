angular.module('app-llibres')
        .controller("registrarUserController", function($scope, $location, UserSrv){
       
    $scope.crearUsuari = function(usuari, password){
        
        $scope.$watchGroup([usuari, password], function(newVal,oldVal){
            if(newVal!=oldVal){
                $scope.error = null;
            }
        });
        if(!$scope.usuari || !$scope.password){
            $scope.error = "Has d'emplenar tots els camps";
        }else{
            UserSrv.registre(usuari, password)
                .success(function(user){   
                $location.path("/login");
            }).error(function(error, status){
                if(status == 409)
                    $scope.creat = "";
                    $scope.error = error.missatge;
            });
        }
        

};
});

