# NFS-Server

## Dependency

```bash
sudo apt-get update 
sudo apt-get install nfs-kernel-server -y
```

## Make Dir & Chown

```bash
mkdir ~/nfs
chown nobody:nogroup ~/nfs
```

## Exports

```bash
echo "/home/yu/nfs 10.0.0.0/24(rw,sync,all_squash,no_subtree_check)" >> /etc/exports
```

## Restart Server

```bash
service nfs-kernel-server restart
```

## Mount
```bash
# Client
sudo apt-get install nfs-common -y

sudo mount -t nfs 10.0.0.1:/home/yu/nfs ~/nfs/y1
sudo umount ~/nfs/y1
```