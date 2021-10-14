const mongoose = require("mongoose");
const http = require("http");
const fs = require("fs")
mongoose.Promise = global.Promise;
require("dotenv").config({ path: "./env/config.env" }); //for config files;
const Config = require("./config");
const socket = require("./socket");
const Logger = require("./utils/logger.js");


// The port used by the Node.js debugger when enabled.
process.debugPort = process.env.DebugPort || 5858;

process.on("uncaughtException", (err, origin) => {
  // fs.writeSync(
  //   process.stderr.fd,
  //   `Caught exception: ${err}\n` + `Exception origin: ${origin} \n`
  // );
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// dotenv.config({ path: './config.env' });
const app = require("./app.js");
const debug = require("debug")("war-games:server");


console.log("Connected ---- connect to cloud DB");
mongoose.connect(Config.dbURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

Logger.dbConnection(mongoose);

/**
 * Get port from environment and store in Express.
 */
const PORT = normalizePort(process.env.PORT || "5000");

// set port
app.set("port", PORT);

const server = http.createServer(app).listen(PORT, () => {
  console.log(
    ` ################## War-games App \n ##################  Current Environment ${Config.currentEnv} `
      .blue.bold
  );
});

// const server = app.listen(PORT, () => {
//   console.log(
//     ` ################## War-games App \n ##################  ${process.env.NODE_ENV || Config.currentEnv} `
//       .blue.bold
//   );
// });

server.on("error", onError);
server.on("listening", onListening);

socket.socketStart(server);

// socket.socketStart(server);

// process.on("unhandledRejection", async (err) => {
//   console.log("UNHANDLED REJECTION! 💥 Shutting down...");
//   console.log(err.name, err.message);
//   if (mongoose.connection.readyState !== 0) {
//     mongoose.connection.close(() => {
//       console.log(
//         "✗ Mongoose default connection disconnected through app termination"
//       );
//       process.exit(1);
//     });
//     server.close(() => {
//       console.log("💥Process terminated!");
//     });
//   } else {
//     server.close(() => {
//       console.log("💥Process terminated!");
//     });
//     process.exit(1);
//   }
// });

// Graceful shutdown means when all your requests to the server is respond and not any data processing work left.
// The SIGTERM signal is a generic signal used to cause program termination. Unlike SIGKILL, this signal can be blocked, handled, and ignored. It is the normal way to politely ask a program to terminate
process.on("SIGTERM", gracefulShutdown);

// 'SIGINT' generated with <Ctrl>+C in the terminal.
process.on("SIGINT", gracefulShutdown);

process.on("exit", (code) => {
  console.log("Process exit event with code: ", code);
});

process.on("warning", (warning) => {
  console.warn(warning.name); // Print the warning name
  console.warn(warning.message); // Print the warning message
  console.warn(warning.stack); // Print the stack trace
});

// return node version and modules used number and some other data
// console.log(process.versions);

// The process.uptime() method returns the number of seconds the current Node.js process has been running
console.log(
  `The time needed to running process ${Math.floor(process.uptime())}`
);

// Returns an object describing the memory usage of the Node.js process measured in bytes
// console.log(process.memoryUsage());

console.log(`This platform is ${process.platform}`);

console.log(`The parent process is pid ${process.ppid}`);

// (set before api and the log in the end of the api to check cpu usage)
// const startUsage = process.cpuUsage();
// --method returns the user and system CPU time usage of the current process, in an object with properties user and system, whose values are microsecond values (millionth of a second)
// console.log(process.cuUsage(startUsage));

// property returns an array containing the command-line arguments passed when the Node.js process was launched.
// process.argv.forEach((val, index) => {
//   console.log(`${index}: ${val}`);
// });

console.log(`This processor architecture is ${process.arch}`);

/**
 * Normalize a port into a number, string, or false.
 */

function gracefulShutdown() {
  // Handle process kill signal
  // Stop new requests from client
  // Close all data process
  // Exit from process

  // Handle process kill signal
  console.info("👋 SIGTERM RECEIVED. Shutting down gracefully");
  console.log("Closing http server.");

  // Stop new requests from client
  server.close(() => {
    console.log("Http server closed.");
    // boolean means [force], see in mongoose doc
    // Close all data process
    mongoose.connection.close(false, () => {
      console.log("MongoDb connection closed.");
      // Exit from process
      process.exit(0);
    });
  });
}

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let addr = server.address();
  let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
  console.log(`################## running on ${bind}`.cyan.bold);
}

module.exports = server;
