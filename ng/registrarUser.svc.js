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