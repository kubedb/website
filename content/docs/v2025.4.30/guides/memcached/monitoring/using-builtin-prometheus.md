---
title: Monitor Memcached using Builtin Prometheus Discovery
menu:
  docs_v2025.4.30:
    identifier: mc-using-builtin-prometheus-monitoring
    name: Builtin Prometheus
    parent: mc-monitoring-memcached
    weight: 20
menu_name: docs_v2025.4.30
section_menu_id: guides
info:
  autoscaler: v0.39.0
  cli: v0.54.0
  dashboard: v0.30.0
  installer: v2025.4.30
  ops-manager: v0.41.0
  provisioner: v0.54.0
  schema-manager: v0.30.0
  ui-server: v0.30.0
  version: v2025.4.30
  webhook-server: v0.30.0
---

> New to KubeDB? Please start [here](/docs/v2025.4.30/README).

# Monitoring Memcached with builtin Prometheus

This tutorial will show you how to monitor Memcached server using builtin [Prometheus](https://github.com/prometheus/prometheus) scraper.z

## Before You Begin

- At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

- Install KubeDB operator in your cluster following the steps [here](/docs/v2025.4.30/setup/README).

- If you are not familiar with how to configure Prometheus to scrape metrics from various Kubernetes resources, please read the tutorial from [here](https://github.com/appscode/third-party-tools/tree/master/monitoring/prometheus/builtin).

- To learn how Prometheus monitoring works with KubeDB in general, please visit [here](/docs/v2025.4.30/guides/memcached/monitoring/overview).

- To keep Prometheus resources isolated, we are going to use a separate namespace called `monitoring` to deploy respective monitoring resources. We are going to deploy database in `demo` namespace.

  ```bash
  $ kubectl create ns monitoring
  namespace/monitoring created

  $ kubectl create ns demo
  namespace/demo created
  ```

> Note: YAML files used in this tutorial are stored in [docs/examples/memcached](https://github.com/kubedb/docs/tree/{{< param "info.version" >}}/docs/examples/memcached) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Deploy Memcached server with Monitoring Enabled

At first, let's deploy a Memcached server with monitoring enabled. Below is the Memcached object that we are going to create.

```yaml
apiVersion: kubedb.com/v1
kind: Memcached
metadata:
  name: builtin-prom-memcd
  namespace: demo
spec:
  replicas: 1
  version: "1.6.22"
  deletionPolicy: WipeOut
  podTemplate:
    spec:
      containers:
      - name: memcached
        resources:
          limits:
            cpu: 500m
            memory: 256Mi
          requests:
            cpu: 500m
            memory: 256Mi
  monitor:
    agent: prometheus.io/operator
    prometheus:
      serviceMonitor:
        labels:
          release: prometheus
      exporter:
        resources:
          requests:
            memory: 512Mi
            cpu: 200m
          limits:
            memory: 512Mi
            cpu: 250m
```

Here,

- `spec.monitor.agent: prometheus.io/builtin` specifies that we are going to monitor this server using builtin Prometheus scraper.

Let's create the Memcached crd we have shown above.

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/memcached/monitoring/builtin-prom-memcd.yaml
memcached.kubedb.com/builtin-prom-memcd created
```

Now, wait for the database to go into `Ready` state.

```bash
$ kubectl get mc -n demo builtin-prom-memcd
NAME                 VERSION    STATUS    AGE
builtin-prom-memcd   1.6.22     Ready     30s
```

KubeDB will create a separate stats service with name `{Memcached crd name}-stats` for monitoring purpose.

```bash
$ kubectl get svc -n demo --selector="app.kubernetes.io/instance=builtin-prom-memcd"
NAME                       TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)     AGE
builtin-prom-memcd         ClusterIP   10.96.168.132   <none>        11211/TCP   20s
builtin-prom-memcd-pods    ClusterIP   None            <none>        11211/TCP   20s
builtin-prom-memcd-stats   ClusterIP   10.96.40.60     <none>        56790/TCP   20s
```

Here, `builtin-prom-memcd-stats` service has been created for monitoring purpose. Let's describe the service.

```bash
$ kubectl describe svc -n demo builtin-prom-memcd-stats
Name:              builtin-prom-memcd-stats
Namespace:         demo
Labels:            app.kubernetes.io/component=database
                   app.kubernetes.io/instance=builtin-prom-memcd
                   app.kubernetes.io/managed-by=kubedb.com
                   app.kubernetes.io/name=memcacheds.kubedb.com
                   kubedb.com/role=stats
Annotations:       monitoring.appscode.com/agent: prometheus.io/operator
Selector:          app.kubernetes.io/instance=builtin-prom-memcd,app.kubernetes.io/managed-by=kubedb.com,app.kubernetes.io/name=memcacheds.kubedb.com
Type:              ClusterIP
IP Family Policy:  SingleStack
IP Families:       IPv4
IP:                10.96.40.60
IPs:               10.96.40.60
Port:              metrics  56790/TCP
TargetPort:        metrics/TCP
Endpoints:         10.244.0.186:56790
Session Affinity:  None
Events:            <none>
```

You can see that the service contains following annotations.

```bash
prometheus.io/path: /metrics
prometheus.io/port: 56790
prometheus.io/scrape: true
```

The Prometheus server will discover the service endpoint using these specifications and will scrape metrics from the exporter.

## Configure Prometheus Server

Now, we have to configure a Prometheus scraping job to scrape the metrics using this service. We are going to configure scraping job similar to this [kubernetes-service-endpoints](https://github.com/appscode/third-party-tools/tree/master/monitoring/prometheus/builtin#kubernetes-service-endpoints) job that scrapes metrics from endpoints of a service.

Let's configure a Prometheus scraping job to collect metrics from this service.

```yaml
- job_name: 'kubedb-databases'
  kubernetes_sd_configs:
  - role: endpoints
  # by default Prometheus server select all Kubernetes services as possible target.
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
  # service created by KubeDB will have "app.kubernetes.io/name" and "app.kubernetes.io/instance" annotations. keep only those services that have these annotations.
  - source_labels: [__meta_kubernetes_service_label_app_kubernetes_io_name]
    separator: ;
    regex: (.*)
    action: keep
  # read the metric path from "prometheus.io/path: <path>" annotation
  - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_path]
    action: replace
    target_label: __metrics_path__
    regex: (.+)
  # read the port from "prometheus.io/port: <port>" annotation and update scraping address accordingly
  - source_labels: [__address__, __meta_kubernetes_service_annotation_prometheus_io_port]
    action: replace
    target_label: __address__
    regex: ([^:]+)(?::\d+)?;(\d+)
    replacement: $1:$2
  - action: labelmap
    regex: __meta_kubernetes_service_label_(.+)
  # add service namespace as label to the scraped metrics
  - source_labels: [__meta_kubernetes_namespace]
    action: replace
    target_label: kubernetes_namespace
  # add service name as label to the scraped metrics
  - source_labels: [__meta_kubernetes_service_name]
    action: replace
    target_label: kubernetes_name
```

### Configure Existing Prometheus Server

If you already have a Prometheus server running, you have to add above scraping job in the `ConfigMap` used to configure the Prometheus server. Then, you have to restart it for the updated configuration to take effect.

>If you don't use a persistent volume for Prometheus storage, you will lose your previously scraped data on restart.

### Deploy New Prometheus Server

If you don't have any existing Prometheus server running, you have to deploy one. In this section, we are going to deploy a Prometheus server in `monitoring` namespace to collect metrics using this stats service.

**Create ConfigMap:**

At first, create a ConfigMap with the scraping configuration. Bellow, the YAML of ConfigMap that we are going to create in this tutorial.

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
      # by default Prometheus server select all Kubernetes services as possible target.
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
      # service created by KubeDB will have "app.kubernetes.io/name" and "app.kubernetes.io/instance" annotations. keep only those services that have these annotations.
      - source_labels: [__meta_kubernetes_service_label_app_kubernetes_io_name]
        separator: ;
        regex: (.*)
        action: keep
      # read the metric path from "prometheus.io/path: <path>" annotation
      - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      # read the port from "prometheus.io/port: <port>" annotation and update scraping address accordingly
      - source_labels: [__address__, __meta_kubernetes_service_annotation_prometheus_io_port]
        action: replace
        target_label: __address__
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
      # add service namespace as label to the scraped metrics
      - source_labels: [__meta_kubernetes_namespace]
        separator: ;
        regex: (.*)
        target_label: namespace
        replacement: $1
        action: replace
      # add service name as a label to the scraped metrics
      - source_labels: [__meta_kubernetes_service_name]
        separator: ;
        regex: (.*)
        target_label: service
        replacement: $1
        action: replace
      # add stats service's labels to the scraped metrics
      - action: labelmap
        regex: __meta_kubernetes_service_label_(.+)
```

Let's create above `ConfigMap`,

```bash
$ kubectl apply -f kubectl apply -f https://github.com/kubedb/docs/raw/v2024.8.21/docs/examples/monitoring/builtin-prometheus/prom-config.yaml
configmap/prometheus-config created
```

**Create RBAC:**

If you are using an RBAC enabled cluster, you have to give necessary RBAC permissions for Prometheus. Let's create necessary RBAC stuffs for Prometheus,

```bash
$ kubectl apply -f https://github.com/appscode/third-party-tools/raw/master/monitoring/prometheus/builtin/artifacts/rbac.yaml
clusterrole.rbac.authorization.k8s.io/prometheus created
serviceaccount/prometheus created
clusterrolebinding.rbac.authorization.k8s.io/prometheus created
```

>YAML for the RBAC resources created above can be found [here](https://github.com/appscode/third-party-tools/blob/master/monitoring/prometheus/builtin/artifacts/rbac.yaml).

**Deploy Prometheus:**

Now, we are ready to deploy Prometheus server. We are going to use following [deployment](https://github.com/appscode/third-party-tools/blob/master/monitoring/prometheus/builtin/artifacts/deployment.yaml) to deploy Prometheus server.

Let's deploy the Prometheus server.

```bash
$ kubectl apply -f https://github.com/appscode/third-party-tools/raw/master/monitoring/prometheus/builtin/artifacts/deployment.yaml
deployment.apps/prometheus created
```

### Verify Monitoring Metrics

Prometheus server is listening to port `9090`. We are going to use [port forwarding](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/) to access Prometheus dashboard.

At first, let's check if the Prometheus pod is in `Running` state.

```bash
$ kubectl get pod -n monitoring -l=app=prometheus
NAME                          READY   STATUS    RESTARTS   AGE
prometheus-d64b668fb-4jq99    1/1     Running   0          77s
```

Now, run following command on a separate terminal to forward 9090 port of `prometheus-d64b668fb-4jq99` pod,

```bash
$ kubectl port-forward -n monitoring prometheus-d64b668fb-4jq99 9090
Forwarding from 127.0.0.1:9090 -> 9090
Forwarding from [::1]:9090 -> 9090
```

Now, we can access the dashboard at `localhost:9090`. Open [http://localhost:9090](http://localhost:9090) in your browser. You should see the endpoints of `builtin-prom-memcd-stats` service as targets.

<p align="center">
  <img alt="Prometheus Target" height="100%" src="/docs/v2025.4.30/images/memcached/monitoring/mc-builtin-prom-target.png" style="padding:10px">
</p>

Check the labels marked with red rectangle. These labels confirm that the metrics are coming from `Memcached` server `builtin-prom-memcd` through stats service `builtin-prom-memcd-stats`.

Now, you can view the collected metrics and create a graph from homepage of this Prometheus dashboard. You can also use this Prometheus server as data source for [Grafana](https://grafana.com/) and create beautiful dashboard with collected metrics.

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run following commands

```bash
$ kubectl delete -n demo mc/builtin-prom-memcd

$ kubectl delete -n monitoring deployment.apps/prometheus

$ kubectl delete -n monitoring clusterrole.rbac.authorization.k8s.io/prometheus
$ kubectl delete -n monitoring serviceaccount/prometheus
$ kubectl delete -n monitoring clusterrolebinding.rbac.authorization.k8s.io/prometheus

$ kubectl delete ns demo
$ kubectl delete ns monitoring
```

## Next Steps

- Monitor your Memcached server with KubeDB using [`out-of-the-box` Prometheus operator](/docs/v2025.4.30/guides/memcached/monitoring/using-prometheus-operator).
- Use [private Docker registry](/docs/v2025.4.30/guides/memcached/private-registry/using-private-registry) to deploy Memcached with KubeDB.
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.4.30/CONTRIBUTING).
