var config = {

    server: {
        debug: false,
        port: 4000,
        host: null, // "127.0.0.1", "0.0.0.0", "x.y.z.k"
        allowed: ["*"] // allowed origins array
    },

    client: {
        debug: false,
        host: "https://yvrzd3-4000.csb.app",
        io: "wss://yvrzd3-4000.csb.app" // or "" or "ws://localhost" or anything else
    }
};

module.exports = config
