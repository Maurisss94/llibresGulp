angular.module("app-llibres")
    .factory("LlibresFactory", function($resource) {
    return {srv: $resource("/api/llibres/:id", null,
    {
        'update': { method:'PUT' }
    }),
            edit: null
           }
});
