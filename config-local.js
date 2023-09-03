var config = {

    server: {
        DEBUG: false,
        port: 3000,
        host: null, // "127.0.0.1", "0.0.0.0", "x.y.z.k"
        allowed: ["*"] // allowed origins array
    },

    client: {
        DEBUG: false,
        host: "http://127.0.0.1:3000",
        io: "ws://127.0.0.1:3000" // or "" or "ws://localhost" or anything else
    }
};

module.exports = config
