#!/bin/bash
function extractTokenFromJson() {
	token=`echo $1 | grep -oP '(?:"token":")\K([^="]*)'`
	echo ${token}
}

function extractMsgFromJson() {
	msg=`echo $1 | grep -oP '(?:"msg":")\K([^="]*)'`
	echo ${msg}
}

echo "Nevercode Setup"
echo -n "Please enter your Nevercode email: "
read email
echo -n "Please enter your Nevercode password: "
read password

result=`curl --data "email=${email}&password=${password}" http://localhost:3000/signin`
msg=`extractMsgFromJson ${result}`
if [ "$msg" == "Authorized" ]
then
	token=`extractTokenFromJson ${result}`
	echo ${token} > 'Nevercode.sublime-package/client_token.txt'
	cp -R ./Nevercode /Users/{$USER}/Library/Application\ Support/Sublime\ Text\ 3/Packages/
else
	echo 'Invalid Credentials. Please run again'
fi