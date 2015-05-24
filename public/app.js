angular.module("app-llibres", ["ngResource","ngRoute"]);
angular.module('app-llibres')
    .controller("ApplicationController", function($scope,$location,UserSrv) {
        $scope.$on('login', function(e,user) {
            /*
                Quan s'ha fet login s'emet l'event "login"
                i això fa que la variable de l'scope "currentUser"
                li diem quin usuari s'ha autenticant, d'aquesta manera
                fem que apareguin diferents opcions al menú
            */
            $scope.currentUser = user;
        });
        $scope.logout = function(){
            /*
                Quan fem logout esborrem el token i la variable
                de l'$scope "currentUser", d'aquesta forma desapareixen
                els menús sensibles a la autenticació
            */
            UserSrv.logout();
            delete $scope.currentUser;
            $location.path('/');
        };
    });
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
angular.module('app-llibres')
        .controller("LlibresController", function($scope, $location, $interval ,LlibresFactory, AutorsFactory, CanalService){
 

    $scope.llibres = [];
    $scope.autors = [];
    $scope.mostrar = false;
    
    $scope.$on('actualitzar', function(){
        $scope.mostrar =true;
        var stop;
        stop = $interval(function(){
            $scope.mostrar = false;
        }, 5000);
         LlibresFactory.srv.query(function(llibres){
        $scope.llibres = llibres;
        
    });
    });
    
    AutorsFactory.srv.query(function(autor){
        $scope.autors = autor;
    })
    
    LlibresFactory.srv.query(function(llibres){
        $scope.llibres = llibres;
        
    });

    $scope.editar = function(llibre){
        LlibresFactory.edit = llibre;
        $location.path("/editarLlibre");
    }
    $scope.esborrar = function(llibre){
        LlibresFactory.srv.delete({
            id: llibre.isbn
        }, function(){
            var pos = $scope.llibres.indexOf(llibre);
            $scope.llibres.splice(pos, 1);
        });
    }
   
});
angular.module("app-llibres")
    .factory("LlibresFactory", function($resource) {
    return {srv: $resource("/api/llibres/:id", null,
    {
        'update': { method:'PUT' }
    }),
            edit: null
           }
});

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
angular.module("app-llibres")
    .factory("AutorsFactory", function($resource) {
    return {srv: $resource("/api/autors/:id", null,
    {
        'update': { method:'PUT' }
    }),
            edit: null
           }
});
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
angular.module('app-llibres')
        .controller("nouLlibreController", function($scope, $location, LlibresFactory, AutorsFactory){
    
    var socket = io().connect();
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


angular.module("app-llibres")
    .service('UserSrv', function($http){
    var srv = this;
    srv.auth= false;
    srv.getUser = function(){
        return $http.get("/api/user");
    }
    srv.login = function(username, password, noLogin){
        return $http.post('api/session', {
            username: username,
            password: password
        }).success(function(data, status){
            $http.defaults.headers.common['x-auth']  = data;
            if(data) srv.auth = true;
        }).error(function(error, status){
           noLogin(error, status); 
        });
    };
    this.registre = function(username, password){
        return $http.post("/api/user", {
            username: username,
            password: password
        });
    };
    this.logout = function(){
        srv.auth = false;
        $http.defaults.headers.common['x-auth'] = "";
    }
})
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImFwcGxpY2F0aW9uLmN0cmwuanMiLCJjYW5hbC5zdmMuanMiLCJjcmVhckF1dG9yLmN0cmwuanMiLCJlZGl0YUF1dG9yLmN0cmwuanMiLCJlZGl0YXJMbGlicmUuY3RybC5qcyIsImxsaWJyZXMuY3RybC5qcyIsImxsaWJyZXMuc3ZjLmpzIiwibGxpc3RhQXV0b3JzLmN0cmwuanMiLCJsbGlzdGFBdXRvcnMuc3ZjLmpzIiwibG9naW4uY3RybC5qcyIsIm5vdUxsaWJyZS5jdHJsLmpzIiwicmVnaXN0cmFyVXNlci5jdHJsLmpzIiwicmVnaXN0cmFyVXNlci5zdmMuanMiLCJyb3V0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoXCJhcHAtbGxpYnJlc1wiLCBbXCJuZ1Jlc291cmNlXCIsXCJuZ1JvdXRlXCJdKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwLWxsaWJyZXMnKVxuICAgIC5jb250cm9sbGVyKFwiQXBwbGljYXRpb25Db250cm9sbGVyXCIsIGZ1bmN0aW9uKCRzY29wZSwkbG9jYXRpb24sVXNlclNydikge1xuICAgICAgICAkc2NvcGUuJG9uKCdsb2dpbicsIGZ1bmN0aW9uKGUsdXNlcikge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICBRdWFuIHMnaGEgZmV0IGxvZ2luIHMnZW1ldCBsJ2V2ZW50IFwibG9naW5cIlxuICAgICAgICAgICAgICAgIGkgYWl4w7IgZmEgcXVlIGxhIHZhcmlhYmxlIGRlIGwnc2NvcGUgXCJjdXJyZW50VXNlclwiXG4gICAgICAgICAgICAgICAgbGkgZGllbSBxdWluIHVzdWFyaSBzJ2hhIGF1dGVudGljYW50LCBkJ2FxdWVzdGEgbWFuZXJhXG4gICAgICAgICAgICAgICAgZmVtIHF1ZSBhcGFyZWd1aW4gZGlmZXJlbnRzIG9wY2lvbnMgYWwgbWVuw7pcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xuICAgICAgICB9KTtcbiAgICAgICAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIFF1YW4gZmVtIGxvZ291dCBlc2JvcnJlbSBlbCB0b2tlbiBpIGxhIHZhcmlhYmxlXG4gICAgICAgICAgICAgICAgZGUgbCckc2NvcGUgXCJjdXJyZW50VXNlclwiLCBkJ2FxdWVzdGEgZm9ybWEgZGVzYXBhcmVpeGVuXG4gICAgICAgICAgICAgICAgZWxzIG1lbsO6cyBzZW5zaWJsZXMgYSBsYSBhdXRlbnRpY2FjacOzXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgVXNlclNydi5sb2dvdXQoKTtcbiAgICAgICAgICAgIGRlbGV0ZSAkc2NvcGUuY3VycmVudFVzZXI7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICAgICB9O1xuICAgIH0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAtbGxpYnJlcycpXG4gICAgLnNlcnZpY2UoJ0NhbmFsU2VydmljZScsIGZ1bmN0aW9uKCRyb290U2NvcGUpIHtcbiAgICAgICAgdmFyIHNvY2tldCA9IGlvKCkuY29ubmVjdCgpO1xuICAgICAgICBzb2NrZXQub24oJ2Nvbm5lY3QnLGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICAgIHNvY2tldC5vbignY3JlYXInLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnYWN0dWFsaXR6YXInKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgfSk7NVxuICAgICAgICAgICAgc29ja2V0Lm9uKCdlZGl0YXInLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnYWN0dWFsaXR6YXInKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzb2NrZXQub24oJ2VzYm9ycmFyJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2FjdHVhbGl0emFyJyk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5lbGltaW5hZG8gPSBcImVsaW1pbmF0XCI7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwLWxsaWJyZXMnKVxuICAgICAgICAuY29udHJvbGxlcignY3JlYXJBdXRvckNvbnRyb2xsZXInLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgQXV0b3JzRmFjdG9yeSl7XG4gICAgXG4gICAgJHNjb3BlLmFmZWdpckF1dG9yID0gZnVuY3Rpb24oKXtcbiAgICAgICAgQXV0b3JzRmFjdG9yeS5zcnYuc2F2ZSh7XG4gICAgICAgICAgIG5vbTogJHNjb3BlLm5vbUF1dG9yTm91LFxuICAgICAgICAgICAgY29nbm9tOiAkc2NvcGUuY29nbm9tQXV0b3JOb3UsXG4gICAgICAgICAgICBkZXNjcmlwY2lvOiAkc2NvcGUuZGVzY3JpcGNpb0F1dG9yTm91XG4gICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9sbGlzdGFBdXRvcnNcIik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbn0pIiwiYW5ndWxhci5tb2R1bGUoJ2FwcC1sbGlicmVzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ2VkaXRhckF1dG9yQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBBdXRvcnNGYWN0b3J5KXtcbiAgICBcbiAgICAkc2NvcGUubm9tQXV0b3JFZGl0ID0gQXV0b3JzRmFjdG9yeS5lZGl0Lm5vbTtcbiAgICAkc2NvcGUuY29nbm9tQXV0b3JFZGl0ID0gQXV0b3JzRmFjdG9yeS5lZGl0LmNvZ25vbTtcbiAgICAkc2NvcGUuZGVzY3JpcGNpb0F1dG9yRWRpdCA9IEF1dG9yc0ZhY3RvcnkuZWRpdC5kZXNjcmlwY2lvO1xuICAgIFxuICAgICRzY29wZS5hY3R1YWxpdHphciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICBpZigoJHNjb3BlLm5vbUF1dG9yRWRpdCkmJigkc2NvcGUuY29nbm9tQXV0b3JFZGl0KSYmKCRzY29wZS5kZXNjcmlwY2lvQXV0b3JFZGl0KSl7XG4gICAgICAgICAgICBBdXRvcnNGYWN0b3J5LnNydi51cGRhdGUoe1wiX2lkXCI6IEF1dG9yc0ZhY3RvcnkuZWRpdC5faWQsIFwibm9tXCI6ICRzY29wZS5ub21BdXRvckVkaXQsIFwiY29nbm9tXCI6ICRzY29wZS5jb2dub21BdXRvckVkaXQsIFwiZGVzY3JpcGNpb1wiOiAkc2NvcGUuZGVzY3JpcGNpb0F1dG9yRWRpdH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBBdXRvcnNGYWN0b3J5LmVkaXQubm9tID0gJHNjb3BlLm5vbUF1dG9yRWRpdDtcbiAgICAgICAgICAgICAgICBBdXRvcnNGYWN0b3J5LmVkaXQuY29nbm9tID0gJHNjb3BlLmNvZ25vbUF1dG9yRWRpdDtcbiAgICAgICAgICAgICAgICBBdXRvcnNGYWN0b3J5LmVkaXQuZGVzY3JpcGNpbyA9ICRzY29wZS5kZXNjcmlwY2lvQXV0b3JFZGl0O1xuICAgICAgICAgICAgICAgICRzY29wZS5ub21BdXRvckVkaXQgPSBudWxsO1xuICAgICAgICAgICAgICAgICRzY29wZS5jb2dub21BdXRvckVkaXQgPSBudWxsO1xuICAgICAgICAgICAgICAgICRzY29wZS5kZXNjcmlwY2lvQXV0b3JFZGl0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9sbGlzdGFBdXRvcnNcIik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbn0pIiwiYW5ndWxhci5tb2R1bGUoJ2FwcC1sbGlicmVzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJlZGl0YXJMbGlicmVDb250cm9sbGVyXCIsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBMbGlicmVzRmFjdG9yeSl7XG5cbiAgICAgICAgY29uc29sZS5sb2coTGxpYnJlc0ZhY3RvcnkuZWRpdCk7XG4gICAgICAgICRzY29wZS50aXRvbExsaWJyZUVkaXQgPSBMbGlicmVzRmFjdG9yeS5lZGl0LnRpdG9sO1xuICAgICAgICAkc2NvcGUuaXNibkxsaWJyZUVkaXQgPSBMbGlicmVzRmFjdG9yeS5lZGl0LmlzYm47XG4gICAgICAgIFxuICAgIFxuICAgIFxuICAgICRzY29wZS5hY3R1YWxpdHphciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKCgkc2NvcGUudGl0b2xMbGlicmVFZGl0KSAmJigkc2NvcGUuaXNibkxsaWJyZUVkaXQpKXtcblxuICAgICAgICBMbGlicmVzRmFjdG9yeS5zcnYudXBkYXRlKHtcIl9pZFwiOiBMbGlicmVzRmFjdG9yeS5lZGl0Ll9pZCwgXCJpc2JuXCI6ICRzY29wZS5pc2JuTGxpYnJlRWRpdCwgXCJ0aXRvbFwiOiAkc2NvcGUudGl0b2xMbGlicmVFZGl0fSwgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgTGxpYnJlc0ZhY3RvcnkgLmVkaXQuaXNibiA9ICRzY29wZS5pc2JuTGxpYnJlRWRpdDtcbiAgICAgICAgICAgIExsaWJyZXNGYWN0b3J5LmVkaXQudGl0b2wgPSAkc2NvcGUudGl0b2xMbGlicmVFZGl0O1xuICAgICAgICAgICAgJHNjb3BlLnRpdG9sTGxpYnJlRWRpdCA9IG51bGw7XG4gICAgICAgICAgICAkc2NvcGUuaXNibkxsaWJyZUVkaXQgPSBudWxsO1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cbiAgICBcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAtbGxpYnJlcycpXG4gICAgICAgIC5jb250cm9sbGVyKFwiTGxpYnJlc0NvbnRyb2xsZXJcIiwgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sICRpbnRlcnZhbCAsTGxpYnJlc0ZhY3RvcnksIEF1dG9yc0ZhY3RvcnksIENhbmFsU2VydmljZSl7XG4gXG5cbiAgICAkc2NvcGUubGxpYnJlcyA9IFtdO1xuICAgICRzY29wZS5hdXRvcnMgPSBbXTtcbiAgICAkc2NvcGUubW9zdHJhciA9IGZhbHNlO1xuICAgIFxuICAgICRzY29wZS4kb24oJ2FjdHVhbGl0emFyJywgZnVuY3Rpb24oKXtcbiAgICAgICAgJHNjb3BlLm1vc3RyYXIgPXRydWU7XG4gICAgICAgIHZhciBzdG9wO1xuICAgICAgICBzdG9wID0gJGludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkc2NvcGUubW9zdHJhciA9IGZhbHNlO1xuICAgICAgICB9LCA1MDAwKTtcbiAgICAgICAgIExsaWJyZXNGYWN0b3J5LnNydi5xdWVyeShmdW5jdGlvbihsbGlicmVzKXtcbiAgICAgICAgJHNjb3BlLmxsaWJyZXMgPSBsbGlicmVzO1xuICAgICAgICBcbiAgICB9KTtcbiAgICB9KTtcbiAgICBcbiAgICBBdXRvcnNGYWN0b3J5LnNydi5xdWVyeShmdW5jdGlvbihhdXRvcil7XG4gICAgICAgICRzY29wZS5hdXRvcnMgPSBhdXRvcjtcbiAgICB9KVxuICAgIFxuICAgIExsaWJyZXNGYWN0b3J5LnNydi5xdWVyeShmdW5jdGlvbihsbGlicmVzKXtcbiAgICAgICAgJHNjb3BlLmxsaWJyZXMgPSBsbGlicmVzO1xuICAgICAgICBcbiAgICB9KTtcblxuICAgICRzY29wZS5lZGl0YXIgPSBmdW5jdGlvbihsbGlicmUpe1xuICAgICAgICBMbGlicmVzRmFjdG9yeS5lZGl0ID0gbGxpYnJlO1xuICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9lZGl0YXJMbGlicmVcIik7XG4gICAgfVxuICAgICRzY29wZS5lc2JvcnJhciA9IGZ1bmN0aW9uKGxsaWJyZSl7XG4gICAgICAgIExsaWJyZXNGYWN0b3J5LnNydi5kZWxldGUoe1xuICAgICAgICAgICAgaWQ6IGxsaWJyZS5pc2JuXG4gICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgcG9zID0gJHNjb3BlLmxsaWJyZXMuaW5kZXhPZihsbGlicmUpO1xuICAgICAgICAgICAgJHNjb3BlLmxsaWJyZXMuc3BsaWNlKHBvcywgMSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgIFxufSk7IiwiYW5ndWxhci5tb2R1bGUoXCJhcHAtbGxpYnJlc1wiKVxuICAgIC5mYWN0b3J5KFwiTGxpYnJlc0ZhY3RvcnlcIiwgZnVuY3Rpb24oJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtzcnY6ICRyZXNvdXJjZShcIi9hcGkvbGxpYnJlcy86aWRcIiwgbnVsbCxcbiAgICB7XG4gICAgICAgICd1cGRhdGUnOiB7IG1ldGhvZDonUFVUJyB9XG4gICAgfSksXG4gICAgICAgICAgICBlZGl0OiBudWxsXG4gICAgICAgICAgIH1cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcC1sbGlicmVzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJsbGlzdGFBdXRvcnNcIiwgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIEF1dG9yc0ZhY3Rvcnkpe1xuICAgIFxuICAgICRzY29wZS5hdXRvcnMgPSBbXTtcbiAgICBcbiAgICBBdXRvcnNGYWN0b3J5LnNydi5xdWVyeShmdW5jdGlvbihhdXRvcnMpe1xuICAgICAgICRzY29wZS5hdXRvcnMgPSBhdXRvcnM7IFxuICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuYXV0b3JzKTtcbiAgICB9KTtcbiAgICBcbiAgICAkc2NvcGUuZWRpdGFyID0gZnVuY3Rpb24oYXV0b3Ipe1xuICAgICAgICBBdXRvcnNGYWN0b3J5LmVkaXQgPSBhdXRvcjtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvZWRpdGFyQXV0b3JcIik7XG4gICAgfVxuICAgICRzY29wZS5lc2JvcnJhciA9IGZ1bmN0aW9uKGF1dG9yKXtcbiAgICAgICAgQXV0b3JzRmFjdG9yeS5zcnYuZGVsZXRlKHtcbiAgICAgICAgICAgaWQ6IGF1dG9yLl9pZCBcbiAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBwb3MgPSAkc2NvcGUuYXV0b3JzLmluZGV4T2YoYXV0b3IpO1xuICAgICAgICAgICAgJHNjb3BlLmF1dG9ycy5zcGxpY2UocG9zLCAxKTtcbiAgICAgICAgfSlcbiAgICB9XG4gICAgXG4gICAgXG59KTsiLCJhbmd1bGFyLm1vZHVsZShcImFwcC1sbGlicmVzXCIpXG4gICAgLmZhY3RvcnkoXCJBdXRvcnNGYWN0b3J5XCIsIGZ1bmN0aW9uKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7c3J2OiAkcmVzb3VyY2UoXCIvYXBpL2F1dG9ycy86aWRcIiwgbnVsbCxcbiAgICB7XG4gICAgICAgICd1cGRhdGUnOiB7IG1ldGhvZDonUFVUJyB9XG4gICAgfSksXG4gICAgICAgICAgICBlZGl0OiBudWxsXG4gICAgICAgICAgIH1cbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAtbGxpYnJlcycpXG4gICAgLmNvbnRyb2xsZXIoJ2xvZ2luQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBVc2VyU3J2KXtcbiAgICBcbiAgICAkc2NvcGUuJHdhdGNoR3JvdXAoWyd1c2VybmFtZScsICdwYXNzd29yZCddLCBmdW5jdGlvbihuZXdWYWwsIG9sZFZhbCl7XG4gICAgICAgaWYobmV3VmFsICE9IG9sZFZhbCl7XG4gICAgICAgICAgICRzY29wZS5lcnJvcj0gbnVsbDtcbiAgICAgICB9IFxuICAgIH0pO1xuICAgIFxuICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCl7XG4gICAgICAgIGlmKCF1c2VybmFtZSB8fCAhcGFzc3dvcmQpe1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gXCJIYXMgZCdlbXBsZW5hciB0b3RzIGVscyBjYW1wc1wiO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIFVzZXJTcnYubG9naW4odXNlcm5hbWUsIHBhc3N3b3JkLCBmdW5jdGlvbihlcnJvciwgc3RhdHVzKXtcbiAgICAgICAgICAgICAgIGlmKHN0YXR1cyA9PSA0MDEpe1xuICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvciA9IGVycm9yLm1pc3NhdGdlO1xuICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgIFVzZXJTcnYuZ2V0VXNlcigpLnRoZW4oZnVuY3Rpb24odXNlcil7XG4gICAgICAgICAgICAgICAgICAgJHNjb3BlLiRlbWl0KCdsb2dpbicsIHVzZXIuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvXCIpO1xuICAgICAgICAgICAgICAgfSkgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAtbGxpYnJlcycpXG4gICAgICAgIC5jb250cm9sbGVyKFwibm91TGxpYnJlQ29udHJvbGxlclwiLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgTGxpYnJlc0ZhY3RvcnksIEF1dG9yc0ZhY3Rvcnkpe1xuICAgIFxuICAgIHZhciBzb2NrZXQgPSBpbygpLmNvbm5lY3QoKTtcbiAgICAkc2NvcGUuYXV0b3JzID0gW107XG4gICAgQXV0b3JzRmFjdG9yeS5zcnYucXVlcnkoZnVuY3Rpb24oYXV0b3Ipe1xuICAgICAgICRzY29wZS5hdXRvcnMgPSBhdXRvcjsgXG4gICAgfSk7XG5cbiAgICAgICAgICAgICRzY29wZS5hZmVnaXJMbGlicmUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5hdXRvclNlbGVjdGVkKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuYXV0b3JTZWxlY3RlZCk7XG4gICAgICAgICAgICBMbGlicmVzRmFjdG9yeS5zcnYuc2F2ZSh7XG4gICAgICAgICAgICAgICAgdGl0b2w6ICRzY29wZS50aXRvbExsaWJyZU5vdSxcbiAgICAgICAgICAgICAgICBpc2JuOiAkc2NvcGUuaXNibkxsaWJyZU5vdSxcbiAgICAgICAgICAgICAgICBhdXRvcnM6ICRzY29wZS5hdXRvclNlbGVjdGVkXG4gICAgICAgICAgICB9LGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICRzY29wZS50aXRvbExsaWJyZU5vdSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmlzYm5MbGlicmVOb3UgPSBcIlwiO1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL1wiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICB9XG59KTtcbiAgICAgICAgXG4gICAgICAgIFxuICIsImFuZ3VsYXIubW9kdWxlKCdhcHAtbGxpYnJlcycpXG4gICAgICAgIC5jb250cm9sbGVyKFwicmVnaXN0cmFyVXNlckNvbnRyb2xsZXJcIiwgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIFVzZXJTcnYpe1xuICAgICAgIFxuICAgICRzY29wZS5jcmVhclVzdWFyaSA9IGZ1bmN0aW9uKHVzdWFyaSwgcGFzc3dvcmQpe1xuICAgICAgICBcbiAgICAgICAgJHNjb3BlLiR3YXRjaEdyb3VwKFt1c3VhcmksIHBhc3N3b3JkXSwgZnVuY3Rpb24obmV3VmFsLG9sZFZhbCl7XG4gICAgICAgICAgICBpZihuZXdWYWwhPW9sZFZhbCl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmKCEkc2NvcGUudXN1YXJpIHx8ICEkc2NvcGUucGFzc3dvcmQpe1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gXCJIYXMgZCdlbXBsZW5hciB0b3RzIGVscyBjYW1wc1wiO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIFVzZXJTcnYucmVnaXN0cmUodXN1YXJpLCBwYXNzd29yZClcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbih1c2VyKXsgICBcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9sb2dpblwiKTtcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uKGVycm9yLCBzdGF0dXMpe1xuICAgICAgICAgICAgICAgIGlmKHN0YXR1cyA9PSA0MDkpXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jcmVhdCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvciA9IGVycm9yLm1pc3NhdGdlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG5cbn07XG59KTtcblxuIiwiYW5ndWxhci5tb2R1bGUoXCJhcHAtbGxpYnJlc1wiKVxuICAgIC5zZXJ2aWNlKCdVc2VyU3J2JywgZnVuY3Rpb24oJGh0dHApe1xuICAgIHZhciBzcnYgPSB0aGlzO1xuICAgIHNydi5hdXRoPSBmYWxzZTtcbiAgICBzcnYuZ2V0VXNlciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoXCIvYXBpL3VzZXJcIik7XG4gICAgfVxuICAgIHNydi5sb2dpbiA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCwgbm9Mb2dpbil7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdhcGkvc2Vzc2lvbicsIHtcbiAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cyl7XG4gICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsneC1hdXRoJ10gID0gZGF0YTtcbiAgICAgICAgICAgIGlmKGRhdGEpIHNydi5hdXRoID0gdHJ1ZTtcbiAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24oZXJyb3IsIHN0YXR1cyl7XG4gICAgICAgICAgIG5vTG9naW4oZXJyb3IsIHN0YXR1cyk7IFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHRoaXMucmVnaXN0cmUgPSBmdW5jdGlvbih1c2VybmFtZSwgcGFzc3dvcmQpe1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChcIi9hcGkvdXNlclwiLCB7XG4gICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICB0aGlzLmxvZ291dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHNydi5hdXRoID0gZmFsc2U7XG4gICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWyd4LWF1dGgnXSA9IFwiXCI7XG4gICAgfVxufSkiLCJhbmd1bGFyLm1vZHVsZShcImFwcC1sbGlicmVzXCIpXG4gICAgICAgIC5jb25maWcoZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKXtcbiAgICAgICAgICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgICAgICAgICAgICAgLndoZW4oXCIvXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjonTGxpYnJlc0NvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xsaWJyZXMuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGF1dG9yaXR6YXQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKFwiL2NyZWFyTGxpYnJlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ25vdUxsaWJyZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NyZWFyTGxpYnJlLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBhdXRvcml0emF0OiB0cnVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKFwiL3JlZ2lzdHJhclVzZXJcIiwge1xuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAncmVnaXN0cmFyVXNlckNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3JlZ2lzdHJhclVzZXIuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGF1dG9yaXR6YXQ6IGZhbHNlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLndoZW4oXCIvZWRpdGFyTGxpYnJlXCIsIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZWRpdGFyTGxpYnJlQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdlZGl0YXJMbGlicmUuaHRtbCcsXG4gICAgICAgICAgICAgICAgYXV0b3JpdHphdDogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKFwiL2xvZ2luXCIsIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnbG9naW5Db250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xvZ2luLmh0bWwnLFxuICAgICAgICAgICAgICAgIGF1dG9yaXR6YXQ6IGZhbHNlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLndoZW4oXCIvbGxpc3RhQXV0b3JzXCIsIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnbGxpc3RhQXV0b3JzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xsaXN0YUF1dG9ycy5odG1sJyxcbiAgICAgICAgICAgICAgICBhdXRvcml0emF0OiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKFwiL2VkaXRhckF1dG9yXCIsIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnZWRpdGFyQXV0b3JDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2VkaXRhckF1dG9yLmh0bWwnLFxuICAgICAgICAgICAgICAgIGF1dG9yaXR6YXQ6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbihcIi9jcmVhckF1dG9yXCIsIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnY3JlYXJBdXRvckNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY3JlYXJBdXRvci5odG1sJyxcbiAgICAgICAgICAgICAgICBhdXRvcml0emF0OiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDp0cnVlLFxuICAgICAgICAgICAgICAgIHJlcXVpcmVCYXNlOiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICBcbn0pLnJ1bihmdW5jdGlvbigkcm9vdFNjb3BlLFVzZXJTcnYpIHtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignJHJvdXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbihldmVudCwgbmV4dCkge1xuICAgICAgICAgICBpZiAobmV4dClcbiAgICAgICAgICAgICAgICBpZiAoIVVzZXJTcnYuYXV0aCAmIG5leHQuYXV0b3JpdHphdCkgXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuICAgIFxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9