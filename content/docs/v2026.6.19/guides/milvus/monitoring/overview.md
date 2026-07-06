---
title: Milvus Monitoring Overview
menu:
  docs_v2026.6.19:
    identifier: milvus-monitoring-overview
    name: Overview
    parent: milvus-monitoring
    weight: 10
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

# Monitoring Milvus with KubeDB

KubeDB has native support for monitoring via [Prometheus](https://prometheus.io/). This guide will give you an overview of how monitoring works for a `Milvus` database.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Milvus](/docs/v2026.6.19/guides/milvus/concepts/milvus)

## How Monitoring Works

Milvus components expose Prometheus metrics on port `9091`. KubeDB wires those metrics up for you through `spec.monitor`:

```yaml
spec:
  monitor:
    agent: prometheus.io/operator
    prometheus:
      serviceMonitor:
        labels:
          release: prometheus
        interval: 10s
```

- **`spec.monitor.agent: prometheus.io/operator`** tells KubeDB to integrate with the [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator).
- **`spec.monitor.prometheus.serviceMonitor.labels`** are applied to the generated `ServiceMonitor`. They must match the `serviceMonitorSelector` of your `Prometheus` object so the operator picks it up (here, `release: prometheus`).
- **`spec.monitor.prometheus.serviceMonitor.interval`** sets the scrape interval.

When monitoring is enabled, KubeDB creates:

1. A dedicated **stats `Service`** named `<db>-stats` that exposes the metrics port (`9091`) and carries the `kubedb.com/role: stats` label.
2. A **`ServiceMonitor`** named `<db>-stats` that selects the stats service and scrapes its `metrics` port at `/metrics`.

The Prometheus Operator then reconciles the `ServiceMonitor` into the running Prometheus configuration and begins scraping Milvus metrics.

In the next doc, we will see a step-by-step guide on monitoring a Milvus database using the Prometheus Operator.
