var isClientDefined = false;
var io;
const connectSocket = (server) => {
    
    if(isClientDefined == true){
        return io;
    } else{
        io = require("socket.io")(server, { transports: ['websocket'], pingTimeout: 360000 });
        isClientDefined = true;
        return io;
    }
}

module.exports = { connectSocket }
