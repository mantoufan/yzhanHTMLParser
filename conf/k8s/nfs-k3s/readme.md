# Readme
## Step 1 RBAC
```shell
 kubectl apply -f nfs-rbac.yaml
```
## Step 2 NFS-Subdir-External-Provisioner
```shell
kubectl apply -f nfs-provisioner-deploy.yaml -n kube-nfs
```
## Step 3 StorageClass
```shell
kubectl apply -f nfs-storageclass.yaml
```
## Step 4 PVC
```shell
kubectl apply -f nfs-pvc.yaml
```