angular.module('app-llibres')
    .service('CanalService', function($rootScope) {
        var socket = io().connect();
        socket.on('connect',function(s) {
            socket.on('crear', function(){
                $rootScope.$broadcast('actualitzar');
                $rootScope.$apply();
            });5
            socket.on('editar', function(){
                $rootScope.$broadcast('actualitzar');
                $rootScope.$apply();
            });
            socket.on('esborrar', function(){
                $rootScope.$broadcast('actualitzar');
                $rootScope.eliminado = "eliminat";
                $rootScope.$apply();
            });
        });
    });