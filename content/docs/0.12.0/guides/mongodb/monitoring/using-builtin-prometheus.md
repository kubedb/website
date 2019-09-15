---
title: Monitor MongoDB using Builtin Prometheus Discovery
menu:
  docs_0.12.0:
    identifier: mg-using-builtin-prometheus-monitoring
    name: Builtin Prometheus Discovery
    parent: mg-monitoring-mongodb
    weight: 10
menu_name: docs_0.12.0
section_menu_id: guides
info:
  version: 0.12.0
---

> New to KubeDB? Please start [here](/docs/0.12.0/concepts/README).

# Monitoring MongoDB with builtin Prometheus

This tutorial will show you how to monitor MongoDB database using builtin [Prometheus](https://github.com/prometheus/prometheus) scrapper.

## Before You Begin

- At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [Minikube](https://github.com/kubernetes/minikube).

- Install KubeDB operator in your cluster following the steps [here](/docs/0.12.0/setup/install).

- If you are not familiar with how to configure Prometheus to scrape metrics from various Kubernetes resources, please read the tutorial from [here](https://github.com/appscode/third-party-tools/tree/master/monitoring/prometheus/builtin).

- To learn how Prometheus monitoring works with KubeDB in general, please visit [here](/docs/0.12.0/concepts/database-monitoring/overview).

- To keep Prometheus resources isolated, we are going to use a separate namespace called `monitoring` to deploy respective monitoring resources. We are going to deploy database in `demo` namespace.

  ```console
  $ kubectl create ns monitoring
  namespace/monitoring created

  $ kubectl create ns demo
  namespace/demo created
  ```

> Note: YAML files used in this tutorial are stored in [docs/examples/mongodb](https://github.com/kubedb/cli/tree/0.12.0/docs/examples/mongodb) folder in GitHub repository [kubedb/cli](https://github.com/kubedb/cli).

## Deploy MongoDB with Monitoring Enabled

At first, let's deploy an MongoDB database with monitoring enabled. Below is the MongoDB object that we are going to create.

```yaml
apiVersion: kubedb.com/v1alpha1
kind: MongoDB
metadata:
  name: builtin-prom-mgo
  namespace: demo
spec:
  version: "3.4-v3"
  terminationPolicy: WipeOut
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  monitor:
    agent: prometheus.io/builtin
```

Here,

- `spec.monitor.agent: prometheus.io/builtin` specifies that we are going to monitor this server using builtin Prometheus scrapper.

Let's create the MongoDB crd we have shown above.

```console
$ kubectl apply -f https://raw.githubusercontent.com/kubedb/cli/0.12.0/docs/examples/mongodb/monitoring/builtin-prom-mgo.yaml
mongodb.kubedb.com/builtin-prom-mgo created
```

Now, wait for the database to go into `Running` state.

```console
$ kubectl get mg -n demo builtin-prom-mgo
NAME               VERSION   STATUS    AGE
builtin-prom-mgo   3.4-v3    Running   1m
```

KubeDB will create a separate stats service with name `{MongoDB crd name}-stats` for monitoring purpose.

```console
$ kubectl get svc -n demo --selector="kubedb.com/name=builtin-prom-mgo"
NAME                     TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE
builtin-prom-mgo         ClusterIP   10.99.28.40    <none>        27017/TCP   55s
builtin-prom-mgo-gvr     ClusterIP   None           <none>        27017/TCP   55s
builtin-prom-mgo-stats   ClusterIP   10.98.202.26   <none>        56790/TCP   36s
```

Here, `builtin-prom-mgo-stats` service has been created for monitoring purpose. Let's describe the service.

```console
$ kubectl describe svc -n demo builtin-prom-mgo-stats
Name:              builtin-prom-mgo-stats
Namespace:         demo
Labels:            kubedb.com/kind=MongoDB
                   kubedb.com/name=builtin-prom-mgo
Annotations:       monitoring.appscode.com/agent: prometheus.io/builtin
                   prometheus.io/path: /metrics
                   prometheus.io/port: 56790
                   prometheus.io/scrape: true
Selector:          kubedb.com/kind=MongoDB,kubedb.com/name=builtin-prom-mgo
Type:              ClusterIP
IP:                10.98.202.26
Port:              prom-http  56790/TCP
TargetPort:        prom-http/TCP
Endpoints:         172.17.0.7:56790
Session Affinity:  None
Events:            <none>
```

You can see that the service contains following annotations.

```console
prometheus.io/path: /metrics
prometheus.io/port: 56790
prometheus.io/scrape: true
```

The Prometheus server will discover the service endpoint using these specifications and will scrape metrics from the exporter.

## Configure Prometheus Server

Now, we have to configure a Prometheus scrapping job to scrape the metrics using this service. We are going to configure scrapping job similar to this [kubernetes-service-endpoints](https://github.com/appscode/third-party-tools/tree/master/monitoring/prometheus/builtin#kubernetes-service-endpoints) job that scrapes metrics from endpoints of a service.

Let's configure a Prometheus scrapping job to collect metrics from this service.

```yaml
- job_name: 'kubedb-databases'
  honor_labels: true
  scheme: http
  kubernetes_sd_configs:
  - role: endpoints
  # by default Prometheus server select all kubernetes services as possible target.
  # relabel_config is used to filter only desired endpoints
  relabel_configs:
  # keep only those services that has "prometheus.io/scrape","prometheus.io/path" and "prometheus.io/port" anootations
  - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scrape, __meta_kubernetes_service_annotation_prometheus_io_port]
    separator: ;
    regex: true;(.*)
    action: keep
  # currently KubeDB supported databases uses only "http" scheme to export metrics. so, drop any service that uses "https" scheme.
  - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scheme]
    action: drop
    regex: https
  # only keep the stats services created by KubeDB for monitoring purpose which has "-stats" suffix
  - source_labels: [__meta_kubernetes_service_name]
    separator: ;
    regex: (.*-stats)
    action: keep
  # service created by KubeDB will have "kubedb.com/kind" and "kubedb.com/name" annotations. keep only those services that have these annotations.
  - source_labels: [__meta_kubernetes_service_label_kubedb_com_kind]
    separator: ;
    regex: (.*)
    action: keep
  # read the metric path from "prometheus.io/path: <path>" annotation
  - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_path]
    action: replace
    target_label: __metrics_path__
    regex: (.+)
  # read the port from "prometheus.io/port: <port>" annotation and update scrapping address accordingly
  - source_labels: [__address__, __meta_kubernetes_service_annotation_prometheus_io_port]
    action: replace
    target_label: __address__
    regex: ([^:]+)(?::\d+)?;(\d+)
    replacement: $1:$2
  # add service namespace as label to the scrapped metrics
  - source_labels: [__meta_kubernetes_namespace]
    separator: ;
    regex: (.*)
    target_label: namespace
    replacement: $1
    action: replace
  # add service name as a label to the scrapped metrics
  - source_labels: [__meta_kubernetes_service_name]
    separator: ;
    regex: (.*)
    target_label: service
    replacement: $1
    action: replace
  # add stats service's labels to the scrapped metrics
  - action: labelmap
    regex: __meta_kubernetes_service_label_(.+)
```

### Configure Existing Prometheus Server

If you already have a Prometheus server running, you have to add above scrapping job in the `ConfigMap` used to configure the Prometheus server. Then, you have to restart it for the updated configuration to take effect.

>If you don't use a persistent volume for Prometheus storage, you will lose your previously scrapped data on restart.

### Deploy New Prometheus Server

If you don't have any existing Prometheus server running, you have to deploy one. In this section, we are going to deploy a Prometheus server in `monitoring` namespace to collect metrics using this stats service.

**Create ConfigMap:**

At first, create a ConfigMap with the scrapping configuration. Bellow, the YAML of ConfigMap that we are going to create in this tutorial.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  labels:
    app: prometheus-demo
  namespace: monitoring
data:
  prometheus.yml: |-
    global:
      scrape_interval: 5s
      evaluation_interval: 5s
    scrape_configs:
    - job_name: 'kubedb-databases'
      honor_labels: true
      scheme: http
      kubernetes_sd_configs:
      - role: endpoints
      # by default Prometheus server select all kubernetes services as possible target.
      # relabel_config is used to filter only desired endpoints
      relabel_configs:
      # keep only those services that has "prometheus.io/scrape","prometheus.io/path" and "prometheus.io/port" anootations
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scrape, __meta_kubernetes_service_annotation_prometheus_io_port]
        separator: ;
        regex: true;(.*)
        action: keep
      # currently KubeDB supported databases uses only "http" scheme to export metrics. so, drop any service that uses "https" scheme.
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scheme]
        action: drop
        regex: https
      # only keep the stats services created by KubeDB for monitoring purpose which has "-stats" suffix
      - source_labels: [__meta_kubernetes_service_name]
        separator: ;
        regex: (.*-stats)
        action: keep
      # service created by KubeDB will have "kubedb.com/kind" and "kubedb.com/name" annotations. keep only those services that have these annotations.
      - source_labels: [__meta_kubernetes_service_label_kubedb_com_kind]
        separator: ;
        regex: (.*)
        action: keep
      # read the metric path from "prometheus.io/path: <path>" annotation
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      # read the port from "prometheus.io/port: <port>" annotation and update scrapping address accordingly
      - source_labels: [__address__, __meta_kubernetes_service_annotation_prometheus_io_port]
        action: replace
        target_label: __address__
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
      # add service namespace as label to the scrapped metrics
      - source_labels: [__meta_kubernetes_namespace]
        separator: ;
        regex: (.*)
        target_label: namespace
        replacement: $1
        action: replace
      # add service name as a label to the scrapped metrics
      - source_labels: [__meta_kubernetes_service_name]
        separator: ;
        regex: (.*)
        target_label: service
        replacement: $1
        action: replace
      # add stats service's labels to the scrapped metrics
      - action: labelmap
        regex: __meta_kubernetes_service_label_(.+)
```

Let's create above `ConfigMap`,

```console
$ kubectl apply -f https://raw.githubusercontent.com/kubedb/cli/0.12.0/docs/examples/monitoring/builtin-prometheus/prom-config.yaml
configmap/prometheus-config created
```

**Create RBAC:**

If you are using an RBAC enabled cluster, you have to give necessary RBAC permissions for Prometheus. Let's create necessary RBAC stuffs for Prometheus,

```console
$ kubectl apply -f https://raw.githubusercontent.com/appscode/third-party-tools/master/monitoring/prometheus/builtin/artifacts/rbac.yaml
clusterrole.rbac.authorization.k8s.io/prometheus created
serviceaccount/prometheus created
clusterrolebinding.rbac.authorization.k8s.io/prometheus created
```

>YAML for the RBAC resources created above can be found [here](https://github.com/appscode/third-party-tools/blob/master/monitoring/prometheus/builtin/artifacts/rbac.yaml).

**Deploy Prometheus:**

Now, we are ready to deploy Prometheus server. We are going to use following [deployment](https://github.com/appscode/third-party-tools/blob/master/monitoring/prometheus/builtin/artifacts/deployment.yaml) to deploy Prometheus server.

Let's deploy the Prometheus server.

```console
$ kubectl apply -f https://raw.githubusercontent.com/appscode/third-party-tools/master/monitoring/prometheus/builtin/artifacts/deployment.yaml
deployment.apps/prometheus created
```

### Verify Monitoring Metrics

Prometheus server is listening to port `9090`. We are going to use [port forwarding](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/) to access Prometheus dashboard.

At first, let's check if the Prometheus pod is in `Running` state.

```console
$ kubectl get pod -n monitoring -l=app=prometheus
NAME                          READY   STATUS    RESTARTS   AGE
prometheus-7bd56c6865-8dlpv   1/1     Running   0          28s
```

Now, run following command on a separate terminal to forward 9090 port of `prometheus-7bd56c6865-8dlpv` pod,

```console
$ kubectl port-forward -n monitoring prometheus-7bd56c6865-8dlpv 9090
Forwarding from 127.0.0.1:9090 -> 9090
Forwarding from [::1]:9090 -> 9090
```

Now, we can access the dashboard at `localhost:9090`. Open [http://localhost:9090](http://localhost:9090) in your browser. You should see the endpoint of `builtin-prom-mgo-stats` service as one of the targets.

<p align="center">
  <img alt="Prometheus Target" height="100%" src="/docs/0.12.0/images/mongodb/monitoring/mg-builtin-prom-target.png" style="padding:10px">
</p>

Check the labels marked with red rectangle. These labels confirm that the metrics are coming from `MongoDB` database `builtin-prom-mgo` through stats service `builtin-prom-mgo-stats`.

Now, you can view the collected metrics and create a graph from homepage of this Prometheus dashboard. You can also use this Prometheus server as data source for [Grafana](https://grafana.com/) and create beautiful dashboard with collected metrics.

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run following commands

```console
kubectl delete -n demo mg/builtin-prom-mgo

kubectl delete -n monitoring deployment.apps/prometheus

kubectl delete -n monitoring clusterrole.rbac.authorization.k8s.io/prometheus
kubectl delete -n monitoring serviceaccount/prometheus
kubectl delete -n monitoring clusterrolebinding.rbac.authorization.k8s.io/prometheus

kubectl delete ns demo
kubectl delete ns monitoring
```

## Next Steps

- Learn about [taking instant backup and restore from snapshot](/docs/0.12.0/guides/mongodb/snapshot/backup-and-restore) of MongoDB database using KubeDB.
- Learn how to [schedule backup](/docs/0.12.0/guides/mongodb/snapshot/scheduled-backup)  of MongoDB database.
- Learn about initializing [MongoDB with Snapshot](/docs/0.12.0/guides/mongodb/initialization/using-snapshot).
- Learn how to configure [MongoDB Topology](/docs/0.12.0/guides/mongodb/clustering/topology).
- Monitor your MongoDB database with KubeDB using [`out-of-the-box` CoreOS Prometheus Operator](/docs/0.12.0/guides/mongodb/monitoring/using-coreos-prometheus-operator).
- Use [private Docker registry](/docs/0.12.0/guides/mongodb/private-registry/using-private-registry) to deploy MongoDB with KubeDB.
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.12.0/CONTRIBUTING).
