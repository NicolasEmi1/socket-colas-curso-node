const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');

const ticketControl = new TicketControl();


io.on('connection', (client) => {

    // Escuchar el cliente
    client.on('siguienteTicket', (data, callback) => {
        let siguiente = ticketControl.siguiente();
        console.log(siguiente);
        callback(siguiente);
    });

    // Emitir evento 'estadoActual' (debe retornar un ticket)
    client.emit('estadoActual', { 
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUltimos4()
    });


    client.on('atenderTicket', (data, callback) => {

        if (!data.escritorio) {
            return callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            });
        }

        let atenderTicket = ticketControl.atenderTicket(data.escritorio);

        client.broadcast.emit('ultimos4', {
            ultimos4: ticketControl.getUltimos4()
        });

        callback(atenderTicket);

        // Notificar cambios en los últimos 4 tickets

    });

});