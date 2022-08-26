# Server

## Debian

```bash
# https://github.com/Chikage0o0/installNET
wget -N --no-check-certificate "https://raw.githubusercontent.com/chiakge/installNET/master/Install.sh"
chmod +x Install.sh
./Install.sh
```

## Dependency

```bash
apt-get update
apt-get install -y wget curl sudo ufw docker.io docker-compose wireguard
```

## User

```bash
adduser yu
visudo
```

## **Firewall**

```bash
sudo ufw allow proto tcp from any to any port 443 && sudo ufw allow 53/udp && sudo ufw allow 53/tcp && sudo ufw allow 51821:51830/udp
```

## Install

```bash
# Download
wget -O docker-compose.yml https://raw.githubusercontent.com/gravitl/netmaker/master/compose/docker-compose.contained.yml

# COREDNS IP
ip route get 1 | sed -n 's/^.*src \([0-9.]*\) .*$/\1/p'
# Docker-compose
sed -i 's/NETMAKER_BASE_DOMAIN/<your base domain>/g' docker-compose.yml
sed -i 's/SERVER_PUBLIC_IP/<your server ip>/g' docker-compose.yml
sed -i 's/COREDNS_IP/<default interface ip>/g' docker-compose.yml
tr -dc A-Za-z0-9 </dev/urandom | head -c 30;
sed -i 's/REPLACE_MASTER_KEY/<your generated key>/g' docker-compose.ymldocker-compose.yml
# Caddy
sudo wget -O /root/Caddyfile https://raw.githubusercontent.com/gravitl/netmaker/master/docker/Caddyfile
sudo sed -i 's/NETMAKER_BASE_DOMAIN/<your base domain>/g' /root/Caddyfile
sudo sed -i 's/YOUR_EMAIL/<your email>/g' /root/Caddyfile
# MQ
sudo wget -O /root/mosquitto.conf https://raw.githubusercontent.com/gravitl/netmaker/master/docker/mosquitto.conf

sudo docker-compose up -d

# logs
sudo docker logs netmaker
```

# Client

## Dependency

```bash
apt-get update
apt-get install -y wget curl sudo ufw wireguard
```

## User

```bash
adduser yu
visudo
```

## Setup

```bash
# Download netcliet
wget https://github.com/gravitl/netmaker/releases/download/v0.12.0/netclient
chmod +x ./netclient
# Server
./netclient join -t <TOKEN> -port <Network Port>
```