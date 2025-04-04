---
title: Kafka
menu:
  docs_v2025.3.20-rc.1:
    identifier: kf-readme-kafka
    name: Kafka
    parent: kf-kafka-guides
    weight: 10
menu_name: docs_v2025.3.20-rc.1
section_menu_id: guides
url: /docs/v2025.3.20-rc.1/guides/kafka/
aliases:
- /docs/v2025.3.20-rc.1/guides/kafka/README/
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

## Supported Kafka Features

| Features                                                                           | Kafka    | ConnectCluster |
|------------------------------------------------------------------------------------|----------|----------------|
| Clustering - Combined (shared controller and broker nodes)                         | &#10003; | &#45;          |
| Clustering - Topology (dedicated controllers and broker nodes)                     | &#10003; | &#45;          |
| Custom Configuration                                                               | &#10003; | &#10003;       |
| Automated Version Update                                                           | &#10003; | &#10007;       |
| Automatic Vertical Scaling                                                         | &#10003; | &#10007;       |
| Automated Horizontal Scaling                                                       | &#10003; | &#10007;       |
| Automated Volume Expansion                                                         | &#10003; | &#45;          |
| Custom Docker Image                                                                | &#10003; | &#10003;       |
| Authentication & Authorization                                                     | &#10003; | &#10003;       |
| TLS: Add, Remove, Update, Rotate ( [Cert Manager](https://cert-manager.io/docs/) ) | &#10003; | &#10003;       |
| Reconfigurable Health Checker                                                      | &#10003; | &#10003;       |
| Externally manageable Auth Secret                                                  | &#10003; | &#10003;       |
| Pre-Configured JMX Exporter for Metrics                                            | &#10003; | &#10003;       |
| Monitoring with Prometheus & Grafana                                               | &#10003; | &#10003;       |
| Autoscaling (vertically, volume)	                                                  | &#10003; | &#10007;       |
| Custom Volume                                                                      | &#10003; | &#10003;       |
| Persistent Volume                                                                  | &#10003; | &#45;          |
| Connectors                                                                         | &#45;    | &#10003;       |

## Lifecycle of Kafka Object

<!---
ref : https://cacoo.com/diagrams/4PxSEzhFdNJRIbIb/0281B
--->

<p align="center">
<img alt="lifecycle"  src="/docs/v2025.3.20-rc.1/images/kafka/kafka-crd-lifecycle.png">
</p>

## Lifecycle of ConnectCluster Object

<p align="center">
<img alt="lifecycle"  src="/docs/v2025.3.20-rc.1/images/kafka/connectcluster/connectcluster-crd-lifecycle.png">
</p>

## Supported Kafka Versions

KubeDB supports The following Kafka versions. Supported version are applicable for Kraft mode or Zookeeper-less releases:
- `3.5.2`
- `3.6.1`
- `3.7.2`
- `3.8.1`
- `3.9.0`

> The listed KafkaVersions are tested and provided as a part of the installation process (ie. catalog chart), but you are open to create your own [KafkaVersion](/docs/v2025.3.20-rc.1/guides/kafka/concepts/kafkaversion) object with your custom Kafka image.

## Supported KafkaConnector Versions

| Connector Plugin     | Type   | Version     | Connector Class                                            |
|----------------------|--------|-------------|------------------------------------------------------------|
| mongodb-1.13.1       | Source | 1.13.1      | com.mongodb.kafka.connect.MongoSourceConnector             |
| mongodb-1.13.1       | Sink   | 1.13.1      | com.mongodb.kafka.connect.MongoSinkConnector               |
| mongodb-1.14.1       | Source | 1.14.1      | com.mongodb.kafka.connect.MongoSourceConnector             |
| mongodb-1.14.1       | Sink   | 1.14.1      | com.mongodb.kafka.connect.MongoSinkConnector               |
| mysql-2.7.4.final    | Source | 2.7.4.Final | io.debezium.connector.mysql.MySqlConnector                 |
| mysql-3.0.5.final    | Source | 3.0.5.Final | io.debezium.connector.mysql.MySqlConnector                 |
| postgres-2.7.4.final | Source | 2.7.4.Final | io.debezium.connector.postgresql.PostgresConnector         |
| postgres-3.0.5.final | Source | 3.0.5.Final | io.debezium.connector.postgresql.PostgresConnector         |
| jdbc-2.6.1.final     | Sink   | 2.6.1.Final | io.debezium.connector.jdbc.JdbcSinkConnector               |
| jdbc-2.7.4.final     | Sink   | 2.7.4.Final | io.debezium.connector.jdbc.JdbcSinkConnector               |
| jdbc-3.0.5.final     | Sink   | 3.0.5.Final | io.debezium.connector.jdbc.JdbcSinkConnector               |
| s3-2.15.0            | Sink   | 2.15.0      | io.aiven.kafka.connect.s3.AivenKafkaConnectS3SinkConnector |
| gcs-0.13.0           | Sink   | 0.13.0      | io.aiven.kafka.connect.gcs.GcsSinkConnector                |


## User Guide 
- [Quickstart Kafka](/docs/v2025.3.20-rc.1/guides/kafka/quickstart/kafka/) with KubeDB Operator.
- [Quickstart ConnectCluster](/docs/v2025.3.20-rc.1/guides/kafka/connectcluster/quickstart) with KubeDB Operator.
- Kafka Clustering supported by KubeDB
  - [Combined Clustering](/docs/v2025.3.20-rc.1/guides/kafka/clustering/combined-cluster/)
  - [Topology Clustering](/docs/v2025.3.20-rc.1/guides/kafka/clustering/topology-cluster/)
- Monitor your Kafka database with KubeDB using [out-of-the-box Prometheus and Grafana](/docs/v2025.3.20-rc.1/guides/kafka/monitoring/using-prometheus-operator).
- Use [kubedb cli](/docs/v2025.3.20-rc.1/guides/kafka/cli/cli) to manage databases like kubectl for Kubernetes.
- Detail concepts of [Kafka object](/docs/v2025.3.20-rc.1/guides/kafka/concepts/kafka).
- Detail concepts of [ConnectCluster object](/docs/v2025.3.20-rc.1/guides/kafka/concepts/connectcluster).
- Detail concepts of [Connector object](/docs/v2025.3.20-rc.1/guides/kafka/concepts/connector).
- Detail concepts of [KafkaVersion object](/docs/v2025.3.20-rc.1/guides/kafka/concepts/kafkaversion).
- Detail concepts of [KafkaConnectorVersion object](/docs/v2025.3.20-rc.1/guides/kafka/concepts/kafkaconnectorversion).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.3.20-rc.1/CONTRIBUTING).