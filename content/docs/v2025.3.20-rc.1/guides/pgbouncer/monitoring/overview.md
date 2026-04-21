---
title: PgBouncer Monitoring Overview
description: PgBouncer Monitoring Overview
menu:
  docs_v2025.3.20-rc.1:
    identifier: pb-monitoring-overview
    name: Overview
    parent: pb-monitoring-pgbouncer
    weight: 10
menu_name: docs_v2025.3.20-rc.1
section_menu_id: guides
info:
  autoscaler: v0.37.0-rc.1
  cli: v0.53.0-rc.1
  dashboard: v0.29.0-rc.1
  installer: v2025.3.20-rc.1
  ops-manager: v0.39.0-rc.1
  provisioner: v0.53.0-rc.1
  schema-manager: v0.29.0-rc.1
  ui-server: v0.29.0-rc.1
  version: v2025.3.20-rc.1
  webhook-server: v0.29.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2025.3.20-rc.1/README).

# Monitoring PgBouncer with KubeDB

KubeDB has native support for monitoring via [Prometheus](https://prometheus.io/). You can use builtin [Prometheus](https://github.com/prometheus/prometheus) scraper or [Prometheus operator](https://github.com/prometheus-operator/prometheus-operator) to monitor KubeDB managed databases. This tutorial will show you how database monitoring works with KubeDB and how to configure Database crd to enable monitoring.

## Overview

KubeDB uses Prometheus [exporter](https://prometheus.io/docs/instrumenting/exporters/#databases) images to export Prometheus metrics for respective databases. Following diagram shows the logical flow of database monitoring with KubeDB.

<p align="center">
  <img alt="Database Monitoring Flow"  src="/docs/v2025.3.20-rc.1/images/concepts/monitoring/database-monitoring-overview.svg">
</p>

When a user creates a database crd with `spec.monitor` section configured, KubeDB operator provisions the respective database and injects an exporter image as sidecar to the database pod. It also creates a dedicated stats service with name `{database-crd-name}-stats` for monitoring. Prometheus server can scrape metrics using this stats service.

## Configure Monitoring

In order to enable monitoring for a database, you have to configure `spec.monitor` section. KubeDB provides following options to configure `spec.monitor` section:

|                Field                               |    Type    |                                                                                     Uses                                                       |
| -------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `spec.monitor.agent`                               | `Required` | Type of the monitoring agent that will be used to monitor this database. It can be `prometheus.io/builtin` or `prometheus.io/operator`. |
| `spec.monitor.prometheus.exporter.port`            | `Optional` | Port number where the exporter side car will serve metrics.                                                                                    |
| `spec.monitor.prometheus.exporter.args`            | `Optional` | Arguments to pass to the exporter sidecar.                                                                                                     |
| `spec.monitor.prometheus.exporter.env`             | `Optional` | List of environment variables to set in the exporter sidecar container.                                                                        |
| `spec.monitor.prometheus.exporter.resources`       | `Optional` | Resources required by exporter sidecar container.                                                                                              |
| `spec.monitor.prometheus.exporter.securityContext` | `Optional` | Security options the exporter should run with.                                                                                                 |
| `spec.monitor.prometheus.serviceMonitor.labels`    | `Optional` | Labels for `ServiceMonitor` crd.                                                                                                               |
| `spec.monitor.prometheus.serviceMonitor.interval`  | `Optional` | Interval at which metrics should be scraped.                                                                                                   |

## Sample Configuration

A sample YAML for PgBouncer crd with `spec.monitor` section configured to enable monitoring with [Prometheus operator](https://github.com/prometheus-operator/prometheus-operator) is shown below.

```yaml
apiVersion: kubedb.com/v1
kind: PgBouncer
metadata:
  name: pb
  namespace: demo
spec:
  replicas: 2
  version: "1.18.0"
  database:
    syncUsers: true
    databaseName: "postgres"
    databaseRef:
      name: "pg"
      namespace: demo
  connectionPool:
    poolMode: session
    port: 5432
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
        securityContext:
          runAsUser: 70
          allowPrivilegeEscalation: false
```

Here, we have specified that we are going to monitor this server using Prometheus operator through `spec.monitor.agent: prometheus.io/operator`. KubeDB will create a `ServiceMonitor` crd in databases namespace and this `ServiceMonitor` will have `release: prometheus` label.

## Next Steps

- Learn how to monitor PgBouncer database with KubeDB using [builtin-Prometheus](/docs/v2025.3.20-rc.1/guides/pgbouncer/monitoring/using-builtin-prometheus)
- Learn how to monitor PgBouncer database with KubeDB using [Prometheus operator](/docs/v2025.3.20-rc.1/guides/pgbouncer/monitoring/using-prometheus-operator).

