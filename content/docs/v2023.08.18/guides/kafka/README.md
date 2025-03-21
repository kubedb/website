---
title: Kafka
menu:
  docs_v2023.08.18:
    identifier: kf-readme-kafka
    name: Kafka
    parent: kf-kafka-guides
    weight: 10
menu_name: docs_v2023.08.18
section_menu_id: guides
url: /docs/v2023.08.18/guides/kafka/
aliases:
- /docs/v2023.08.18/guides/kafka/README/
info:
  autoscaler: v0.20.0
  cli: v0.35.0
  dashboard: v0.11.0
  installer: v2023.08.18
  ops-manager: v0.22.0
  provisioner: v0.35.0
  schema-manager: v0.11.0
  ui-server: v0.11.0
  version: v2023.08.18
  webhook-server: v0.11.0
---

> New to KubeDB? Please start [here](/docs/v2023.08.18/README).

## Supported Kafka Features


| Features                                                       | Community | Enterprise |
|----------------------------------------------------------------|:---------:|:----------:|
| Clustering - Combined (shared controller and broker nodes)     | &#10003;  |  &#10003;  |
| Clustering - Topology (dedicated controllers and broker nodes) | &#10003;  |  &#10003;  |
| Custom Docker Image                                            | &#10003;  |  &#10003;  |
| Authentication & Authorization                                 | &#10003;  |  &#10003;  |
| Persistent Volume                                              | &#10003;  |  &#10003;  |
| Custom Volume                                                  | &#10003;  |  &#10003;  |
| TLS: using ( [Cert Manager](https://cert-manager.io/docs/) )   | &#10007;  |  &#10003;  |
| Reconfigurable Health Checker                                  | &#10003;  |  &#10003;  |
| Externally manageable Auth Secret                              | &#10003;  |  &#10003;  |
| Monitoring with Prometheus & Grafana                           | &#10003;  |  &#10003;  |

## Supported Kafka Versions

KubeDB supports The following Kafka versions. Supported version are applicable for Kraft mode or Zookeeper-less releases:
- `3.3.0`
- `3.3.2`
- `3.4.0`

> The listed KafkaVersions are tested and provided as a part of the installation process (ie. catalog chart), but you are open to create your own [KafkaVersion](/docs/v2023.08.18/guides/kafka/concepts/catalog) object with your custom Kafka image.

## Lifecycle of Kafka Object

<!---
ref : https://cacoo.com/diagrams/4PxSEzhFdNJRIbIb/0281B
--->

<p align="center">
<img alt="lifecycle"  src="/docs/v2023.08.18/images/kafka/Kafka-CRD-Lifecycle.png">
</p>

## User Guide 
- [Quickstart Kafka](/docs/v2023.08.18/guides/kafka/quickstart/overview/) with KubeDB Operator.
- Kafka Clustering supported by KubeDB
  - [Combined Clustering](/docs/v2023.08.18/guides/kafka/clustering/combined-cluster/)
  - [Topology Clustering](/docs/v2023.08.18/guides/kafka/clustering/topology-cluster/)
- Use [kubedb cli](/docs/v2023.08.18/guides/kafka/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Kafka object](/docs/v2023.08.18/guides/kafka/concepts/kafka).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2023.08.18/CONTRIBUTING).