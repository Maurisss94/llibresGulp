module.exports = function(http) {
    
    var io = require('socket.io')(http);
    io.on('connect', function(socket) {
    });
    
    return {
        editar: function(llibre) {
            return io.emit('editar',llibre);
        },
        esborrar: function(llibre) {
            return io.emit('esborrar',llibre);
        },
        crear: function(llibre) {
            return io.emit('crear',llibre);
        }
        
    }
    
}