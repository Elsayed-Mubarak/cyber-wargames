let SOC = require("socket.io");
const { createClient } = require("redis");
const redisAdapter = require('@socket.io/redis-adapter');
let io;

const redisClient = createClient({
    host: "127.0.0.1",
    port: 6379,
    retry_strategy: function (options) {
        if (options.error && options.error.code === "ECONNREFUSED") {
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            return new Error("The server refused the connection");
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error("Retry time exhausted");
        }
        if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
    }
});

start = function (server) {

    io = SOC(server, {
        path: "/wargames/",
        cors: {
            origin: ["http://192.168.1.55:4200", "http://localhost:4200"],
            methods: ["GET", "POST"],
        },
        serveClient: false,
        allowedHeaders: ["authorization"],
        transports: ['websocket'],
        credentials: true,
    });
    io.adapter(redisAdapter(redisClient, redisClient.duplicate()));

    io.on("connection", async (socket) => {
        // console.log("####-#### some one connected ####-#### ", socket.id);
        socket.once('joinRequest', function (room) {
            // console.log("subscribe to Room :", room);


            // console.log(io.sockets.adapter.rooms.has(room), 'AAAA')
            // console.log(io.sockets.adapter.rooms.get(room));
            console.log("join to Room :", room);
        });



        socket.once('leaveRoom', function (roomID) {
            socket.leave(roomID._id);
        })

        socket.on("disconnect", (reason) => {
            // for (room in socket.nsp.adapter.rooms) {
            //   console.log(room, "Room");
            // }
            socket.leave(socket.id);
            // console.log(socket.nsp.adapter.rooms);
            // io.disconnectSockets();
            // console.log("User disconnect", reason);
        });

        socket.on("connect_error", (err) => {
            console.log(err.message);
        });
    });
};


updateDashboard = function (studentScore, studentID, solution, scoreUpdateAt) {
    console.log(io.sockets.adapter.rooms)
    io.emit("update_dashboard", { update: true, studentScore, studentID, solution, scoreUpdateAt });
};


module.exports = {
    socketStart: start,
    updateDashboard
};
