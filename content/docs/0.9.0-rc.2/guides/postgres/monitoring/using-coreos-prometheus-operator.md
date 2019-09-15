---
title: Monitor PostgreSQL using Coreos Prometheus Operator
menu:
  docs_0.9.0-rc.2:
    identifier: pg-using-coreos-prometheus-operator-monitoring
    name: Coreos Prometheus Operator
    parent: pg-monitoring-postgres
    weight: 15
menu_name: docs_0.9.0-rc.2
section_menu_id: guides
info:
  version: 0.9.0-rc.2
---

> New to KubeDB? Please start [here](/docs/0.9.0-rc.2/concepts/README).

# Using Prometheus (CoreOS operator) with KubeDB

This tutorial will show you how to monitor PostgreSQL using Prometheus via [CoreOS Prometheus Operator](https://github.com/coreos/prometheus-operator).

## Before You Begin

At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [minikube](https://github.com/kubernetes/minikube).

Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/0.9.0-rc.2/setup/install).

To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial.

```console
$ kubectl create ns demo
namespace "demo" created
```

> Note: Yaml files used in this tutorial are stored in [docs/examples/postgres](https://github.com/kubedb/cli/tree/master/docs/examples/postgres) folder in GitHub repository [kubedb/cli](https://github.com/kubedb/cli).

This tutorial assumes that you are familiar with PostgreSQL concept.

## Deploy CoreOS-Prometheus Operator

Run the following command to deploy CoreOS-Prometheus operator.

```console
$ kubectl create -f https://raw.githubusercontent.com/kubedb/cli/0.9.0-rc.2/docs/examples/monitoring/coreos-operator/demo-0.yaml
namespace/demo created
clusterrole.rbac.authorization.k8s.io/prometheus-operator created
serviceaccount/prometheus-operator created
clusterrolebinding.rbac.authorization.k8s.io/prometheus-operator created
deployment.extensions/prometheus-operator created
```

Wait for running the Deployment’s Pods.

```console
$ kubectl get pods -n demo
NAME                                   READY     STATUS    RESTARTS   AGE
prometheus-operator-857455484c-7xwxt   1/1       Running   0          2m
```

This CoreOS-Prometheus operator will create some supported Custom Resource Definition (CRD).

```console
$ kubectl get crd
NAME                                          CREATED AT
...
alertmanagers.monitoring.coreos.com           2018-09-24T12:42:22Z
prometheuses.monitoring.coreos.com            2018-09-24T12:42:22Z
servicemonitors.monitoring.coreos.com         2018-09-24T12:42:22Z
...
```

Once the Prometheus operator CRDs are registered, run the following command to create a Prometheus.

```console
$ kubectl create -f https://raw.githubusercontent.com/kubedb/cli/0.9.0-rc.2/docs/examples/monitoring/coreos-operator/demo-1.yaml
clusterrole.rbac.authorization.k8s.io/prometheus created
serviceaccount/prometheus created
clusterrolebinding.rbac.authorization.k8s.io/prometheus created
prometheus.monitoring.coreos.com/prometheus created
service/prometheus created
```

Verify RBAC stuffs

```console
$ kubectl get clusterroles
NAME                      AGE
...
prometheus                42s
prometheus-operator       4m
...
```

```console
$ kubectl get clusterrolebindings
NAME                      AGE
...
prometheus                1m
prometheus-operator       5m
...
```

### Prometheus Dashboard

Now open prometheus dashboard on browser by running `minikube service prometheus -n demo`.

Or you can get the URL of `prometheus` Service by running following command

```console
$ minikube service prometheus -n demo --url
http://192.168.99.100:30900
```

If you are not using minikube, browse prometheus dashboard using following address `http://{Node's ExternalIP}:{NodePort of prometheus-service}`.

## Find out required label for ServiceMonitor

First, check created objects of `Prometheus` kind.

```console
$ kubectl get prometheus --all-namespaces
NAMESPACE   NAME         AGE
demo        prometheus   20m
```

Now if we see the full spec of `prometheus` of `Prometheus` kind, we will see a field called `serviceMonitorSelector`. The value of `matchLabels` under `serviceMonitorSelector` part, is the required label for `KubeDB` monitoring spec `monitor.prometheus.labels`.

```yaml
 $ kubectl get prometheus -n demo prometheus -o yaml
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  creationTimestamp: 2018-11-15T10:40:57Z
  generation: 1
  name: prometheus
  namespace: demo
  resourceVersion: "1661"
  selfLink: /apis/monitoring.coreos.com/v1/namespaces/demo/prometheuses/prometheus
  uid: ef59e6e6-e8c2-11e8-8e44-08002771fd7b
spec:
  resources:
    requests:
      memory: 400Mi
  serviceAccountName: prometheus
  serviceMonitorSelector:
    matchLabels:
      app: kubedb
  version: v1.7.0
```

In this tutorial, the required label is `app: kubedb`.

## Monitor PostgreSQL with CoreOS Prometheus

```yaml
apiVersion: kubedb.com/v1alpha1
kind: Postgres
metadata:
  name: coreos-prom-postgres
  namespace: demo
spec:
  version: "9.6-v1"
  storage:
    storageClassName: "standard"
    accessModes:
    - ReadWriteOnce
    resources:
      requests:
        storage: 50Mi
  monitor:
    agent: prometheus.io/coreos-operator
    prometheus:
      namespace: demo
      labels:
        app: kubedb
      interval: 10s
```

Here,

- `monitor.agent` indicates the monitoring agent. Currently only valid value currently is `coreos-prometheus-operator`
- `monitor.prometheus` specifies the information for monitoring by prometheus
  - `prometheus.namespace` specifies the namespace where ServiceMonitor is created.
  - `prometheus.labels` specifies the labels applied to ServiceMonitor.
  - `prometheus.port` indicates the port for PostgreSQL exporter endpoint (default is `56790`)
  - `prometheus.interval` indicates the scraping interval (eg, '10s')

Now create PostgreSQL with monitoring spec

```console
$ kubectl create -f https://raw.githubusercontent.com/kubedb/cli/0.9.0-rc.2/docs/examples/postgres/monitoring/coreos-prom-postgres.yaml
postgres.kubedb.com/coreos-prom-postgres created
```

KubeDB operator will create a ServiceMonitor object once the PostgreSQL is successfully running.

```console
$ kubectl get servicemonitor -n demo
NAME                               AGE
kubedb-demo-coreos-prom-postgres   23s
```

Now, if you go the Prometheus Dashboard, you should see that this database endpoint as one of the targets.

<p align="center">
  <kbd>
    <img alt="prometheus-builtin"  src="/docs/0.9.0-rc.2/images/postgres/coreos-prom-postgres.png">
  </kbd>
</p>

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```console
$ kubectl patch -n demo pg/coreos-prom-postgres -p '{"spec":{"terminationPolicy":"WipeOut"}}' --type="merge"
$ kubectl delete -n demo pg/coreos-prom-postgres

$ kubectl delete clusterrolebindings prometheus-operator  prometheus
$ kubectl delete clusterrole prometheus-operator prometheus

$ kubectl delete ns demo
```

## Next Steps

- Monitor your PostgreSQL database with KubeDB using [built-in Prometheus](/docs/0.9.0-rc.2/guides/postgres/monitoring/using-builtin-prometheus).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.9.0-rc.2/CONTRIBUTING).
