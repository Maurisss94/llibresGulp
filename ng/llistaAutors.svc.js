angular.module("app-llibres")
    .factory("AutorsFactory", function($resource) {
    return {srv: $resource("/api/autors/:id", null,
    {
        'update': { method:'PUT' }
    }),
            edit: null
           }
});