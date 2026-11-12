---
title: HanaDB Prometheus Operator
menu:
  docs_v2026.6.19:
    identifier: guides-hanadb-monitoring-operator
    name: Prometheus Operator
    parent: guides-hanadb-monitoring
    weight: 20
menu_name: docs_v2026.6.19
section_menu_id: guides
info:
  autoscaler: v0.50.0
  cli: v0.65.0
  dashboard: v0.41.0
  installer: v2026.6.19
  ops-manager: v0.52.0
  product: kubedb
  provisioner: v0.65.0
  schema-manager: v0.41.0
  ui-server: v0.41.0
  version: v2026.6.19
  webhook-server: v0.41.0
---

> New to KubeDB? Please start [here](/docs/v2026.6.19/README).

# Monitoring HanaDB with Prometheus Operator

This guide deploys a HanaDB with the `prometheus.io/operator` agent so the
[Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) discovers it through a
`ServiceMonitor`.

> Note: The YAML files used in this tutorial are stored in [docs/examples/hanadb/monitoring](https://github.com/kubedb/docs/tree/{{< param "info.version" >}}/docs/examples/hanadb/monitoring) folder in the GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Before You Begin

- Install the KubeDB Provisioner and Ops-manager operators following the steps [here](/docs/v2026.6.19/setup/README).
- Install the [Prometheus Operator](https://github.com/prometheus-operator/kube-prometheus-stack) and
  note the label its `Prometheus` uses to select `ServiceMonitor`s (often `release: prometheus`):

```bash
$ kubectl get prometheus -n monitoring -o jsonpath='{.items[0].spec.serviceMonitorSelector}'; echo
{}
```

> An empty `serviceMonitorSelector` (`{}`) means this Prometheus selects **all** `ServiceMonitor`s in the
> namespaces it watches. If your Prometheus uses a non-empty selector, set
> `spec.monitor.prometheus.serviceMonitor.labels` to match it (the `release: prometheus` label below is a
> common convention for the kube-prometheus-stack chart).

## Deploy a HanaDB with Prometheus Operator Monitoring

```yaml
apiVersion: kubedb.com/v1alpha2
kind: HanaDB
metadata:
  name: hanadb-prometheus-operator
  namespace: demo
spec:
  version: "2.0.82"
  replicas: 1
  storageType: Durable
  storage:
    storageClassName: local-path
    accessModes: ["ReadWriteOnce"]
    resources:
      requests:
        storage: 64Gi
  deletionPolicy: WipeOut
  monitor:
    agent: prometheus.io/operator
    prometheus:
      exporter:
        port: 9668
      serviceMonitor:
        labels:
          release: prometheus
        interval: 10s
```

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/hanadb/monitoring/prometheus-operator.yaml
hanadb.kubedb.com/hanadb-prometheus-operator created
```

Wait until the database is `Ready`.

## Verify the ServiceMonitor

KubeDB creates a `ServiceMonitor` carrying the `release: prometheus` label so the operator's Prometheus
selects it:

```bash
$ kubectl get servicemonitor -n demo -l app.kubernetes.io/instance=hanadb-prometheus-operator
NAME                               AGE
hanadb-prometheus-operator-stats   17m

$ kubectl get servicemonitor -n demo hanadb-prometheus-operator-stats \
  -o jsonpath='port={.spec.endpoints[0].port} interval={.spec.endpoints[0].interval}{"\n"}selector={.spec.selector.matchLabels}{"\n"}'
port=metrics interval=10s
selector={"app.kubernetes.io/instance":"hanadb-prometheus-operator","app.kubernetes.io/managed-by":"kubedb.com","app.kubernetes.io/name":"hanadbs.kubedb.com","kubedb.com/role":"stats"}
```

Once Prometheus reloads, the HanaDB target appears in its **Status → Targets** page.

## Cleaning Up

```bash
$ kubectl delete hanadb.kubedb.com -n demo hanadb-prometheus-operator
$ kubectl delete ns demo
```

## Next Steps

- [Monitor with builtin Prometheus](/docs/v2026.6.19/guides/hanadb/monitoring/using-builtin-prometheus).
- Review the [HanaDB CRD](/docs/v2026.6.19/guides/hanadb/concepts/hanadb).
