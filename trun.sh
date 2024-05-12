#!/bin/bash
echo "Starting up..."
sudo apt purge -y firefox
sudo apt update && sudo apt upgrade -y
ssh -o "StrictHostKeyChecking=no" -R 80:localhost:3000 nokey@localhost.run </dev/null &>log &
sync
echo "waiting for host..."
while [ "$(grep tunneled log)" == "" ]; do
    echo -n .
    sleep 1
done
hh=$(cat log|grep tunneled|cut -d " " -f 6|tail -1)
echo "Starting server..."
echo "Your server is: ${hh}"
./ttyd &>/dev/null -p 3000 --writable -t fontSize=20 -t theme='{"foreground":"#d2d2d2","background":"#1b1b1b","cursor":"#adadad","black":"#000000","red":"#d81e00","green":"#5ea702","yellow":"#cfae00","blue":"#427ab3","magenta":"#89658e","cyan":"#00a7aa","white":"#dbded8","brightBlack":"#686a66","brightRed":"#f54235","brightGreen":"#99e343","brightYellow":"#fdeb61","brightBlue":"#84b0d8","brightMagenta":"#bc94b7","brightCyan":"#37e6e8","brightWhite":"#f1f1f0"}' -t fontFamily="'Menlo For Powerline,Consolas,Liberation Mono,Menlo,Courier,monospace'" -t enableTrzsz=true ./dosh
killall -9 ssh &>/dev/null
