---
title: Connector CRD
menu:
  docs_v2025.5.30:
    identifier: kf-connector-concepts
    name: Connector
    parent: kf-concepts-kafka
    weight: 30
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

# Connector

## What is Connector

`Connector` is a Kubernetes `Custom Resource Definitions` (CRD). It provides declarative configuration for [Connector](https://kafka.apache.org/) in a Kubernetes native way. You only need to describe the desired configuration in a `Connector` object, and the KubeDB operator will create Kubernetes objects in the desired state for you.

## Connector Spec

As with all other Kubernetes objects, a Connector needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `.spec` section. Below is an example Connector object.

```yaml
apiVersion: kafka.kubedb.com/v1alpha1
kind: Connector
metadata:
  name: mongodb-source-connector
  namespace: demo
spec:
  configSecret:
    name: mongodb-source-config
  connectClusterRef:
    name: connectcluster-quickstart
    namespace: demo
  deletionPolicy: WipeOut
```

### spec.configSecret

`spec.configSecret` is a required field that specifies the name of the secret containing the configuration for the Connector. The secret should contain a key `config.properties` which contains the configuration for the Connector.
```yaml
spec:
  configSecret:
    name: <config-secret-name>
```

### spec.connectClusterRef

`spec.connectClusterRef` is a required field that specifies the name and namespace of the `ConnectCluster` object that the `Connector` object is associated with. This is an appbinding reference for `ConnectCluster` object.
```yaml
spec:
  connectClusterRef:
    name: <connectcluster-appbinding-name>
    namespace: <connectcluster-appbinding-namespace>
```

### spec.deletionPolicy

`spec.deletionPolicy` gives flexibility whether to `nullify`(reject) the delete operation of `Connector` CR or which resources KubeDB should keep or delete when you delete `Connector` CR. KubeDB provides following three deletion policies:

- Delete
- DoNotTerminate
- WipeOut

When `deletionPolicy` is `DoNotTerminate`, KubeDB takes advantage of `ValidationWebhook` feature in Kubernetes 1.9.0 or later clusters to implement `DoNotTerminate` feature. If admission webhook is enabled, `DoNotTerminate` prevents users from deleting the resource as long as the `spec.deletionPolicy` is set to `DoNotTerminate`.

Deletion policy `WipeOut` will delete the connector from the ConnectCluster when the Connector CR is deleted and `Delete` keep the connector after deleting the Connector CR.

## Next Steps

- Learn how to use KubeDB to run Apache Kafka cluster [here](/docs/v2025.5.30/guides/kafka/quickstart/kafka/).
- Learn how to use KubeDB to run Apache Kafka Connect cluster [here](/docs/v2025.5.30/guides/kafka/connectcluster/quickstart).
- Detail concepts of [KafkaConnectorVersion object](/docs/v2025.5.30/guides/kafka/concepts/kafkaconnectorversion).
- Learn to use KubeDB managed Kafka objects using [CLIs](/docs/v2025.5.30/guides/kafka/cli/cli).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.5.30/CONTRIBUTING).
