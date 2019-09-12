// Comando para establecer la conexión

var socket = io();
var label = $('#lblNuevoTicket');

socket.on('connect', function() {
    console.log('Conectado al servidor');
});

// Escuchar con el "on"
socket.on('disconnect', function() {
    console.log('Se perdió la conexión con el servidor');
});

socket.on('estadoActual', function(data) {
    console.log(data);
    label.text(data.actual);
});

$('button').on('click', function() {
    socket.emit('siguienteTicket', null, function(siguienteTicket) {
        label.text(siguienteTicket);
    });
});