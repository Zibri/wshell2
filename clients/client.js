var pty = require('node-pty');
const crypto = require('crypto');
const CryptoJS = require('node-cryptojs-aes').CryptoJS;
const io = require("socket.io-client");
const config = require("../config.js");

(function() {

    const DEBUG = process.env.debug || false;

    var rp = (n) => [...crypto.randomFillSync(new Uint8Array(n))].map((x, i) => (i = x / 255 * 61 | 0, String.fromCharCode(i + (i > 9 ? i > 35 ? 61 : 55 : 48)))).join ``

    vv = v = process.argv[2];
    if ((typeof v) == "undefined") {
        v = rp(16);
        h = rp(16);
        vv = v + '#' + h;
    }

    io.l = (process.argv[process.argv.length - 1] == "-l");
    io.c = (process.argv[process.argv.length - 2] == "-c") ? process.argv[process.argv.length - 1] : false;
    io.h = vv.substring(vv.indexOf('#') + 1);
    io.v = vv.substring(0, vv.indexOf('#')) || v;
    io.vv = vv;
    process.title = '[client] ' + io.v;

    function init() {

        if (typeof this.shown == "undefined") {
            console.log("\nConnect using:\n\tbrowser: " + config.client.host + "/?v=" + io.vv)
            console.log("\tshell: node sclient " + io.vv);

            this.shown = true
        }

        const socket = io(config.client.io + "/" + io.v, {
            connectTimeout: 15000,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false
        });

        function wsend(t,rj) {
            var rr;
            if(t=="s") rr=CryptoJS.AES.encrypt(Buffer.from(rj).base64Slice(), io.h).toString(); else
            var rr = CryptoJS.AES.encrypt(rj, io.h).toString()
            socket.emit(t, rr);
        }

        socket.on("disconnect", (c) => {
            DEBUG && console.log("disconnected", c);
            io.myREPL.pause();
        });

        socket.io.on("reconnect", (c) => {
            DEBUG && console.log("reconnected", c);
            io.myREPL.resume();
        });

        socket.once("connect", () => {

            startREPL = () => {
                if (io.c != false) {
                    cmd = io.c.split(' ')[0];
                    cmdargs = io.c.split(' ').slice(1) || [];
                } else {
                    if (typeof process.env.ComSpec == "undefined") {
                        cmd = "bash";
                        cmdargs = ["-i"]
                    } else {
                        cmd = "cmd.exe";
                        cmdargs = []
                    }
                }

                io.myREPL = pty.spawn(io.l ? '/bin/login' : cmd, io.l ? [] : cmdargs, {
                    name: 'xterm-256color',
                    cols: 80,
                    rows: 25,
                    env: process.env,
                    encoding: null
                });

                io.myREPL.on('data', function(data) {
                    wsend("s",data);
                });

                io.myREPL.on('exit', function(c) {

                    console.log("Shell has exited.");
                    if(c!=0) setTimeout(startREPL, 500); else process.exit(c)

                });

                wsend("src","?");

            }

            startREPL();

        });

        socket.on("c", (ed) => {

            d = CryptoJS.AES.decrypt(ed, io.h).toString(CryptoJS.enc.Utf8);

            io.myREPL.write(d);

        });

        socket.on("crc", (ed) => {

            d = JSON.parse(CryptoJS.AES.decrypt(ed, io.h).toString(CryptoJS.enc.Utf8));

            io.myREPL.resize(d.cols,d.rows);

        });

    }

    init();

})();
