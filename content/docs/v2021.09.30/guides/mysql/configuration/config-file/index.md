---
title: Run MySQL with Custom Configuration
menu:
  docs_v2021.09.30:
    identifier: guides-mysql-configuration-using-config-file
    name: Config File
    parent: guides-mysql-configuration
    weight: 10
menu_name: docs_v2021.09.30
section_menu_id: guides
info:
  autoscaler: v0.7.0
  cli: v0.22.0
  community: v0.22.0
  enterprise: v0.9.0
  installer: v2021.09.30
  version: v2021.09.30
---

> New to KubeDB? Please start [here](/docs/v2021.09.30/README).

# Using Custom Configuration File

KubeDB supports providing custom configuration for MySQL. This tutorial will show you how to use KubeDB to run a MySQL database with custom configuration.

## Before You Begin

- At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

- Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/v2021.09.30/setup/README).

- To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial.

  ```bash
  $ kubectl create ns demo
  namespace/demo created
  
  $ kubectl get ns demo
  NAME    STATUS  AGE
  demo    Active  5s
  ```

> Note: YAML files used in this tutorial are stored in [docs/guides/mysql/configuration/config-file/yamls](https://github.com/kubedb/docs/tree/{{< param "info.version" >}}/docs/guides/mysql/configuration/config-file/yamls) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Overview

MySQL allows to configure database via configuration file. The default configuration for MySQL can be found in `/etc/mysql/my.cnf` file. When MySQL starts, it will look for custom configuration file in `/etc/mysql/conf.d` directory. If configuration file exist, MySQL instance will use combined startup setting from both `/etc/mysql/my.cnf` and `*.cnf` files in `/etc/mysql/conf.d` directory. This custom configuration will overwrite the existing default one. To know more about configuring MySQL see [here](https://dev.mysql.com/doc/refman/8.0/en/server-configuration.html).

At first, you have to create a config file with `.cnf` extension with your desired configuration. Then you have to put this file into a [volume](https://kubernetes.io/docs/concepts/storage/volumes/). You have to specify this volume  in `spec.configSecret` section while creating MySQL crd. KubeDB will mount this volume into `/etc/mysql/conf.d` directory of the database pod.

In this tutorial, we will configure [max_connections](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_max_connections) and [read_buffer_size](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_read_buffer_size) via a custom config file. We will use configMap as volume source.

## Custom Configuration

At first, let's create `my-config.cnf` file setting `max_connections` and `read_buffer_size` parameters.

```bash
cat <<EOF > my-config.cnf
[mysqld]
max_connections = 200
read_buffer_size = 1048576
EOF

$ cat my-config.cnf
[mysqld]
max_connections = 200
read_buffer_size = 1048576
```

Here, `read_buffer_size` is set to 1MB in bytes.

Now, create a secret with this configuration file.

```bash
$ kubectl create secret generic -n demo my-configuration --from-file=./my-config.cnf
configmap/my-configuration created
```

Verify the secret has the configuration file.

```yaml
$ kubectl get secret -n demo my-configuration -o yaml
apiVersion: v1
data:
  my-config.cnf: W215c3FsZF0KbWF4X2Nvbm5lY3Rpb25zID0gMjAwCnJlYWRfYnVmZmVyX3NpemUgPSAxMDQ4NTc2Cg==
kind: Secret
metadata:
  creationTimestamp: "2021-03-11T05:06:07Z"
  name: my-configuration
  namespace: demo
  resourceVersion: "15421"
  selfLink: /api/v1/namespaces/demo/secrets/my-configuration
  uid: f593d7f4-1486-47d9-9240-10ae46fad32f
type: Opaque
  ...
```

Now, create MySQL crd specifying `spec.configSecret` field.

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/guides/mysql/configuration/config-file/yamls/mysql-custom.yaml
mysql.kubedb.com/custom-mysql created
```

Below is the YAML for the MySQL crd we just created.

```yaml
apiVersion: kubedb.com/v1alpha2
kind: MySQL
metadata:
  name: custom-mysql
  namespace: demo
spec:
  version: "8.0.23-v1"
  configSecret:
    name: my-configuration
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
```

Now, wait a few minutes. KubeDB operator will create necessary PVC, statefulset, services, secret etc. If everything goes well, we will see that a pod with the name `custom-mysql-0` has been created.

Check that the statefulset's pod is running

```bash
$ kubectl get pod -n demo
NAME             READY     STATUS    RESTARTS   AGE
custom-mysql-0   1/1       Running   0          44s
```

Check the pod's log to see if the database is ready

```bash
$ kubectl logs -f -n demo custom-mysql-0
2021-03-11T05:24:36.823328Z 1 [System] [MY-013576] [InnoDB] InnoDB initialization has started.
2021-03-11T05:24:37.355855Z 1 [System] [MY-013577] [InnoDB] InnoDB initialization has ended.
....
2021-03-11 05:24:45+00:00 [Note] [Entrypoint]: Stopping temporary server
2021-03-11T05:24:45.237891Z 10 [System] [MY-013172] [Server] Received SHUTDOWN from user root. Shutting down mysqld (Version: 8.0.23).
2021-03-11T05:24:48.264718Z 0 [System] [MY-010910] [Server] /usr/sbin/mysqld: Shutdown complete (mysqld 8.0.23)  MySQL Community Server - GPL.
2021-03-11 05:24:49+00:00 [Note] [Entrypoint]: Temporary server stopped
...
2021-03-11 05:24:49+00:00 [Note] [Entrypoint]: MySQL init process done. Ready for start up. accessible to all OS users. Consider choosing a different directory.
2021-03-11T05:24:50.503953Z 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections. Version: '8.0.23'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server - GPL.
....
```

Once we see `[Note] /usr/sbin/mysqld: ready for connections.` in the log, the database is ready.

Now, we will check if the database has started with the custom configuration we have provided.

First, deploy [phpMyAdmin](https://hub.docker.com/r/phpmyadmin/phpmyadmin/) to connect with the MySQL database we have just created.

```bash
 $ kubectl create -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/guides/mysql/configuration/config-file/yamls/phpmyadmin.yaml
deployment.extensions/myadmin created
service/myadmin created
```

Then, open your browser and go to the following URL: _http://{node-ip}:{myadmin-svc-nodeport}_. For kind cluster, you can get this URL by running the following command:

```bash
$ kubectl get svc -n demo myadmin -o json | jq '.spec.ports[].nodePort'
30942

$ kubectl get node -o json | jq '.items[].status.addresses[].address'
"172.18.0.3"
"kind-control-plane"
"172.18.0.4"
"kind-worker"
"172.18.0.2"
"kind-worker2"

# expected url will be:
url: http://172.18.0.4:30942
```

Now, let's connect to the database from the phpMyAdmin dashboard using the database pod IP and MySQL user password.

```bash
$ kubectl get pods custom-mysql-0 -n demo -o yaml | grep IP
  hostIP: 10.0.2.15
  podIP: 172.17.0.6

$ kubectl get secrets -n demo custom-mysql-auth -o jsonpath='{.data.\user}' | base64 -d
root

$ kubectl get secrets -n demo custom-mysql-auth -o jsonpath='{.data.\password}' | base64 -d
MLO5_fPVKcqPiEu9
```

Once, you have connected to the database with phpMyAdmin go to **Variables** tab and search for `max_connections` and `read_buffer_size`. Here are some screenshot showing those configured variables.
![max_connections](/docs/v2021.09.30/images/mysql/max_connection.png)

![read_buffer_size](/docs/v2021.09.30/images/mysql/read_buffer_size.png)

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```bash
kubectl patch -n demo my/custom-mysql -p '{"spec":{"terminationPolicy":"WipeOut"}}' --type="merge"
kubectl delete -n demo my/custom-mysql

kubectl delete deployment -n demo myadmin
kubectl delete service -n demo myadmin

kubectl delete ns demo
```

If you would like to uninstall KubeDB operator, please follow the steps [here](/docs/v2021.09.30/setup/README).

## Next Steps

- [Quickstart MySQL](/docs/v2021.09.30/guides/mysql/quickstart/) with KubeDB Operator.
- Initialize [MySQL with Script](/docs/v2021.09.30/guides/mysql/initialization/).
- Monitor your MySQL database with KubeDB using [out-of-the-box Prometheus operator](/docs/v2021.09.30/guides/mysql/monitoring/prometheus-operator/).
- Monitor your MySQL database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2021.09.30/guides/mysql/monitoring/builtin-prometheus/).
- Use [private Docker registry](/docs/v2021.09.30/guides/mysql/private-registry/) to deploy MySQL with KubeDB.
- Use [kubedb cli](/docs/v2021.09.30/guides/mysql/cli/) to manage databases like kubectl for Kubernetes.
- Detail concepts of [MySQL object](/docs/v2021.09.30/guides/mysql/concepts/database/).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2021.09.30/CONTRIBUTING).
