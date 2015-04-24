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
        .controller("LlibresController", function($scope, $location ,LlibresFactory, AutorsFactory){
 

    $scope.llibres = [];
    $scope.autors = [];
    
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImFwcGxpY2F0aW9uLmN0cmwuanMiLCJjcmVhckF1dG9yLmN0cmwuanMiLCJlZGl0YUF1dG9yLmN0cmwuanMiLCJlZGl0YXJMbGlicmUuY3RybC5qcyIsImxsaWJyZXMuY3RybC5qcyIsImxsaWJyZXMuc3ZjLmpzIiwibGxpc3RhQXV0b3JzLmN0cmwuanMiLCJsbGlzdGFBdXRvcnMuc3ZjLmpzIiwibG9naW4uY3RybC5qcyIsIm5vdUxsaWJyZS5jdHJsLmpzIiwicmVnaXN0cmFyVXNlci5jdHJsLmpzIiwicmVnaXN0cmFyVXNlci5zdmMuanMiLCJyb3V0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoXCJhcHAtbGxpYnJlc1wiLCBbXCJuZ1Jlc291cmNlXCIsXCJuZ1JvdXRlXCJdKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwLWxsaWJyZXMnKVxuICAgIC5jb250cm9sbGVyKFwiQXBwbGljYXRpb25Db250cm9sbGVyXCIsIGZ1bmN0aW9uKCRzY29wZSwkbG9jYXRpb24sVXNlclNydikge1xuICAgICAgICAkc2NvcGUuJG9uKCdsb2dpbicsIGZ1bmN0aW9uKGUsdXNlcikge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICBRdWFuIHMnaGEgZmV0IGxvZ2luIHMnZW1ldCBsJ2V2ZW50IFwibG9naW5cIlxuICAgICAgICAgICAgICAgIGkgYWl4w7IgZmEgcXVlIGxhIHZhcmlhYmxlIGRlIGwnc2NvcGUgXCJjdXJyZW50VXNlclwiXG4gICAgICAgICAgICAgICAgbGkgZGllbSBxdWluIHVzdWFyaSBzJ2hhIGF1dGVudGljYW50LCBkJ2FxdWVzdGEgbWFuZXJhXG4gICAgICAgICAgICAgICAgZmVtIHF1ZSBhcGFyZWd1aW4gZGlmZXJlbnRzIG9wY2lvbnMgYWwgbWVuw7pcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xuICAgICAgICB9KTtcbiAgICAgICAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIFF1YW4gZmVtIGxvZ291dCBlc2JvcnJlbSBlbCB0b2tlbiBpIGxhIHZhcmlhYmxlXG4gICAgICAgICAgICAgICAgZGUgbCckc2NvcGUgXCJjdXJyZW50VXNlclwiLCBkJ2FxdWVzdGEgZm9ybWEgZGVzYXBhcmVpeGVuXG4gICAgICAgICAgICAgICAgZWxzIG1lbsO6cyBzZW5zaWJsZXMgYSBsYSBhdXRlbnRpY2FjacOzXG4gICAgICAgICAgICAqL1xuICAgICAgICAgICAgVXNlclNydi5sb2dvdXQoKTtcbiAgICAgICAgICAgIGRlbGV0ZSAkc2NvcGUuY3VycmVudFVzZXI7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICAgICB9O1xuICAgIH0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAtbGxpYnJlcycpXG4gICAgICAgIC5jb250cm9sbGVyKCdjcmVhckF1dG9yQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBBdXRvcnNGYWN0b3J5KXtcbiAgICBcbiAgICAkc2NvcGUuYWZlZ2lyQXV0b3IgPSBmdW5jdGlvbigpe1xuICAgICAgICBBdXRvcnNGYWN0b3J5LnNydi5zYXZlKHtcbiAgICAgICAgICAgbm9tOiAkc2NvcGUubm9tQXV0b3JOb3UsXG4gICAgICAgICAgICBjb2dub206ICRzY29wZS5jb2dub21BdXRvck5vdSxcbiAgICAgICAgICAgIGRlc2NyaXBjaW86ICRzY29wZS5kZXNjcmlwY2lvQXV0b3JOb3VcbiAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL2xsaXN0YUF1dG9yc1wiKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxufSkiLCJhbmd1bGFyLm1vZHVsZSgnYXBwLWxsaWJyZXMnKVxuICAgICAgICAuY29udHJvbGxlcignZWRpdGFyQXV0b3JDb250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIEF1dG9yc0ZhY3Rvcnkpe1xuICAgIFxuICAgICRzY29wZS5ub21BdXRvckVkaXQgPSBBdXRvcnNGYWN0b3J5LmVkaXQubm9tO1xuICAgICRzY29wZS5jb2dub21BdXRvckVkaXQgPSBBdXRvcnNGYWN0b3J5LmVkaXQuY29nbm9tO1xuICAgICRzY29wZS5kZXNjcmlwY2lvQXV0b3JFZGl0ID0gQXV0b3JzRmFjdG9yeS5lZGl0LmRlc2NyaXBjaW87XG4gICAgXG4gICAgJHNjb3BlLmFjdHVhbGl0emFyID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIGlmKCgkc2NvcGUubm9tQXV0b3JFZGl0KSYmKCRzY29wZS5jb2dub21BdXRvckVkaXQpJiYoJHNjb3BlLmRlc2NyaXBjaW9BdXRvckVkaXQpKXtcbiAgICAgICAgICAgIEF1dG9yc0ZhY3Rvcnkuc3J2LnVwZGF0ZSh7XCJfaWRcIjogQXV0b3JzRmFjdG9yeS5lZGl0Ll9pZCwgXCJub21cIjogJHNjb3BlLm5vbUF1dG9yRWRpdCwgXCJjb2dub21cIjogJHNjb3BlLmNvZ25vbUF1dG9yRWRpdCwgXCJkZXNjcmlwY2lvXCI6ICRzY29wZS5kZXNjcmlwY2lvQXV0b3JFZGl0fSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIEF1dG9yc0ZhY3RvcnkuZWRpdC5ub20gPSAkc2NvcGUubm9tQXV0b3JFZGl0O1xuICAgICAgICAgICAgICAgIEF1dG9yc0ZhY3RvcnkuZWRpdC5jb2dub20gPSAkc2NvcGUuY29nbm9tQXV0b3JFZGl0O1xuICAgICAgICAgICAgICAgIEF1dG9yc0ZhY3RvcnkuZWRpdC5kZXNjcmlwY2lvID0gJHNjb3BlLmRlc2NyaXBjaW9BdXRvckVkaXQ7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm5vbUF1dG9yRWRpdCA9IG51bGw7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmNvZ25vbUF1dG9yRWRpdCA9IG51bGw7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmRlc2NyaXBjaW9BdXRvckVkaXQgPSBudWxsO1xuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKFwiL2xsaXN0YUF1dG9yc1wiKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxufSkiLCJhbmd1bGFyLm1vZHVsZSgnYXBwLWxsaWJyZXMnKVxuICAgICAgICAuY29udHJvbGxlcihcImVkaXRhckxsaWJyZUNvbnRyb2xsZXJcIiwgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIExsaWJyZXNGYWN0b3J5KXtcblxuICAgICAgICBjb25zb2xlLmxvZyhMbGlicmVzRmFjdG9yeS5lZGl0KTtcbiAgICAgICAgJHNjb3BlLnRpdG9sTGxpYnJlRWRpdCA9IExsaWJyZXNGYWN0b3J5LmVkaXQudGl0b2w7XG4gICAgICAgICRzY29wZS5pc2JuTGxpYnJlRWRpdCA9IExsaWJyZXNGYWN0b3J5LmVkaXQuaXNibjtcbiAgICAgICAgXG4gICAgXG4gICAgXG4gICAgJHNjb3BlLmFjdHVhbGl0emFyID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoKCRzY29wZS50aXRvbExsaWJyZUVkaXQpICYmKCRzY29wZS5pc2JuTGxpYnJlRWRpdCkpe1xuXG4gICAgICAgIExsaWJyZXNGYWN0b3J5LnNydi51cGRhdGUoe1wiX2lkXCI6IExsaWJyZXNGYWN0b3J5LmVkaXQuX2lkLCBcImlzYm5cIjogJHNjb3BlLmlzYm5MbGlicmVFZGl0LCBcInRpdG9sXCI6ICRzY29wZS50aXRvbExsaWJyZUVkaXR9LCBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICBMbGlicmVzRmFjdG9yeSAuZWRpdC5pc2JuID0gJHNjb3BlLmlzYm5MbGlicmVFZGl0O1xuICAgICAgICAgICAgTGxpYnJlc0ZhY3RvcnkuZWRpdC50aXRvbCA9ICRzY29wZS50aXRvbExsaWJyZUVkaXQ7XG4gICAgICAgICAgICAkc2NvcGUudGl0b2xMbGlicmVFZGl0ID0gbnVsbDtcbiAgICAgICAgICAgICRzY29wZS5pc2JuTGxpYnJlRWRpdCA9IG51bGw7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxuICAgIFxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcC1sbGlicmVzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJMbGlicmVzQ29udHJvbGxlclwiLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiAsTGxpYnJlc0ZhY3RvcnksIEF1dG9yc0ZhY3Rvcnkpe1xuIFxuXG4gICAgJHNjb3BlLmxsaWJyZXMgPSBbXTtcbiAgICAkc2NvcGUuYXV0b3JzID0gW107XG4gICAgXG4gICAgQXV0b3JzRmFjdG9yeS5zcnYucXVlcnkoZnVuY3Rpb24oYXV0b3Ipe1xuICAgICAgICAkc2NvcGUuYXV0b3JzID0gYXV0b3I7XG4gICAgfSlcbiAgICBcbiAgICBMbGlicmVzRmFjdG9yeS5zcnYucXVlcnkoZnVuY3Rpb24obGxpYnJlcyl7XG4gICAgICAgICRzY29wZS5sbGlicmVzID0gbGxpYnJlcztcbiAgICAgICAgXG4gICAgfSk7XG5cbiAgICAkc2NvcGUuZWRpdGFyID0gZnVuY3Rpb24obGxpYnJlKXtcbiAgICAgICAgTGxpYnJlc0ZhY3RvcnkuZWRpdCA9IGxsaWJyZTtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvZWRpdGFyTGxpYnJlXCIpO1xuICAgIH1cbiAgICAkc2NvcGUuZXNib3JyYXIgPSBmdW5jdGlvbihsbGlicmUpe1xuICAgICAgICBMbGlicmVzRmFjdG9yeS5zcnYuZGVsZXRlKHtcbiAgICAgICAgICAgIGlkOiBsbGlicmUuaXNiblxuICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHBvcyA9ICRzY29wZS5sbGlicmVzLmluZGV4T2YobGxpYnJlKTtcbiAgICAgICAgICAgICRzY29wZS5sbGlicmVzLnNwbGljZShwb3MsIDEpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICBcbn0pOyIsImFuZ3VsYXIubW9kdWxlKFwiYXBwLWxsaWJyZXNcIilcbiAgICAuZmFjdG9yeShcIkxsaWJyZXNGYWN0b3J5XCIsIGZ1bmN0aW9uKCRyZXNvdXJjZSkge1xuICAgIHJldHVybiB7c3J2OiAkcmVzb3VyY2UoXCIvYXBpL2xsaWJyZXMvOmlkXCIsIG51bGwsXG4gICAge1xuICAgICAgICAndXBkYXRlJzogeyBtZXRob2Q6J1BVVCcgfVxuICAgIH0pLFxuICAgICAgICAgICAgZWRpdDogbnVsbFxuICAgICAgICAgICB9XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwLWxsaWJyZXMnKVxuICAgICAgICAuY29udHJvbGxlcihcImxsaXN0YUF1dG9yc1wiLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgQXV0b3JzRmFjdG9yeSl7XG4gICAgXG4gICAgJHNjb3BlLmF1dG9ycyA9IFtdO1xuICAgIFxuICAgIEF1dG9yc0ZhY3Rvcnkuc3J2LnF1ZXJ5KGZ1bmN0aW9uKGF1dG9ycyl7XG4gICAgICAgJHNjb3BlLmF1dG9ycyA9IGF1dG9yczsgXG4gICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5hdXRvcnMpO1xuICAgIH0pO1xuICAgIFxuICAgICRzY29wZS5lZGl0YXIgPSBmdW5jdGlvbihhdXRvcil7XG4gICAgICAgIEF1dG9yc0ZhY3RvcnkuZWRpdCA9IGF1dG9yO1xuICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9lZGl0YXJBdXRvclwiKTtcbiAgICB9XG4gICAgJHNjb3BlLmVzYm9ycmFyID0gZnVuY3Rpb24oYXV0b3Ipe1xuICAgICAgICBBdXRvcnNGYWN0b3J5LnNydi5kZWxldGUoe1xuICAgICAgICAgICBpZDogYXV0b3IuX2lkIFxuICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIHBvcyA9ICRzY29wZS5hdXRvcnMuaW5kZXhPZihhdXRvcik7XG4gICAgICAgICAgICAkc2NvcGUuYXV0b3JzLnNwbGljZShwb3MsIDEpO1xuICAgICAgICB9KVxuICAgIH1cbiAgICBcbiAgICBcbn0pOyIsImFuZ3VsYXIubW9kdWxlKFwiYXBwLWxsaWJyZXNcIilcbiAgICAuZmFjdG9yeShcIkF1dG9yc0ZhY3RvcnlcIiwgZnVuY3Rpb24oJHJlc291cmNlKSB7XG4gICAgcmV0dXJuIHtzcnY6ICRyZXNvdXJjZShcIi9hcGkvYXV0b3JzLzppZFwiLCBudWxsLFxuICAgIHtcbiAgICAgICAgJ3VwZGF0ZSc6IHsgbWV0aG9kOidQVVQnIH1cbiAgICB9KSxcbiAgICAgICAgICAgIGVkaXQ6IG51bGxcbiAgICAgICAgICAgfVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcC1sbGlicmVzJylcbiAgICAuY29udHJvbGxlcignbG9naW5Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIFVzZXJTcnYpe1xuICAgIFxuICAgICRzY29wZS4kd2F0Y2hHcm91cChbJ3VzZXJuYW1lJywgJ3Bhc3N3b3JkJ10sIGZ1bmN0aW9uKG5ld1ZhbCwgb2xkVmFsKXtcbiAgICAgICBpZihuZXdWYWwgIT0gb2xkVmFsKXtcbiAgICAgICAgICAgJHNjb3BlLmVycm9yPSBudWxsO1xuICAgICAgIH0gXG4gICAgfSk7XG4gICAgXG4gICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24odXNlcm5hbWUsIHBhc3N3b3JkKXtcbiAgICAgICAgaWYoIXVzZXJuYW1lIHx8ICFwYXNzd29yZCl7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBcIkhhcyBkJ2VtcGxlbmFyIHRvdHMgZWxzIGNhbXBzXCI7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgVXNlclNydi5sb2dpbih1c2VybmFtZSwgcGFzc3dvcmQsIGZ1bmN0aW9uKGVycm9yLCBzdGF0dXMpe1xuICAgICAgICAgICAgICAgaWYoc3RhdHVzID09IDQwMSl7XG4gICAgICAgICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gZXJyb3IubWlzc2F0Z2U7XG4gICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgVXNlclNydi5nZXRVc2VyKCkudGhlbihmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGVtaXQoJ2xvZ2luJywgdXNlci5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgICAgICAgICB9KSBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcC1sbGlicmVzJylcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJub3VMbGlicmVDb250cm9sbGVyXCIsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBMbGlicmVzRmFjdG9yeSwgQXV0b3JzRmFjdG9yeSl7XG4gICAgXG4gICAgJHNjb3BlLmF1dG9ycyA9IFtdO1xuICAgIEF1dG9yc0ZhY3Rvcnkuc3J2LnF1ZXJ5KGZ1bmN0aW9uKGF1dG9yKXtcbiAgICAgICAkc2NvcGUuYXV0b3JzID0gYXV0b3I7IFxuICAgIH0pO1xuXG4gICAgICAgICAgICAkc2NvcGUuYWZlZ2lyTGxpYnJlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuYXV0b3JTZWxlY3RlZCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmF1dG9yU2VsZWN0ZWQpO1xuICAgICAgICAgICAgTGxpYnJlc0ZhY3Rvcnkuc3J2LnNhdmUoe1xuICAgICAgICAgICAgICAgIHRpdG9sOiAkc2NvcGUudGl0b2xMbGlicmVOb3UsXG4gICAgICAgICAgICAgICAgaXNibjogJHNjb3BlLmlzYm5MbGlicmVOb3UsXG4gICAgICAgICAgICAgICAgYXV0b3JzOiAkc2NvcGUuYXV0b3JTZWxlY3RlZFxuICAgICAgICAgICAgfSxmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUudGl0b2xMbGlicmVOb3UgPSBcIlwiO1xuICAgICAgICAgICAgICAgICRzY29wZS5pc2JuTGxpYnJlTm91ID0gXCJcIjtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChcIi9cIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgfVxufSk7XG4gICAgICAgIFxuICAgICAgICBcbiAiLCJhbmd1bGFyLm1vZHVsZSgnYXBwLWxsaWJyZXMnKVxuICAgICAgICAuY29udHJvbGxlcihcInJlZ2lzdHJhclVzZXJDb250cm9sbGVyXCIsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBVc2VyU3J2KXtcbiAgICAgICBcbiAgICAkc2NvcGUuY3JlYXJVc3VhcmkgPSBmdW5jdGlvbih1c3VhcmksIHBhc3N3b3JkKXtcbiAgICAgICAgXG4gICAgICAgICRzY29wZS4kd2F0Y2hHcm91cChbdXN1YXJpLCBwYXNzd29yZF0sIGZ1bmN0aW9uKG5ld1ZhbCxvbGRWYWwpe1xuICAgICAgICAgICAgaWYobmV3VmFsIT1vbGRWYWwpe1xuICAgICAgICAgICAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZighJHNjb3BlLnVzdWFyaSB8fCAhJHNjb3BlLnBhc3N3b3JkKXtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IFwiSGFzIGQnZW1wbGVuYXIgdG90cyBlbHMgY2FtcHNcIjtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBVc2VyU3J2LnJlZ2lzdHJlKHVzdWFyaSwgcGFzc3dvcmQpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcil7ICAgXG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvbG9naW5cIik7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihlcnJvciwgc3RhdHVzKXtcbiAgICAgICAgICAgICAgICBpZihzdGF0dXMgPT0gNDA5KVxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY3JlYXQgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBlcnJvci5taXNzYXRnZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuXG59O1xufSk7XG5cbiIsImFuZ3VsYXIubW9kdWxlKFwiYXBwLWxsaWJyZXNcIilcbiAgICAuc2VydmljZSgnVXNlclNydicsIGZ1bmN0aW9uKCRodHRwKXtcbiAgICB2YXIgc3J2ID0gdGhpcztcbiAgICBzcnYuYXV0aD0gZmFsc2U7XG4gICAgc3J2LmdldFVzZXIgPSBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KFwiL2FwaS91c2VyXCIpO1xuICAgIH1cbiAgICBzcnYubG9naW4gPSBmdW5jdGlvbih1c2VybmFtZSwgcGFzc3dvcmQsIG5vTG9naW4pe1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnYXBpL3Nlc3Npb24nLCB7XG4gICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMpe1xuICAgICAgICAgICAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ3gtYXV0aCddICA9IGRhdGE7XG4gICAgICAgICAgICBpZihkYXRhKSBzcnYuYXV0aCA9IHRydWU7XG4gICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uKGVycm9yLCBzdGF0dXMpe1xuICAgICAgICAgICBub0xvZ2luKGVycm9yLCBzdGF0dXMpOyBcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICB0aGlzLnJlZ2lzdHJlID0gZnVuY3Rpb24odXNlcm5hbWUsIHBhc3N3b3JkKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoXCIvYXBpL3VzZXJcIiwge1xuICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgdGhpcy5sb2dvdXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBzcnYuYXV0aCA9IGZhbHNlO1xuICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsneC1hdXRoJ10gPSBcIlwiO1xuICAgIH1cbn0pIiwiYW5ndWxhci5tb2R1bGUoXCJhcHAtbGxpYnJlc1wiKVxuICAgICAgICAuY29uZmlnKGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcil7XG4gICAgICAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgICAgICAgIC53aGVuKFwiL1wiLCB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6J0xsaWJyZXNDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdsbGlicmVzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBhdXRvcml0emF0OiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbihcIi9jcmVhckxsaWJyZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdub3VMbGlicmVDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjcmVhckxsaWJyZS5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgYXV0b3JpdHphdDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbihcIi9yZWdpc3RyYXJVc2VyXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3JlZ2lzdHJhclVzZXJDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdyZWdpc3RyYXJVc2VyLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBhdXRvcml0emF0OiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKFwiL2VkaXRhckxsaWJyZVwiLCB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2VkaXRhckxsaWJyZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZWRpdGFyTGxpYnJlLmh0bWwnLFxuICAgICAgICAgICAgICAgIGF1dG9yaXR6YXQ6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbihcIi9sb2dpblwiLCB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdsb2dpbi5odG1sJyxcbiAgICAgICAgICAgICAgICBhdXRvcml0emF0OiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKFwiL2xsaXN0YUF1dG9yc1wiLCB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2xsaXN0YUF1dG9ycycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdsbGlzdGFBdXRvcnMuaHRtbCcsXG4gICAgICAgICAgICAgICAgYXV0b3JpdHphdDogZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbihcIi9lZGl0YXJBdXRvclwiLCB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2VkaXRhckF1dG9yQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdlZGl0YXJBdXRvci5odG1sJyxcbiAgICAgICAgICAgICAgICBhdXRvcml0emF0OiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLndoZW4oXCIvY3JlYXJBdXRvclwiLCB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2NyZWFyQXV0b3JDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NyZWFyQXV0b3IuaHRtbCcsXG4gICAgICAgICAgICAgICAgYXV0b3JpdHphdDogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoe1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6dHJ1ZSxcbiAgICAgICAgICAgICAgICByZXF1aXJlQmFzZTogZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgXG59KS5ydW4oZnVuY3Rpb24oJHJvb3RTY29wZSxVc2VyU3J2KSB7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyRyb3V0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24oZXZlbnQsIG5leHQpIHtcbiAgICAgICAgICAgaWYgKG5leHQpXG4gICAgICAgICAgICAgICAgaWYgKCFVc2VyU3J2LmF1dGggJiBuZXh0LmF1dG9yaXR6YXQpIFxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcbiAgICBcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==