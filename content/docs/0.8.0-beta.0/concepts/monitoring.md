---
title: Monitoring
menu:
  docs_0.8.0-beta.0:
    identifier: monitoring-concepts
    name: Monitoring
    parent: concepts
    weight: 18
menu_name: docs_0.8.0-beta.0
section_menu_id: concepts
info:
  version: 0.8.0-beta.0
---

> New to KubeDB? Please start [here](/docs/0.8.0-beta.0/guides/README).

# Monitoring KubeDB

KubeDB has native support for monitoring via Prometheus.

## Monitoring KubeDB Operator
KubeDB operator exposes Prometheus native monitoring data via `/metrics` endpoint on `:56790` port. You can setup a [CoreOS Prometheus ServiceMonitor](https://github.com/coreos/prometheus-operator) using `kubedb-operator` service. To change the port, use `--address` flag on KubeDB operator.

## Monitoring Databases
KubeDB operator can create [service monitors](https://coreos.com/operators/prometheus/docs/latest/user-guides/running-exporters.html#create-a-matching-servicemonitor) for database pods.
If enabled, a __side-car exporter pod__ is run with database pods to expose Prometheus ready metrics via the following endpoints on port `:56790`:

- `/kubedb.com/v1beta1/namespaces/:ns/(postgreses|elastics)/:name/metrics`: Scrape this endpoint to monitor database.

First deploy Prometheus operator so that Prometheus CRD groups are registered. Then, to monitor KubeDB databases by Prometheus, set following fields in `spec.monitor.prometheus`:

```yaml
spec:
  monitor:
    agent: coreos-prometheus-operator
    prometheus:
      namespace: default
      labels:
        app: kubedb-exporter
      interval: 10s
```

|  Keys                               |  Value |  Description                                                                                                |
|-------------------------------------|--------|-------------------------------------------------------------------------------------------------------------|
| `spec.monitor.agent`                | string | `Required`. Indicates the monitoring agent used. Only valid value currently is `coreos-prometheus-operator` |
| `spec.monitor.prometheus.namespace` | string | `Required`. Indicates namespace where service monitors are created. This must be the same namespace of the Prometheus instance. |
| `spec.monitor.prometheus.labels`    | map    | `Required`. Indicates labels applied to service monitor.                                                    |
| `spec.monitor.prometheus.interval`  | string | `Optional`. Indicates the scrape interval for database exporter endpoint (eg, '10s')                        |

__Known Limitations:__ If the databse password is updated, exporter must be restarted to use the new credentials. This issue is tracked [here](https://github.com/kubedb/project/issues/53).


## Next Steps
- Thinking about monitoring your database? KubeDB works [out-of-the-box with Prometheus](/docs/0.8.0-beta.0/guides/monitoring).
- Learn how to use KubeDB to run a PostgreSQL database [here](/docs/0.8.0-beta.0/guides/postgres/overview).
- Learn how to use KubeDB to run an Elasticsearch database [here](/docs/0.8.0-beta.0/guides/elasticsearch/overview).
- Wondering what features are coming next? Please visit [here](/docs/0.8.0-beta.0/roadmap).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/0.8.0-beta.0/CONTRIBUTING).
