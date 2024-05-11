#!/bin/bash
echo "Starting up..."
sudo apt update && sudo apt upgrade -y
rm -rf log
ssh -o "StrictHostKeyChecking=no" -R 80:localhost:8856 nokey@localhost.run </dev/null &>log &
cd webserver
yarn &>/dev/null
cd ../clients
yarn &>/dev/null
cd ..
rm -rf config.js
echo "waiting for host..."
while [ "$(grep tunneled log)" == "" ]; do
    echo -n .
    sleep 1
done
hh=$(cat log|grep tunneled|cut -d " " -f 6|tail -1)
cat >config.js <<EOF
var config = {
  server: { DEBUG: false, port: 8856, host: "127.0.0.1", allowed: [ '*' ] },
  client: {
    DEBUG: false,
    host: '$hh',
    io: 'wss://${hh:8}'
  }
};
module.exports = config
EOF
cd webserver
sync
sleep 10
sync
echo "Starting server..."
node server.js &
cd ../clients
echo "alias exit='kill \$PPID'" >>~/.bash_aliases
echo "Starting client..."
node client.js $1
