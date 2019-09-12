const fs = require('fs');

class Ticket {

    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {

    constructor() {
        this.ultimo = 0; // El último ticket que se dió (cuando cambia el día, se reinicia esta variable)
        this.hoy = new Date().getDate();
        this.tickets = []; // Este array tiene todos los tickes pendientes de revisión
        this.ultimos4 = []; // Parte de la pantalla que los usuarios están viendo públicamente

        let data = require('../data/data.json');

        // console.log(data);

        if (data.hoy === this.hoy) { // Mismo día de trabajo, no hay que reiniciar
            this.ultimo = data.ultimo;
            this.tickets = data.tickets;
            this.ultimos4 = data.ultimos4;
        } else {
            this.reiniciarConteo();  // Si se reinició el servidor, o cambió de día de trabajo
        }
    }

    siguiente() {
        this.ultimo += 1;
        let ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);
        this.grabarArchivo();
        return `Ticket ${this.ultimo}`;
    }

    getUltimoTicket() {
        return `Ticket ${this.ultimo}`;
    }

    getUltimos4() {
        return this.ultimos4;
    }


    atenderTicket(escritorio){
        if (this.tickets.length === 0){
            return `No hay tickets`;
        }

        let numeroTicket = this.tickets[0].numero;

        this.tickets.shift(); // Elimina el primer ticket del array (porque lo está atendiendo)

        let atenderTicket = new Ticket(numeroTicket, escritorio);
        this.ultimos4.unshift(atenderTicket); // Agrega el nuevo ticket al inicio del array

        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1,1); // Borra el último ticket del array
        }

        console.log('Ultimos 4: ');
        console.log(this.ultimos4);

        this.grabarArchivo();
        return atenderTicket;
    }

    reiniciarConteo() {
        this.ultimo = 0;
        this.tickets = [];
        this.ultimos4 = [];
        console.log('Se ha inicializado el sistema');
        this.grabarArchivo();
    }

    grabarArchivo() {
        let jsonData = {
            ultimo : this.ultimo,
            hoy : this.hoy,
            tickets : this.tickets,
            ultimos4 : this.ultimos4
        }

        let jsonDataString = JSON.stringify(jsonData);

        fs.writeFileSync('./server/data/data.json', jsonDataString);
    }

}

module.exports = {
    TicketControl
}