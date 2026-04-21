---
title: RabbitMQ
menu:
  docs_v2024.7.3-rc.0:
    identifier: guides-rabbitmq-readme
    name: RabbitMQ
    parent: guides-rabbitmq
    weight: 10
menu_name: docs_v2024.7.3-rc.0
section_menu_id: guides
url: /docs/v2024.7.3-rc.0/guides/rabbitmq/
aliases:
- /docs/v2024.7.3-rc.0/guides/rabbitmq/README/
info:
  cli: v0.47.0-rc.0
  dashboard: v0.23.0-rc.0
  installer: v2024.7.3-rc.0
  provisioner: v0.47.0-rc.0
  schema-manager: v0.23.0-rc.0
  ui-server: v0.23.0-rc.0
  version: v2024.7.3-rc.0
  webhook-server: v0.23.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2024.7.3-rc.0/README).

# Overview 

RabbitMQ is a robust and flexible open-source message broker software that facilitates communication between distributed applications. It implements the Advanced Message Queuing Protocol (AMQP) standard, ensuring reliable messaging across various platforms and languages. With its support for multiple messaging protocols and delivery patterns, RabbitMQ enables seamless integration and scalability for modern microservices architectures. It provides features such as message persistence, clustering, and high availability, making it a preferred choice for handling asynchronous communication and decoupling components in enterprise systems.

## Supported RabbitMQ Features

| Features                                           | Availability |
|----------------------------------------------------|:------------:|
| Clustering                                         |   &#10003;   |
| Authentication & Authorization                     |   &#10003;   |
| Custom Configuration                               |   &#10003;   |
| Monitoring using Prometheus and Grafana            |   &#10003;   |
| Builtin Prometheus Discovery                       |   &#10003;   |
| Using Prometheus operator                          |   &#10003;   |
| Externally manageable Auth Secret                  |   &#10003;   |
| Reconfigurable Health Checker                      |   &#10003;   |
| Persistent volume                                  |   &#10003;   | 
| Dashboard ( Management UI )                        |   &#10003;   |
| Grafana Dashboards (Alerts and Monitoring)         |   &#10003;   |
| Custom Plugin configurations                       |   &#10003;   |
| Pre-Enabled utility plugins ( Shovel, Federation ) |   &#10003;   |
| Automatic Vertical Scaling                         |   &#10003;   |
| Automatic Volume Expansion                         |   &#10003;   |
| Autoscaling ( Compute resources & Storage )        |   &#10003;   |


## Supported RabbitMQ Versions

KubeDB supports the following RabbitMQ Versions.
- `3.12.12`

## Life Cycle of a RabbitMQ Object

<!---
ref : https://cacoo.com/diagrams/4PxSEzhFdNJRIbIb/0281B
--->

<p text-align="center">
    <img alt="lifecycle"  src="/docs/v2024.7.3-rc.0/guides/rabbitmq/images/rabbitmq-lifecycle.png" >
</p>

## User Guide

- [Quickstart RabbitMQ](/docs/v2024.7.3-rc.0/guides/rabbitmq/quickstart/quickstart) with KubeDB Operator.
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2024.7.3-rc.0/CONTRIBUTING).