---
title: Monitor MySQL using Builtin Prometheus Discovery
menu:
  docs_0.8.0-beta.2:
    identifier: my-using-builtin-prometheus-monitoring
    name: Builtin Prometheus Discovery
    parent: my-monitoring-mysql
    weight: 10
menu_name: docs_0.8.0-beta.2
section_menu_id: guides
info:
  version: 0.8.0-beta.2
---

> New to KubeDB? Please start [here](/docs/0.8.0-beta.2/concepts/README).

# Using Prometheus with KubeDB

This tutorial will show you how to monitor KubeDB databases using [Prometheus](https://prometheus.io/).

## Before You Begin

At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [Minikube](https://github.com/kubernetes/minikube).

Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/0.8.0-beta.2/setup/install).

To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial. Run the following command to prepare your cluster for this tutorial:

```console
$ kubectl create -f https://raw.githubusercontent.com/kubedb/cli/0.8.0-beta.2/docs/examples/mysql/demo-0.yaml
namespace "demo" created

$ kubectl get ns
NAME          STATUS    AGE
default       Active    45m
demo          Active    10s
kube-public   Active    45m
kube-system   Active    45m
```

Note that the yaml files that are used in this tutorial, stored in [docs/examples](https://github.com/kubedb/cli/tree/master/docs/examples) folder in GitHub repository [kubedb/cli](https://github.com/kubedb/cli).

## Create a MySQL database

KubeDB implements a `MySQL` CRD to define the specification of a MySQL database. Below is the `MySQL` object created in this tutorial.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: MySQL
metadata:
  name: mysql-mon-prometheus
  namespace: demo
spec:
  version: 8.0
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 50Mi
  monitor:
    agent: prometheus.io/builtin
```

```console
$ kubedb create -f https://raw.githubusercontent.com/kubedb/cli/0.8.0-beta.2/docs/examples/mysql/monitoring/builtin-prometheus/demo-1.yaml
validating "https://raw.githubusercontent.com/kubedb/cli/0.8.0-beta.2/docs/examples/mysql/monitoring/builtin-prometheus/demo-1.yaml"
mysql "mysql-mon-prometheus" created
```

Here,

- `spec.version` is the version of MySQL database. In this tutorial, a MySQL 8.0 database is going to be created.

- `spec.storage` specifies the StorageClass of PVC dynamically allocated to store data for this database. This storage spec will be passed to the StatefulSet created by KubeDB operator to run database pods. You can specify any StorageClass available in your cluster with appropriate resource requests. If no storage spec is given, an `emptyDir` is used.

- `spec.monitor` specifies that built-in [Prometheus](https://github.com/prometheus/prometheus) is used to monitor this database instance. KubeDB operator will configure the service of this database in a way that the Prometheus server will automatically find out the service endpoint aka `MySQL Exporter` and will receive metrics from exporter.

KubeDB operator watches for `MySQL` objects using Kubernetes api. When a `MySQL` object is created, KubeDB operator will create a new StatefulSet and a ClusterIP Service with the matching crd name. KubeDB operator will also create a governing service for StatefulSets with the name `kubedb`, if one is not already present.

```console
$ kubedb get my -n demo
NAME                   STATUS    AGE
mysql-mon-prometheus   Running   19s

$ kubedb describe my -n demo mysql-mon-prometheus
Name:		mysql-mon-prometheus
Namespace:	demo
StartTimestamp:	Mon, 12 Feb 2018 11:52:27 +0600
Status:		Running
Volume:
  StorageClass:	standard
  Capacity:	50Mi
  Access Modes:	RWO

StatefulSet:
  Name:			mysql-mon-prometheus
  Replicas:		1 current / 1 desired
  CreationTimestamp:	Mon, 12 Feb 2018 11:52:29 +0600
  Pods Status:		1 Running / 0 Waiting / 0 Succeeded / 0 Failed

Service:
  Name:		mysql-mon-prometheus
  Type:		ClusterIP
  IP:		10.101.55.20
  Port:		db		3306/TCP
  Port:		prom-http	56790/TCP

Database Secret:
  Name:	mysql-mon-prometheus-auth
  Type:	Opaque
  Data
  ====
  password:	16 bytes
  user:		4 bytes

Monitoring System:
  Agent:	prometheus.io/builtin
  Prometheus:
    Namespace:
    Interval:

No Snapshots.

Events:
  FirstSeen   LastSeen   Count     From             Type       Reason       Message
  ---------   --------   -----     ----             --------   ------       -------
  11s         11s        1         MySQL operator   Normal     Successful   Successfully patched StatefulSet
  11s         11s        1         MySQL operator   Normal     Successful   Successfully patched MySQL
  14s         14s        1         MySQL operator   Normal     Successful   Successfully created StatefulSet
  14s         14s        1         MySQL operator   Normal     Successful   Successfully created MySQL
  30s         30s        1         MySQL operator   Normal     Successful   Successfully created Service
```

Since `spec.monitoring` was configured, the database service object is configured accordingly. You can verify it running the following commands:

```console
$ kubectl get services -n demo
NAME                   TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)              AGE
kubedb                 ClusterIP   None           <none>        <none>               53s
mysql-mon-prometheus   ClusterIP   10.101.55.20   <none>        3306/TCP,56790/TCP   52s
```

```yaml
$ kubectl get services mysql-mon-prometheus -n demo -o yaml
apiVersion: v1
kind: Service
metadata:
  annotations:
    monitoring.appscode.com/agent: prometheus.io/builtin
    prometheus.io/path: /kubedb.com/v1alpha1/namespaces/demo/mysqls/mysql-mon-prometheus/metrics
    prometheus.io/port: "56790"
    prometheus.io/scrape: "true"
  creationTimestamp: 2018-02-12T05:52:28Z
  labels:
    kubedb.com/kind: MySQL
    kubedb.com/name: mysql-mon-prometheus
  name: mysql-mon-prometheus
  namespace: demo
  resourceVersion: "38255"
  selfLink: /api/v1/namespaces/demo/services/mysql-mon-prometheus
  uid: e86bb1a4-0fb8-11e8-a2d6-08002751ae8c
spec:
  clusterIP: 10.101.55.20
  ports:
  - name: db
    port: 3306
    protocol: TCP
    targetPort: db
  - name: prom-http
    port: 56790
    protocol: TCP
    targetPort: prom-http
  selector:
    kubedb.com/kind: MySQL
    kubedb.com/name: mysql-mon-prometheus
  sessionAffinity: None
  type: ClusterIP
status:
  loadBalancer: {}
```

We can see that the service contains these specific annotations. The Prometheus server will discover the exporter using these specifications.

```yaml
prometheus.io/path: ...
prometheus.io/port: ...
prometheus.io/scrape: ...
```

## Deploy and configure Prometheus Server

The Prometheus server is needed to configure so that it can discover endpoints of services. If a Prometheus server is already running in cluster and if it is configured in a way that it can discover service endpoints, no extra configuration will be needed. If there is no existing Prometheus server running, rest of this tutorial will create a Prometheus server with appropriate configuration.

The configuration file to `Prometheus-Server` will be provided by `ConfigMap`. The below config map will be created:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-server-conf
  labels:
    name: prometheus-server-conf
  namespace: demo
data:
  prometheus.yml: |-
    global:
      scrape_interval: 5s
      evaluation_interval: 5s
    scrape_configs:
    - job_name: 'kubernetes-service-endpoints'

      kubernetes_sd_configs:
      - role: endpoints

      relabel_configs:
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scheme]
        action: replace
        target_label: __scheme__
        regex: (https?)
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_service_annotation_prometheus_io_port]
        action: replace
        target_label: __address__
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
      - action: labelmap
        regex: __meta_kubernetes_service_label_(.+)
      - source_labels: [__meta_kubernetes_namespace]
        action: replace
        target_label: kubernetes_namespace
      - source_labels: [__meta_kubernetes_service_name]
        action: replace
        target_label: kubernetes_name
```

```console
$ kubectl create -f https://raw.githubusercontent.com/kubedb/cli/0.8.0-beta.2/docs/examples/monitoring/builtin-prometheus/demo-1.yaml
configmap "prometheus-server-conf" created
```

Now, the below yaml is used to deploy Prometheus in kubernetes :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus-server
  namespace: demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus-server
  template:
    metadata:
      labels:
        app: prometheus-server
    spec:
      containers:
        - name: prometheus
          image: prom/prometheus:v2.1.0
          args:
            - "--config.file=/etc/prometheus/prometheus.yml"
            - "--storage.tsdb.path=/prometheus/"
          ports:
            - containerPort: 9090
          volumeMounts:
            - name: prometheus-config-volume
              mountPath: /etc/prometheus/
            - name: prometheus-storage-volume
              mountPath: /prometheus/
      volumes:
        - name: prometheus-config-volume
          configMap:
            defaultMode: 420
            name: prometheus-server-conf
        - name: prometheus-storage-volume
          emptyDir: {}
```

### In RBAC enabled cluster

If RBAC *is* enabled, Run the following command to deploy prometheus in kubernetes:

```console
$ kubectl create -f https://raw.githubusercontent.com/kubedb/cli/0.8.0-beta.2/docs/examples/monitoring/builtin-prometheus/rbac/demo-2.yaml
clusterrole "prometheus-server" created
serviceaccount "prometheus-server" created
clusterrolebinding "prometheus-server" created
deployment "prometheus-server" created
service "prometheus-service" created

# Verify RBAC stuffs
$ kubectl get clusterroles
NAME                AGE
prometheus-server   57s

$ kubectl get clusterrolebindings
NAME                AGE
prometheus-server   1m


$ kubectl get serviceaccounts -n demo
NAME                SECRETS   AGE
default             1         48m
prometheus-server   1         1m
```

### In RBAC \*not\* enabled cluster

If RBAC *is not* enabled, Run the following command to prepare your cluster for this tutorial:

```console
$ kubectl create -f https://raw.githubusercontent.com/kubedb/cli/0.8.0-beta.2/docs/examples/monitoring/builtin-prometheus/demo-2.yaml
deployment "prometheus-server" created
service "prometheus-service" created


$ kubectl get pods -n demo --watch
NAME                                 READY     STATUS              RESTARTS   AGE
mysql-mon-prometheus-0               2/2       Running             0          2m
prometheus-server-79c7cf44fc-rdrpd   0/1       ContainerCreating   0          8s
prometheus-server-79c7cf44fc-rdrpd   1/1       Running             0          1m
```

### Prometheus Dashboard

Now to open prometheus dashboard on Browser:

```console
$ kubectl get svc -n demo
NAME                   TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)              AGE
kubedb                 ClusterIP      None            <none>        <none>               4m
mysql-mon-prometheus   ClusterIP      10.101.55.20    <none>        3306/TCP,56790/TCP   4m
prometheus-service     LoadBalancer   10.105.89.246   <pending>     9090:30901/TCP       2m


$ minikube ip
192.168.99.100

$ minikube service prometheus-service -n demo --url
http://192.168.99.100:30901
```

Now, open your browser and go to the following URL: _http://{minikube-ip}:{prometheus-svc-nodeport}_ to visit Prometheus Dashboard. According to the above example, this URL will be [http://192.168.99.100:30901](http://192.168.99.100:30901).

Now, if you go the Prometheus Dashboard, you should see that this database endpoint as one of the targets.
![prometheus-builtin](/docs/0.8.0-beta.2/images/mysql/mysql-builtin.png)

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```console
$ kubedb delete my,drmn,snap -n demo --all --force

# In rbac enabled cluster,
# $ kubectl delete clusterrole prometheus-server
# $ kubectl delete clusterrolebindings  prometheus-server
# $ kubectl delete serviceaccounts -n demo  prometheus-server

$ kubectl delete ns demo
namespace "demo" deleted
```

## Next Steps

- Monitor your MySQL database with KubeDB using [out-of-the-box CoreOS Prometheus Operator](/docs/0.8.0-beta.2/guides/mysql/monitoring/using-coreos-prometheus-operator).
- Detail concepts of [MySQL object](/docs/0.8.0-beta.2/concepts/databases/mysql).
- [Snapshot and Restore](/docs/0.8.0-beta.2/guides/mysql/snapshot/backup-and-restore) process of MySQL databases using KubeDB.
- Take [Scheduled Snapshot](/docs/0.8.0-beta.2/guides/mysql/snapshot/scheduled-backup) of MySQL databases using KubeDB.
- Initialize [MySQL with Script](/docs/0.8.0-beta.2/guides/mysql/initialization/using-script).
- Initialize [MySQL with Snapshot](/docs/0.8.0-beta.2/guides/mysql/initialization/using-snapshot).
- Use [private Docker registry](/docs/0.8.0-beta.2/guides/mysql/private-registry/using-private-registry) to deploy MySQL with KubeDB.
- Wondering what features are coming next? Please visit [here](/docs/0.8.0-beta.2/roadmap).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.8.0-beta.2/CONTRIBUTING).
