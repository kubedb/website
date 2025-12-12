---
title: Cassandra
menu:
  docs_v2025.12.9-rc.0:
    identifier: cas-readme-cassandra
    name: Cassandra
    parent: cas-cassandra-guides
    weight: 10
menu_name: docs_v2025.12.9-rc.0
section_menu_id: guides
url: /docs/v2025.12.9-rc.0/guides/cassandra/
aliases:
- /docs/v2025.12.9-rc.0/guides/cassandra/README/
info:
  autoscaler: v0.45.0-rc.0
  cli: v0.60.0-rc.0
  dashboard: v0.36.0-rc.0
  installer: v2025.12.9-rc.0
  ops-manager: v0.47.0-rc.0
  provisioner: v0.60.0-rc.0
  schema-manager: v0.36.0-rc.0
  ui-server: v0.36.0-rc.0
  version: v2025.12.9-rc.0
  webhook-server: v0.36.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2025.12.9-rc.0/README).

# Overview 

Apache Cassandra is a highly scalable, distributed NoSQL database designed to handle large amounts of data across many servers, offering high availability and no single point of failure. It's known for its ability to handle massive data loads with high performance, making it suitable for applications like social media, financial services, and IoT platforms.
## Supported Cassandra Features

| Features                                                      | Availability |
|---------------------------------------------------------------|:------------:|
| Clustering                                                    |   &#10003;   |
| Custom Configuration                                          |   &#10003;   |
| Backup/Recovery                                               |   &#10003;   |
| Monitoring using Prometheus and Grafana                       |   &#10003;   |
| Builtin Prometheus Discovery                                  |   &#10003;   |
| Operator managed Prometheus Discovery                         |   &#10003;   |
| Authentication & Authorization (TLS)                          |   &#10003;   |
| Externally manageable Auth Secret                             |   &#10003;   |
| Persistent volume                                             |   &#10003;   |
| Grafana Dashboards (Alerts and Monitoring)                    |   &#10003;   |
| Automated Version Update                                      |   &#10003;   |
| Automated Vertical Scaling                                    |   &#10003;   |
| Automated Horizontal Scaling                                  |   &#10003;   |
| Automated Volume Expansion                                    |   &#10003;   |
| Autoscaling ( Compute resources & Storage )                   |   &#10003;   |
| Reconfigurable TLS Certificates (Add, Remove, Rotate, Update) |   &#10003;   |

## Supported Cassandra Versions

KubeDB supports the following Cassandra Versions.
- `4.1.8`
- `5.0.3`

## Life Cycle of a Cassandra Object

<!---
ref : https://cacoo.com/diagrams/4PxSEzhFdNJRIbIb/0281B
--->

<p text-align="center">
    <img alt="lifecycle"  src="/docs/v2025.12.9-rc.0/images/cassandra/lifecycle.png" >
</p>

## User Guide

- [Quickstart Cassandra](/docs/v2025.12.9-rc.0/guides/cassandra/quickstart/guide/quickstart) with KubeDB Operator.
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.12.9-rc.0/CONTRIBUTING).