const { Server, Socket } =require( "socket.io");

let connections = {}
let messages = {}
let timeOnline = {}


const connectToSocket= (server)=>{
    const io = new Server(server,{
        cors:{
            origin:["https://video-conferencing-app-1-vljk.onrender.com" , "http://localhost:5173"],
            methods:["GET","POST"],
            credentials:true
        }
    });

    io.on("connection",(socket)=>{
        socket.on("join-call",(path)=>{

            if(connections[path] === undefined){
                connections[path]=[];
            }
            connections[path].push(socket.id)

            timeOnline[socket.id] = new Date();

            for(let a=0;a<connections[path].length;a++){
                io.to(connections[path][a]).emit("user-joined",socket.id,connections[path]);
            }

            if(messages[path] !== undefined){
                for(let a=0;a<messages[path].length;a++){
                    io.to(socket.id).emit("chat-message",
                        messages[path][a]['data'],
                        messages[path][a]['sender'],
                        messages[path][a]['socket-id-sender']
                    )
                }
            }
        })

        socket.on("signal",(toId,message)=>{
            io.to(toId).emit("signal",socket.id,message)
        });

        socket.on("chat-message",(data,sender)=>{
            const [matchingRoom,found] = Object.entries(connections)
            .reduce(([room,isFound],[roomKey,roomVal])=>{
                if(!isFound && roomVal.includes(socket.id)){
                    return [roomKey,true];
                }
                return [room,isFound];
            },['',false]);

            if(found === true){
                if(messages[matchingRoom] === undefined){
                    messages[matchingRoom] = [];
                }
                messages[matchingRoom].push({'sender':sender,'data' : data, 'socket-id-sender' : socket.id});

                connections[matchingRoom].forEach((socketId) => {
                

                    io.to(socketId).emit(
                        "chat-message",
                        data,
                        sender,
                        socket.id
                    );
                });
            }
        })

        socket.on("disconnect",()=>{
            const diffTime = Math.abs(timeOnline[socket.id]-new Date());

            var key;

            for(let [k,v] of JSON.parse(JSON.stringify(Object.entries(connections)))){

                for(let a =0;a<v.length;a++){
                    if(v[a] === socket.id){
                        key = k;

                        for(let a =0; a<connections[key].length;a++){

                            io.to(connections[key][a]).emit("user-left",socket.id);
                        }
                        
                        var index = connections[key].indexOf(socket.id);

                        connections[key].splice(index,1);

                        if(connections[key].length === 0 ){
                            delete connections[key];
                        }
                    }
                }
            }

        });

        //Simpler Methode to solve disconnect function
            
            // socket.on("disconnect", () => {

            //     const roomId = socket.roomId;

            //     if (!roomId) return;

            //     connections[roomId] = connections[roomId]
            //         .filter(id => id !== socket.id);

            //     io.to(roomId).emit("user-left", socket.id);

            //     if (connections[roomId].length === 0) {
            //         delete connections[roomId];
            //     }

            // });
    })

    return io;
}

module.exports = connectToSocket;