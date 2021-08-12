const { readFileSync } = require("fs");
const { createServer } = require("http");
const { Server } = require("socket.io");
const config = require("../config.js");

var DEBUG = config.server.debug;

const httpServer = createServer((req, response) => {

    config.server.allowed.forEach((c) => {
        response.setHeader('Access-Control-Allow-Origin', c);
    });

    response.setHeader('Access-Control-Allow-Methods', '*');
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Max-Age', 2592000); // 30 days

    var url = req.url;
    if ((url == '/') || (url == '/index.html') || (url.indexOf('/?v=') == 0) || (url.indexOf('/index.html?v=') == 0)) {

        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        response.end(readFileSync("wclient.html", "utf8"));
    } else if (url == '/config.js') {
        response.writeHead(200, {
            "Content-Type": "application/javascript"
        });
        response.end(readFileSync("../config.js", "utf8"));
    } else if (url == '/wshell2.tgz') {
        response.writeHead(200, {
            "Content-Type": "application/octet-stream"
        });
        response.end(readFileSync("../wshell2.tgz", "binary"), "binary");
    } else if (url == '/icon.png') {
        response.writeHead(200, {
            "Content-Type": "icon/png"
        });
        response.end(readFileSync("terminal_icon.png", "binary"), "binary");
    } else {
        response.writeHead(404, {
            "Content-Type": "text/plain"
        });
        response.end("Go away.");
    }

});

const io = new Server(httpServer, {
    connectTimeout: 15000,
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});

io.of("/").use((socket, next) => {
    const err = new Error("go away.");
    err.data = {
        content: "and don't come back."
    };
    DEBUG && console.error(`refused connect ${socket.id} on ${socket.nsp.name}`);
    next(err);
});

io.of(/^.*/).use((socket, next) => {
    if (socket.nsp.name.length != 17) {
        const err = new Error("go away.");
        err.data = {
            content: "and don't come back."
        };
        DEBUG && console.error(`refused connect ${socket.id} on ${socket.nsp.name}`);
        next(err);
    } else next()
}).on("connection", (socket) => {

    DEBUG && console.log(`connect ${socket.id} on ${socket.nsp.name}`);
    DEBUG || console.log(`connect on ${socket.nsp.name.substring(1,9)}`);

    socket.join(socket.nsp.name.substring(1));

    socket.onAny((e, ...args) => {

        DEBUG && console.log(socket.id, "emitted", e, ...args);

        socket.to(socket.nsp.name.substring(1)).emit(e, ...args);

    });

    socket.on("disconnect", (reason) => {
        DEBUG && console.log(`disconnect ${socket.id} on ${socket.nsp.name}`);
        DEBUG || console.log(`disconnect on ${socket.nsp.name.substring(1,9)}`);
    });
});

httpServer.listen(config.server.port, config.server.host);

// uncomment this if you want to run also a local shell
// require("../clients/client.js");