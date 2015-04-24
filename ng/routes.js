angular.module("app-llibres")
        .config(function($routeProvider, $locationProvider){
            $routeProvider
                .when("/", {
                    controller:'LlibresController',
                    templateUrl: 'llibres.html',
                    autoritzat: false
                })
            .when("/crearLlibre", {
                    controller: 'nouLlibreController',
                    templateUrl: 'crearLlibre.html',
                    autoritzat: true
                })
            .when("/registrarUser", {
                    controller: 'registrarUserController',
                    templateUrl: 'registrarUser.html',
                    autoritzat: false
            })
            .when("/editarLlibre", {
                controller: 'editarLlibreController',
                templateUrl: 'editarLlibre.html',
                autoritzat: true
            })
            .when("/login", {
                controller: 'loginController',
                templateUrl: 'login.html',
                autoritzat: false
            })
            .when("/llistaAutors", {
                controller: 'llistaAutors',
                templateUrl: 'llistaAutors.html',
                autoritzat: false
            })
            .when("/editarAutor", {
                controller: 'editarAutorController',
                templateUrl: 'editarAutor.html',
                autoritzat: true
            })
            .when("/crearAutor", {
                controller: 'crearAutorController',
                templateUrl: 'crearAutor.html',
                autoritzat: true
            });
            
    $locationProvider.html5Mode({
                enabled:true,
                requireBase: false
            })
    
}).run(function($rootScope,UserSrv) {

        $rootScope.$on('$routeChangeStart', function(event, next) {
           if (next)
                if (!UserSrv.auth & next.autoritzat) 
                    event.preventDefault();
        });
    
});