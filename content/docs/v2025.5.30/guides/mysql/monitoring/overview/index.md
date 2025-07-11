---
title: MySQL Monitoring Overview
description: MySQL Monitoring Overview
menu:
  docs_v2025.5.30:
    identifier: guides-mysql-monitoring-overview
    name: Overview
    parent: guides-mysql-monitoring
    weight: 10
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

# Monitoring MySQL with KubeDB

KubeDB has native support for monitoring via [Prometheus](https://prometheus.io/). You can use builtin [Prometheus](https://github.com/prometheus/prometheus) scraper or [Prometheus operator](https://github.com/prometheus-operator/prometheus-operator) to monitor KubeDB managed databases. This tutorial will show you how database monitoring works with KubeDB and how to configure Database crd to enable monitoring.

## Overview

KubeDB uses Prometheus [exporter](https://prometheus.io/docs/instrumenting/exporters/#databases) images to export Prometheus metrics for respective databases. Following diagram shows the logical flow of database monitoring with KubeDB.

<p align="center">
  <img alt="Database Monitoring Flow"  src="/docs/v2025.5.30/guides/mysql/monitoring/overview/images/database-monitoring-overview.svg">
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

A sample YAML for MySQL crd with `spec.monitor` section configured to enable monitoring with [Prometheus operator](https://github.com/prometheus-operator/prometheus-operator) is shown below.

```yaml
apiVersion: kubedb.com/v1
kind: MySQL
metadata:
  name: prom-operator-mysql
  namespace: demo
spec:
  version: "8.0.35"
  deletionPolicy: WipeOut
  storage:
    storageClassName: "standard"
    accessModes:
      - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
  monitor:
    agent: prometheus.io/operator
    prometheus:
      serviceMonitor:
        labels:
          release: prometheus
        interval: 10s

```

Assume that above Redis is configured to use basic authentication. So, exporter image also need to provide password to collect metrics. We have provided it through `spec.monitor.args` field.

Here, we have specified that we are going to monitor this server using Prometheus operator through `spec.monitor.agent: prometheus.io/operator`. KubeDB will create a `ServiceMonitor` crd in `monitoring` namespace and this `ServiceMonitor` will have `release: prometheus` label.

## Next Steps

- Learn how to monitor Elasticsearch database with KubeDB using [builtin-Prometheus](/docs/v2025.5.30/guides/elasticsearch/monitoring/using-builtin-prometheus) and using [Prometheus operator](/docs/v2025.5.30/guides/elasticsearch/monitoring/using-prometheus-operator).
- Learn how to monitor PostgreSQL database with KubeDB using [builtin-Prometheus](/docs/v2025.5.30/guides/postgres/monitoring/using-builtin-prometheus) and using [Prometheus operator](/docs/v2025.5.30/guides/postgres/monitoring/using-prometheus-operator).
- Learn how to monitor MySQL database with KubeDB using [builtin-Prometheus](/docs/v2025.5.30/guides/mysql/monitoring/builtin-prometheus/) and using [Prometheus operator](/docs/v2025.5.30/guides/mysql/monitoring/prometheus-operator/).
- Learn how to monitor MongoDB database with KubeDB using [builtin-Prometheus](/docs/v2025.5.30/guides/mongodb/monitoring/using-builtin-prometheus) and using [Prometheus operator](/docs/v2025.5.30/guides/mongodb/monitoring/using-prometheus-operator).
- Learn how to monitor Redis server with KubeDB using [builtin-Prometheus](/docs/v2025.5.30/guides/redis/monitoring/using-builtin-prometheus) and using [Prometheus operator](/docs/v2025.5.30/guides/redis/monitoring/using-prometheus-operator).
- Learn how to monitor Memcached server with KubeDB using [builtin-Prometheus](/docs/v2025.5.30/guides/memcached/monitoring/using-builtin-prometheus) and using [Prometheus operator](/docs/v2025.5.30/guides/memcached/monitoring/using-prometheus-operator).
