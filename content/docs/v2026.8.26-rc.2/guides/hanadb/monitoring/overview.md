---
title: HanaDB Monitoring Overview
menu:
  docs_v2026.8.26-rc.2:
    identifier: guides-hanadb-monitoring-overview
    name: Overview
    parent: guides-hanadb-monitoring
    weight: 10
menu_name: docs_v2026.8.26-rc.2
section_menu_id: guides
info:
  autoscaler: v0.52.0-rc.2
  cli: v0.67.0-rc.2
  dashboard: v0.43.0-rc.2
  installer: v2026.8.26-rc.2
  ops-manager: v0.54.0-rc.2
  product: kubedb
  provisioner: v0.67.0-rc.2
  schema-manager: v0.43.0-rc.2
  ui-server: v0.43.0-rc.2
  version: v2026.8.26-rc.2
  webhook-server: v0.43.0-rc.2
---

> New to KubeDB? Please start [here](/docs/v2026.8.26-rc.2/README).

# Monitoring HanaDB

KubeDB exposes Prometheus metrics for HanaDB through a bundled
[hanadb_exporter](https://github.com/kubedb/hanadb-exporter) sidecar. You enable it through the
`spec.monitor` field of the `HanaDB` object.

## How it works

When `spec.monitor` is set, KubeDB adds an `exporter` container to the database pods and a `<db>-stats`
Service that exposes the metrics endpoint (default port `9668`, path `/metrics`). Two agents are
supported:

- `prometheus.io/builtin` — annotates the stats Service so a Prometheus server that scrapes by
  annotation discovers the target. See [Using Builtin Prometheus](/docs/v2026.8.26-rc.2/guides/hanadb/monitoring/using-builtin-prometheus).
- `prometheus.io/operator` — creates a `ServiceMonitor` for the
  [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator). See
  [Using Prometheus Operator](/docs/v2026.8.26-rc.2/guides/hanadb/monitoring/using-prometheus-operator).

## The spec.monitor field

```yaml
spec:
  monitor:
    agent: prometheus.io/operator   # or prometheus.io/builtin
    prometheus:
      exporter:
        port: 9668
      serviceMonitor:
        labels:
          release: prometheus
        interval: 10s
```

- `spec.monitor.agent` selects the monitoring agent.
- `spec.monitor.prometheus.exporter.port` is the exporter port (`9668`).
- `spec.monitor.prometheus.serviceMonitor.labels` must match the `serviceMonitorSelector` of your
  Prometheus Operator instance (commonly `release: prometheus`).

## Next Steps

- [Using Builtin Prometheus](/docs/v2026.8.26-rc.2/guides/hanadb/monitoring/using-builtin-prometheus).
- [Using Prometheus Operator](/docs/v2026.8.26-rc.2/guides/hanadb/monitoring/using-prometheus-operator).
