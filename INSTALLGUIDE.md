# OpenGuild Install Guide

### Table of Contents
1. [Introduction](#introduction)
2. [Requirements](#requirements)
3. [Updating](#updating)
4. [Auto installtion Via Install script](#auto)
5. [Manual Installation](#manual)
6. [First time Login](#login)
7. [URL's to know](#url)

<a name="introduction"></a>
### Introduction
Hey there, thanks for downloading OpenGuild! If you have any suggestions either for this app or any future apps, be sure to let me know! 
If you have any questions for how to use this software, be sure to check out this wiki.
If you find any bugs, you can open a a new issue on this projects GitHub! 
<a name="requirements"></a>
### Requirements
- Ubuntu 14

<a name="updating"></a>
### Updating
To update, copy the new tarball (.tar.gz file) into your VPS home/YOURAPPNAME directory. On linux this can be done via
```
scp openGuild-CMS.tar.gz root@YOUR_IP_ADDRESS:/home/YOURAPPNAME
```
SSH into your VPS
```
ssh root@YOUR_IP_ADDRESS
```
Extract the new tarball
```
cd /home/YOURAPPNAME
tar -zxf openGuild-CMS.tar.gz
```
Stop and Start your app 
```
stop YOURAPPNAME
start YOURAPPNAME
```
You now are running the latest build!

<a name="auto"></a>
### Auto installtion
Change the APPNAME and APPURL inside install.sh to your app name and your URL
```
APPNAME='YOURAPPNAME'
APPURL='YOURAPPURL'
```
Copy the application tarball and the install.sh script to the home directory of your VPS. On linux this can be done by running
```
scp openGuild-CMS.tar.gz root@YOUR_IP_ADDRESS:/home
scp install.sh root@YOUR_IP_ADDRESS:/home
```
SSH into your VPS and CD into home/
```
ssh root@YOUR_IP_ADDRESS
cd /home/
```
Run install.sh
```
./install.sh
```
This will auto install all dependencies and start the server for you!

<a name="manual"></a>
### Manual Installtion
SSH into your VPS
```
ssh root@your_ip_here
```
CD into your home folder and create a new directory with the name of your app
```
cd /home/
mkdir YOURAPPNAME
```
You need to make a directory to store images
```
mkdir /home/YOURAPPNAME/.static~
```
You'll want to update your known repo list to pull some required apps from the web!
```
sudo apt-get update
```
Install nano curl and npm
```
sudo apt-get install nano curl npm
```
Install NVM 
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
```
and configure it for use
```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```
Install MongoDB (Run these one at a time)
```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
echo "deb [ arch=amd64 ] http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```
Lets make our server conf, replacing YOURAPPNAME with your app
```
nano /etc/init/YOURAPPNAME.conf
```
Inside of nano paste this, replacing YOURAPPNAME with your appname
```
# upstart service file at /etc/init/YOURAPPNAME.conf
# When to start the service
start on started mongodb and runlevel [2345]

# When to stop the service
stop on shutdown

# Automatically restart process if crashed
respawn
respawn limit 10 5

script
    exec bash /home/YOURAPPNAME/startserver.sh
end script
```
Save and Exit
```
CTRL-O
ENTER
CTRL-X
```
Create your server starter, replacing YOURAPPNAME with your app name
```
nano /home/YOURAPPNAME/startserver.sh
```
Inside of Nano paste, replacing YOURAPPNAME with your app name and YOURURL with your URL
```
export PATH=/opt/local/bin:/opt/local/sbin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin 
export NODE_PATH=/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript 
export PWD=/home/YOURAPPNAME
export HOME=/home/YOURAPPNAME
export BIND_IP=127.0.0.1 
export PORT=8080 
export HTTP_FORWARDED_COUNT=1 
export MONGO_URL=mongodb://localhost:27017/YOURAPPNAME 
export ROOT_URL=http://YOURURL
export ASSET_PATH=/home/YOURAPPNAME/public/

if [ ! -d ~/.nvm ]; then
  source /root/.nvm/nvm.sh
  source /root/.profile
  source /root/.bashrc
  nvm install 4.6.2
fi

exec node /home/YOURAPPNAME/bundle/main.js 
```
Save and Exit
```
CTRL-O
ENTER
CTRL-X
```
Make it read write exec for all
```
chmod 777 /home/YOURAPPNAME/startserver.sh
```

Install nginx
```
sudo apt-get install nginx
```
Remove Apache if it's installed
```
sudo apt-get remove apache2
```
Configure Nginx replacing YOURAPPNAME with your app name
```
nano /etc/nginx/sites-available/YOURAPPNAME
```
Inside Nano paste this, replacing YOURURL with Your URL
```
server_tokens off; # for security-by-obscurity: stop displaying nginx version

# this section is needed to proxy web-socket connections
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

# HTTP
server {
    listen 80 default_server; # if this is not a default server, remove "default_server"
    listen [::]:80 default_server ipv6only=on;

    root /usr/share/nginx/html; # root is irrelevant
    index index.html index.htm; # this is also irrelevant

    server_name YOURURL.com; # the domain on which we want to host the application. Since we set "default_server" previ$

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade; # allow websockets
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header X-Forwarded-For $remote_addr; # preserve client IP

        # this setting allows the browser to cache the application in a way compatible with Meteor
        # on every applicaiton update the name of CSS and JS file is different, so they can be cache infinitely (here:$
        # the root path (/) MUST NOT be cached
        if ($uri != '/') {
            expires -1; # this means nothing is cached. If you want cache, change this to $NUMd; (so like 20d;)
        }
    }
}
```
Save and Exit
```
CTRL-O
ENTER
CTRL-X
```
Remove the Deafult NGINX page
```
rm /etc/nginx/sites-enabled/default
```
Add our sites to the live list, replacing YOURAPPNAME with your app name
```
ln -s /etc/nginx/sites-available/YOURAPPNAME /etc/nginx/sites-enabled/YOURAPPNAME
```
Make sure our Nginx config is OK
```
nginx -t
```
If you're not getting an error, relaod Nginx
```
nginx -s reload
```
Or start it if it wasn't running
```
nginx
```
Make sure Mongo is running
```
netstat -plutn
```
You should see something like
```
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 127.0.0.1:27017         0.0.0.0:*               LISTEN      19525/mongod  
```
On your local machine, copy your server tarball to your VPS
On linux
```
scp openGuild-CMS.tar.gz root@YOUR_IP_ADDRESS:/home/YOURAPPNAME
```
On your VPS extract the tarball
```
cd /home/YOURAPPNAME
tar -zxf openGuild-CMS.tar.gz
```
Install the NPM dependencies
```
cd ./bundle/programs/server/
npm install
```
Start your server, replacing YOURAPPNAME with your app name
```
start YOURAPPNAME
```
Go to your IP address and you should see your site load!

If your site doesn't load try this:
1) Make sure you installed your NPM Modules
2) Make sure Mongo is running
3) Make sure you used consistent naming in YOURAPPNAME
4) Make sure you set read write for all on startserver.sh

If your app still isn't running send me the output of running this
```
cd /home/YOURAPPNAME
./startserver.sh
```
And we'll get you sorted!

<a name="login"></a>
### First time Login
The first time you login will create an account with those details. There is no register button, instead when you click login for the first time you must provide the secret key when it prompts you for it.
```
SnowyTableSanDiegoFifteenTwelve
```
When you click unlock, an account with those deatils will be created. You can now access /admin

<a name="url"></a>
### URL's to know
These are all the URL's on the website
```
/admin
/admin-login
```
