import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { CryptoTable } from '../api/v1/services/CryptoTable';

let isClientDefined = false;
let io:SocketIOServer;
const connectSocket = (server: http.Server) => {
    
    if(isClientDefined == true){
        return io;
    } else{
        io = new SocketIOServer(server, { transports: ['websocket'], pingTimeout: 360000 });
        isClientDefined = true;
        return io;
    }
}

const socketInit = (socket:any) => {
    socket.on("setup", (userData:any) => {
        socket.join(userData._id);
        socket.emit("connected");  
    })

    socket.on("join room", (room:string) => {
        socket.join(room)
        //console.log("Joined room " + room);
    });
    
    socket.on("get crypto data", async () => {
        
        let allEvents = await CryptoTable.getAllCryptoData();

        socket.emit("get crypto data", allEvents.sort((a, b) => a.nM?.localeCompare(b?.nM)));
    })
}

export { connectSocket, socketInit }
