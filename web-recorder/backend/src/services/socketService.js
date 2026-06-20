let io = null;

function initialize(socketServer) {

    io = socketServer;

    io.on("connection", socket => {

        console.log(
            "Client connected:",
            socket.id
        );

        socket.on(
            "disconnect",
            () => {

                console.log(
                    "Client disconnected:",
                    socket.id
                );

            }
        );

    });
}

function emitEvent(event) {

    if (io) {

        io.emit(
            "recorded-event",
            event
        );
    }
}

module.exports = {
    initialize,
    emitEvent
};