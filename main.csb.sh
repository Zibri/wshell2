#!/bin/bash
# configure clients

# start the server
#
[ -f "wshell2.tgz" ] || ( 
url=$HOSTNAME-4000.csb.app
cat >config.js <<EOF
var config = {

    server: {
        debug: false,
        port: 4000,
        host: null, // "127.0.0.1", "0.0.0.0", "x.y.z.k"
        allowed: ["*"] // allowed origins array
    },

    client: {
        debug: false,
        host: "https://$url",
        io: "wss://$url" // or "" or "ws://localhost" or anything else
    }
};

module.exports = config
EOF
  ln -s . wshell2 
  tar cfvz wshell2.tgz --mtime='1970-09-02' --exclude "node_modules" --exclude "package-lock.json" --exclude wshell2/wshell2 wshell2/* 
  rm wshell2 )
cd webserver
[ -d "node_modules" ] || yarn install
yarn start
