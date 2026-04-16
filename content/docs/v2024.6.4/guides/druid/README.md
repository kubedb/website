---
title: Druid
menu:
  docs_v2024.6.4:
    identifier: dr-readme-druid
    name: Druid
    parent: dr-druid-guides
    weight: 10
menu_name: docs_v2024.6.4
section_menu_id: guides
url: /docs/v2024.6.4/guides/druid/
aliases:
- /docs/v2024.6.4/guides/druid/README/
info:
  autoscaler: v0.31.0
  cli: v0.46.0
  dashboard: v0.22.0
  installer: v2024.6.4
  ops-manager: v0.33.0
  provisioner: v0.46.0
  schema-manager: v0.22.0
  ui-server: v0.22.0
  version: v2024.6.4
  webhook-server: v0.22.0
---

> New to KubeDB? Please start [here](/docs/v2024.6.4/README).

## Supported Druid Features


| Features                             | Availability |
|--------------------------------------|:------------:|
| Clustering                           |   &#10003;   |
| Authentication & Authorization       |   &#10003;   |
| Custom Configuration                 |   &#10003;   |
| Monitoring with Prometheus & Grafana |   &#10003;   |
| Builtin Prometheus Discovery         |   &#10003;   |
| Using Prometheus operator            |   &#10003;   |
| Externally manageable Auth Secret    |   &#10003;   |
| Reconfigurable Health Checker        |   &#10003;   |
| Persistent volume                    |   &#10003;   | 
| Dashboard ( Druid Web Console )      |   &#10003;   |

## Supported Druid Versions

KubeDB supports The following Druid versions.
- `28.0.1`

> The listed DruidVersions are tested and provided as a part of the installation process (ie. catalog chart), but you are open to create your own [DruidVersion](/docs/v2024.6.4/guides/druid/concepts/catalog) object with your custom Druid image.

## Lifecycle of Druid Object

<!---
ref : https://cacoo.com/diagrams/bbB63L6KRIbPLl95/9A5B0
--->

<p align="center">
<img alt="lifecycle"  src="/docs/v2024.6.4/images/druid/Druid-CRD-Lifecycle.png">
</p>

## User Guide 
- [Quickstart Druid](/docs/v2024.6.4/guides/druid/quickstart/overview/) with KubeDB Operator.

[//]: # (- Druid Clustering supported by KubeDB)

[//]: # (  - [Topology Clustering]&#40;/docs/guides/druid/clustering/topology-cluster/index.md&#41;)

[//]: # (- Use [kubedb cli]&#40;/docs/guides/druid/cli/cli.md&#41; to manage databases like kubectl for Kubernetes.)

- Detail concepts of [Druid object](/docs/v2024.6.4/guides/druid/concepts/druid).

[//]: # (- Want to hack on KubeDB? Check our [contribution guidelines]&#40;/docs/CONTRIBUTING.md&#41;.)