#!/bin/bash  
APPNAME='openguild'
APPURL='yoururl.com'
#this is case sensitive
APPTAR='openGuild-CMS.tar.gz'

echo "Thanks for chosing FinchMFG!"  
echo "Creating directory $APPNAME"
mkdir /home/$APPNAME

mkdir /home/$APPNAME/.static~

mv $APPTAR /home/$APPNAME/

sudo apt-get update
sudo apt-get --yes --force-yes install nano curl npm nginx
sudo apt-get --yes --force-yes remove apache2
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
echo "deb [ arch=amd64 ] http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org

echo "# upstart service file at /etc/init/$APPNAME.conf 
# When to start the service 
start on started mongodb and runlevel [2345] 

# When to stop the service 
stop on shutdown 

# Automatically restart process if crashed 
respawn 
respawn limit 10 5 

script 
    exec bash /home/$APPNAME/startserver.sh 
end script" > /etc/init/$APPNAME.conf

echo "export PATH=/opt/local/bin:/opt/local/sbin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin 
export NODE_PATH=/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript 
export PWD=/home/$APPNAME 
export HOME=/home/$APPNAME 
export BIND_IP=127.0.0.1  
export PORT=8080  
export HTTP_FORWARDED_COUNT=1  
export MONGO_URL=mongodb://localhost:27017/$APPNAME  
export ROOT_URL=http://$APPURL 
export ASSET_PATH=/home/$APPNAME/public/ 

if [ ! -d ~/.nvm ]; then 
  source /root/.nvm/nvm.sh 
  source /root/.profile 
  source /root/.bashrc 
  nvm install 4.6.2 
fi 

exec node /home/$APPNAME/bundle/main.js " > /home/$APPNAME/startserver.sh
chmod 777 /home/$APPNAME/startserver.sh

echo "server_tokens off; # for security-by-obscurity: stop displaying nginx version 
 
# this section is needed to proxy web-socket connections 
map \$http_upgrade \$connection_upgrade { 
    default upgrade; 
    ''      close; 
} 
 
# HTTP 
server { 
    listen 80 default_server; # if this is not a default server, remove "default_server" 
    listen [::]:80 default_server ipv6only=on; 
 
    root /usr/share/nginx/html; # root is irrelevant 
    index index.html index.htm; # this is also irrelevant 
 
    server_name $APPURL; # the domain on which we want to host the application. Since we set "default_server" previ\S$ 
 
    location / { 
        proxy_pass http://127.0.0.1:8080; 
        proxy_http_version 1.1; 
        proxy_set_header Upgrade \$http_upgrade; # allow websockets 
        proxy_set_header Connection \$connection_upgrade; 
        proxy_set_header X-Forwarded-For \$remote_addr; # preserve client IP 
 
        # this setting allows the browser to cache the application in a way compatible with Meteor 
        # on every applicaiton update the name of CSS and JS file is different, so they can be cache infinitely (here:$ 
        # the root path (/) MUST NOT be cached 
        if (\$uri != '/') { 
            expires 30d; 
        }
    }
}" > /etc/nginx/sites-available/$APPNAME

rm /etc/nginx/sites-enabled/default
ln -s /etc/nginx/sites-available/$APPNAME /etc/nginx/sites-enabled/$APPNAME
nginx
nginx -s reload

cd /home/$APPNAME
tar -zxf $APPTAR

cd /home/$APPNAME/bundle/programs/server
npm install
cd /home/

start $APPNAME

echo "

Thanks for using FinchMFG! :)

"
