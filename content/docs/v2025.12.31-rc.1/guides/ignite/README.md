---
title: Ignite
menu:
  docs_v2025.12.31-rc.1:
    identifier: ig-readme-ignite
    name: Ignite
    parent: ignite-guides
    weight: 10
menu_name: docs_v2025.12.31-rc.1
section_menu_id: guides
url: /docs/v2025.12.31-rc.1/guides/ignite/
aliases:
- /docs/v2025.12.31-rc.1/guides/ignite/README/
info:
  autoscaler: v0.45.0-rc.1
  cli: v0.60.0-rc.1
  dashboard: v0.36.0-rc.1
  installer: v2025.12.31-rc.1
  ops-manager: v0.47.0-rc.1
  provisioner: v0.60.0-rc.1
  schema-manager: v0.36.0-rc.1
  ui-server: v0.36.0-rc.1
  version: v2025.12.31-rc.1
  webhook-server: v0.36.0-rc.1
---

> New to KubeDB? Please start [here](/docs/v2025.12.31-rc.1/README).
## Supported Ignite Features

| Features                               | Availability |
| ------------------------------------   | :----------: |
| Clustering                             |   &#10003;   |
| Persistent Volume                      |   &#10003;   |
| Initialize using Script                |   &#10003;   |
| Multiple Ignite Versions               |   &#10003;   |
| Custom Configuration                   |   &#10003;   |
| Externally manageable Auth Secret	     |   &#10003;   |
| Reconfigurable Health Checker		       |   &#10003;   |
| Using Custom docker image              |   &#10003;   |
| Builtin Prometheus Discovery           |   &#10003;   |
| Using Prometheus operator              |   &#10003;   |
| Grafana Dashboard                      |   &#10003;   |
| Alert Dashboard	                       |   &#10003;   |



## Life Cycle of a Ignite Object

<p align="center">
  <img alt="lifecycle"  src="/docs/v2025.12.31-rc.1/images/ignite/ignite-lifecycle.png">
</p>

## User Guide
- [Quickstart Ignite](/docs/v2025.12.31-rc.1/guides/ignite/quickstart/quickstart) with KubeDB Operator.
- Monitor your Ignite server with KubeDB using [out-of-the-box Prometheus operator](/docs/v2025.12.31-rc.1/guides/ignite/monitoring/using-prometheus-operator).
- Monitor your Ignite server with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2025.12.31-rc.1/guides/ignite/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2025.12.31-rc.1/guides/ignite/private-registry/using-private-registry) to deploy Ignite with KubeDB.
- Detail concepts of [Ignite object](/docs/v2025.12.31-rc.1/guides/ignite/concepts/ignite).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.12.31-rc.1/CONTRIBUTING).