angular.module('app-llibres')
    .controller('loginController', function($scope, $location, UserSrv){
    
    $scope.$watchGroup(['username', 'password'], function(newVal, oldVal){
       if(newVal != oldVal){
           $scope.error= null;
       } 
    });
    
    $scope.login = function(username, password){
        if(!username || !password){
            $scope.error = "Has d'emplenar tots els camps";
        }else{
            UserSrv.login(username, password, function(error, status){
               if(status == 401){
                   $scope.error = error.missatge;
               } 
            }).success(function(){
               UserSrv.getUser().then(function(user){
                   $scope.$emit('login', user.data);
                   $location.path("/");
               }) 
            });
        }
    }
    
});