var config = {

    server: {
        debug: false,
        port: 3000,
        host: null, // "127.0.0.1", "0.0.0.0", "x.y.z.k"
        allowed: ["*"] // allowed origins array
    },

    client: {
        debug: false,
        host: "https://wshell2.zibri.repl.co",
        io: "wss://wshell2.zibri.repl.co" // or "" or "ws://localhost" or anything else
    }
};

module.exports = config
