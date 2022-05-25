const Marcadores = require("./marcadores");


class Sockets {

    constructor( io ) {

        this.io = io;

        this.marcadores = new Marcadores();


        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', ( socket ) => {


            console.log("Cliente conectado");
            socket.emit('marcadores-activos', this.marcadores.activos);

            socket.on( 'marcador-nuevo', ( marcador ) => {  
                this.marcadores.agregarMarcador( marcador );
                console.log("Recibido nuevo marcador");
                socket.broadcast.emit( 'marcador-nuevo', marcador )
            });

            // Escuchar evento: mensaje-to-server
            socket.on('mensaje-to-server', ( data ) => {
                console.log( data );
                
                this.io.emit('mensaje-from-server', data );
            });
            
            socket.on('marcador-actualizado' , ( marcador ) =>{
                this.marcadores.actualizarMarcador( marcador );
                socket.broadcast.emit('marcador-actualizado', marcador);
            })
        
        });
    }


}


module.exports = Sockets;