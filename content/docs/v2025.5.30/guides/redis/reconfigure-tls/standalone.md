---
title: Reconfigure Redis TLS/SSL Encryption
menu:
  docs_v2025.5.30:
    identifier: rd-reconfigure-tls-standalone
    name: Standalone and Cluster
    parent: rd-reconfigure-tls
    weight: 20
menu_name: docs_v2025.5.30
section_menu_id: guides
info:
  autoscaler: v0.40.0
  cli: v0.55.0
  dashboard: v0.31.0
  installer: v2025.5.30
  ops-manager: v0.42.0
  provisioner: v0.55.0
  schema-manager: v0.31.0
  ui-server: v0.31.0
  version: v2025.5.30
  webhook-server: v0.31.0
---

> New to KubeDB? Please start [here](/docs/v2025.5.30/README).

# Reconfigure Redis TLS/SSL (Transport Encryption)

KubeDB supports reconfigure i.e. add, remove, update and rotation of TLS/SSL certificates for existing Redis database via a RedisOpsRequest. This tutorial will show you how to use KubeDB to reconfigure TLS/SSL encryption.

## Before You Begin

- At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

- Install [`cert-manger`](https://cert-manager.io/docs/installation/) v1.0.0 or later to your cluster to manage your SSL/TLS certificates.

- Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/v2025.5.30/setup/README).

- To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial.

  ```bash
  $ kubectl create ns demo
  namespace/demo created
  ```

> Note: YAML files used in this tutorial are stored in [docs/examples/redis](https://github.com/kubedb/docs/tree/{{< param "info.version" >}}/docs/examples/redis) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Add TLS to a Redis database

> In this tutorial we are going to reconfigure TLS of Redis in Standalone mode. For the Cluster mode, the process is same. A Redis database in Cluster mode
needs to be deployed instead of Standalone mode and RedisOpsRequest CR fields are same for both.

Here, We are going to create a Redis database without TLS and then reconfigure the database to use TLS.

### Deploy Redis without TLS

In this section, we are going to deploy a Redis Standalone database without TLS. In the next few sections we will reconfigure TLS using `RedisOpsRequest` CRD. Below is the YAML of the `Redis` CR that we are going to create,

```yaml
apiVersion: kubedb.com/v1
kind: Redis
metadata:
  name: rd-sample
  namespace: demo
spec:
  version: "6.2.14"
  mode: Standalone
  storage:
    storageClassName: "standard"
    accessModes:
      - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
```

Let's create the `Redis` CR we have shown above,

```bash
$ kubectl create -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/redis/reconfigure-tls/redis-standalone.yaml
redis.kubedb.com/rd-sample created
```

Now, wait until `redis-standalone` has status `Ready`. i.e,

```bash
$ watch kubectl get rd -n demo
Every 2.0s: kubectl get rd -n demo
NAME        VERSION   STATUS   AGE
rd-sample   6.2.14     Ready    88s
```

Now, we can connect to this database through redis-cli verify that the TLS is disabled.

```bash
$ kubectl exec -it -n demo rd-sample-0 -c redis -- bash

root@rd-sample-0:/data# redis-cli

127.0.0.1:6379> config get tls-cert-file
1) "tls-cert-file"
2) ""
127.0.0.1:6379> exit
root@rd-sample-0:/data# 
```

We can verify from the above output that TLS is disabled for this database.

### Create Issuer/ClusterIssuer

Now, We are going to create an example `Issuer` that will be used to enable SSL/TLS in Redis. Alternatively, you can follow this [cert-manager tutorial](https://cert-manager.io/docs/configuration/ca/) to create your own `Issuer`.

- Start off by generating a ca certificates using openssl.

```bash
$ openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./ca.key -out ./ca.crt -subj "/CN=ca/O=kubedb"
Generating a RSA private key
................+++++
........................+++++
writing new private key to './ca.key'
-----
```

- Now we are going to create a ca-secret using the certificate files that we have just generated.

```bash
$ kubectl create secret tls redis-ca \
     --cert=ca.crt \
     --key=ca.key \
     --namespace=demo
secret/redis-ca created
```

Now, Let's create an `Issuer` using the `redis-ca` secret that we have just created. The `YAML` file looks like this:

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: redis-ca-issuer
  namespace: demo
spec:
  ca:
    secretName: redis-ca
```

Let's apply the `YAML` file:

```bash
$ kubectl create -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/redis/reconfigure-tls/issuer.yaml
issuer.cert-manager.io/redis-ca-issuer created
```

### Create RedisOpsRequest

In order to add TLS to the database, we have to create a `RedisOpsRequest` CRO with our created issuer. Below is the YAML of the `RedisOpsRequest` CRO that we are going to create,

```yaml
apiVersion: ops.kubedb.com/v1alpha1
kind: RedisOpsRequest
metadata:
  name: rd-add-tls
  namespace: demo
spec:
  type: ReconfigureTLS
  databaseRef:
    name: rd-sample
  tls:
    issuerRef:
      name: redis-ca-issuer
      kind: Issuer
      apiGroup: "cert-manager.io"
    certificates:
      - alias: client
        subject:
          organizations:
            - redis
          organizationalUnits:
            - client
```

Here,

- `spec.databaseRef.name` specifies that we are performing reconfigure TLS operation on `rd-sample` database.
- `spec.type` specifies that we are performing `ReconfigureTLS` on our database.
- `spec.tls.issuerRef` specifies the issuer name, kind and api group.
- `spec.tls.certificates` specifies the certificates. You can learn more about this field from [here](/docs/v2025.5.30/guides/redis/concepts/redis#spectls).

Let's create the `RedisOpsRequest` CR we have shown above,

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/redis/reconfigure-tls/rd-add-tls.yaml
redisopsrequest.ops.kubedb.com/rd-add-tls created
```

#### Verify TLS Enabled Successfully

Let's wait for `RedisOpsRequest` to be `Successful`.  Run the following command to watch `RedisOpsRequest` CRO,

```bash
$ kubectl get redisopsrequest -n demo
Every 2.0s: kubectl get redisopsrequest -n demo
NAME           TYPE             STATUS        AGE
rd-add-tls     ReconfigureTLS   Successful    9m
```

We can see from the above output that the `RedisOpsRequest` has succeeded. 

Now, connect to this database by exec into a pod and verify if `tls` has been set up as intended.

```bash
$ kubectl describe secret -n demo rd-sample-client-cert
Name:         rd-sample-client-cert
Namespace:    demo
Labels:       app.kubernetes.io/component=database
              app.kubernetes.io/instance=rd-sample
              app.kubernetes.io/managed-by=kubedb.com
              app.kubernetes.io/name=redises.kubedb.com
Annotations:  cert-manager.io/alt-names: 
              cert-manager.io/certificate-name: rd-sample-client-cert
              cert-manager.io/common-name: default
              cert-manager.io/ip-sans: 
              cert-manager.io/issuer-group: cert-manager.io
              cert-manager.io/issuer-kind: Issuer
              cert-manager.io/issuer-name: redis-ca-issuer
              cert-manager.io/uri-sans: 

Type:  kubernetes.io/tls

Data
====
ca.crt:   1147 bytes
tls.crt:  1127 bytes
tls.key:  1679 bytes
```

Now, Lets exec into a redis container and find out the username to connect in a redis shell,

```bash
$ kubectl exec -it -n demo rd-sample-0 -c redis -- bash

root@rd-sample-0:/data# ls /certs
ca.crt	client.crt  client.key	server.crt  server.key

root@rd-sample-0:/data# redis-cli --tls --cert "/certs/client.crt" --key "/certs/client.key" --cacert "/certs/ca.crt" config get tls-cert-file
1) "tls-cert-file"
2) "/certs/server.crt
```

Now, we can connect using tls-certs to connect to the redis and write some data

```bash
$ kubectl exec -it -n demo rd-sample-0 -c redis -- bash
# Trying to connect without tls certificates
root@rd-sample-0:/data# redis-cli
127.0.0.1:6379> 
127.0.0.1:6379> set hello world
# Can not write data 
Error: Connection reset by peer 

# Trying to connect with tls certificates
root@rd-sample-0:/data# redis-cli --tls --cert "/certs/client.crt" --key "/certs/client.key" --cacert "/certs/ca.crt"
127.0.0.1:6379> 
127.0.0.1:6379> set hello world
OK
127.0.0.1:6379> exit
```

## Rotate Certificate

Now we are going to rotate the certificate of this database.

### Create RedisOpsRequest

Now we are going to rotate certificates using a RedisOpsRequest. Below is the yaml of the ops request that we are going to create,

```yaml
apiVersion: ops.kubedb.com/v1alpha1
kind: RedisOpsRequest
metadata:
  name: rd-ops-rotate
  namespace: demo
spec:
  type: ReconfigureTLS
  databaseRef:
    name: rd-sample
  tls:
    rotateCertificates: true
```

Here,

- `spec.databaseRef.name` specifies that we are performing reconfigure TLS operation on `rd-sample` database.
- `spec.type` specifies that we are performing `ReconfigureTLS` on our database.
- `spec.tls.rotateCertificates` specifies that we want to rotate the certificate of this database.

Let's create the `RedisOpsRequest` CR we have shown above,

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/redis/reconfigure-tls/rd-ops-rotate.yaml
redisopsrequest.ops.kubedb.com/rd-ops-rotate created
```

#### Verify Certificate Rotated Successfully

Let's wait for `RedisOpsRequest` to be `Successful`.  Run the following command to watch `RedisOpsRequest` CRO,

```bash
$ watch kubectl get redisopsrequest -n demo
Every 2.0s: kubectl get redisopsrequest -n demo
NAME             TYPE             STATUS        AGE
rd-ops-rotate    ReconfigureTLS   Successful    5m5s
```

We can see from the above output that the `RedisOpsRequest` has succeeded.

## Change Issuer/ClusterIssuer

Now, we are going to change the issuer of this database.

- Let's create a new ca certificate and key using a different subject `CN=ca-update,O=kubedb-updated`.

```bash
$ openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./ca.key -out ./ca.crt -subj "/CN=ca-updated/O=kubedb-updated"
Generating a RSA private key
..............................................................+++++
......................................................................................+++++
writing new private key to './ca.key'
-----
```

- Now we are going to create a new ca-secret using the certificate files that we have just generated.

```bash
$ kubectl create secret tls redis-new-ca \
     --cert=ca.crt \
     --key=ca.key \
     --namespace=demo
secret/redis-new-ca created
```

Now, Let's create a new `Issuer` using the `redis-new-ca` secret that we have just created. The `YAML` file looks like this:

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: rd-new-issuer
  namespace: demo
spec:
  ca:
    secretName: redis-new-ca
```

Let's apply the `YAML` file:

```bash
$ kubectl create -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/redis/reconfigure-tls/new-issuer.yaml
issuer.cert-manager.io/rd-new-issuer created
```

### Create RedisOpsRequest

In order to use the new issuer to issue new certificates, we have to create a `RedisOpsRequest` CRO with the newly created issuer. Below is the YAML of the `RedisOpsRequest` CRO that we are going to create,

```yaml
apiVersion: ops.kubedb.com/v1alpha1
kind: RedisOpsRequest
metadata:
  name: rd-change-issuer
  namespace: demo
spec:
  type: ReconfigureTLS
  databaseRef:
    name: rd-sample
  tls:
    issuerRef:
      name: rd-new-issuer
      kind: Issuer
      apiGroup: "cert-manager.io"
```

Here,

- `spec.databaseRef.name` specifies that we are performing reconfigure TLS operation on `rd-sample` database.
- `spec.type` specifies that we are performing `ReconfigureTLS` on our database.
- `spec.tls.issuerRef` specifies the issuer name, kind and api group.

Let's create the `RedisOpsRequest` CR we have shown above,

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/redis/reconfigure-tls/rd-change-issuer.yaml
redisopsrequest.ops.kubedb.com/rd-change-issuer created
```

#### Verify Issuer is changed successfully

Let's wait for `RedisOpsRequest` to be `Successful`.  Run the following command to watch `RedisOpsRequest` CRO,

```bash
$ kubectl get redisopsrequest -n demo
Every 2.0s: kubectl get redisopsrequest -n demo
NAME                  TYPE             STATUS        AGE
rd-change-issuer      ReconfigureTLS   Successful    4m65s
```

We can see from the above output that the `RedisOpsRequest` has succeeded. 

## Remove TLS from the Database

Now, we are going to remove TLS from this database using a RedisOpsRequest.

### Create RedisOpsRequest

Below is the YAML of the `RedisOpsRequest` CRO that we are going to create,

```yaml
apiVersion: ops.kubedb.com/v1alpha1
kind: RedisOpsRequest
metadata:
  name: rd-ops-remove
  namespace: demo
spec:
  type: ReconfigureTLS
  databaseRef:
    name: rd-sample
  tls:
    remove: true
```

Here,

- `spec.databaseRef.name` specifies that we are performing reconfigure TLS operation on `rd-sample` database.
- `spec.type` specifies that we are performing `ReconfigureTLS` on our database.
- `spec.tls.remove` specifies that we want to remove tls from this database.

Let's create the `RedisOpsRequest` CR we have shown above,

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/redis/reconfigure-tls/rd-ops-remove.yaml
redisopsrequest.ops.kubedb.com/rd-ops-remove created
```

#### Verify TLS Removed Successfully

Let's wait for `RedisOpsRequest` to be `Successful`.  Run the following command to watch `RedisOpsRequest` CRO,

```bash
$ kubectl get redisopsrequest -n demo
Every 2.0s: kubectl get redisopsrequest -n demo
NAME            TYPE             STATUS        AGE
rd-ops-remove   ReconfigureTLS   Successful    105s
```

We can see from the above output that the `RedisOpsRequest` has succeeded. 

Now, Lets exec into the database primary node and find out that TLS is disabled or not.

```bash
$ kubectl exec -it -n demo rd-sample-0 -c redis -- bash
#
root@rd-sample-0:/data# redis-cli

127.0.0.1:6379> config get tls-cert-file
1) "tls-cert-file"
2) ""
127.0.0.1:6379> exit
root@rd-sample-0:/data# 
```

So, we can see from the above that, output that tls is disabled successfully.

## Cleaning up

To clean up the Kubernetes resources created by this tutorial, run:

```bash
$ kubectl patch -n demo redis/rd-sample -p '{"spec":{"deletionPolicy":"WipeOut"}}' --type="merge"
redis.kubedb.com/rd-sample patched

$ kubectl delete redis -n demo rd-sample
redis.kubedb.com/rd-sample deleted

$ kubectl delete issuer -n demo redis-ca-issuer rd-new-issuer
issuer.cert-manager.io "redis-ca-issuer" deleted
issuer.cert-manager.io "rd-new-issuer" deleted

$ kubectl delete redisopsrequest -n demo rd-add-tls rd-ops-remove rd-ops-rotate rd-change-issuer
redisopsrequest.ops.kubedb.com "rd-add-tls" deleted
redisopsrequest.ops.kubedb.com "rd-ops-remove" deleted
redisopsrequest.ops.kubedb.com "rd-ops-rotate" deleted
redisopsrequest.ops.kubedb.com "rd-change-issuer" deleted
```

## Next Steps

- Detail concepts of [Redis object](/docs/v2025.5.30/guides/redis/concepts/redis).
- [Backup and Restore](/docs/v2025.5.30/guides/redis/backup/kubestash/overview/) Redis databases using KubeStash. .
- Monitor your Redis database with KubeDB using [out-of-the-box Prometheus operator](/docs/v2025.5.30/guides/redis/monitoring/using-prometheus-operator).
- Monitor your Redis database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2025.5.30/guides/redis/monitoring/using-builtin-prometheus).
