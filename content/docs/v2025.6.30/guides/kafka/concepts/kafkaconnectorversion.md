---
title: KafkaConnectorVersion CRD
menu:
  docs_v2025.6.30:
    identifier: kf-kafkaconnectorversion-concepts
    name: KafkaConnectorVersion
    parent: kf-concepts-kafka
    weight: 50
menu_name: docs_v2025.6.30
section_menu_id: guides
info:
  autoscaler: v0.41.0
  cli: v0.56.0
  dashboard: v0.32.0
  installer: v2025.6.30
  ops-manager: v0.43.0
  provisioner: v0.56.0
  schema-manager: v0.32.0
  ui-server: v0.32.0
  version: v2025.6.30
  webhook-server: v0.32.0
---

> New to KubeDB? Please start [here](/docs/v2025.6.30/README).

# KafkaConnectorVersion

## What is KafkaConnectorVersion

`KafkaConnectorVersion` is a Kubernetes `Custom Resource Definitions` (CRD). It provides a declarative configuration to specify the docker images to be used for install Connector plugins to ConnectCluster worker node with KubeDB in a Kubernetes native way.

When you install KubeDB, a `KafkaConnectorVersion` custom resource will be created automatically for every supported Kafka Connector versions. You have to specify list of `KafkaConnectorVersion` CR names in `spec.connectorPlugins` field of [ConnectCluster](/docs/v2025.6.30/guides/kafka/concepts/kafka) cr. Then, KubeDB will use the docker images specified in the `KafkaConnectorVersion` cr to install your connector plugins.

Using a separate CR for specifying respective docker images and policies independent of KubeDB operator. This will also allow the users to use a custom image for the connector plugins.

## KafkaConnectorVersion Spec

As with all other Kubernetes objects, a KafkaVersion needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `.spec` section.

```yaml
apiVersion: catalog.kubedb.com/v1alpha1
kind: KafkaConnectorVersion
metadata:
  annotations:
    meta.helm.sh/release-name: kubedb
    meta.helm.sh/release-namespace: kubedb
  creationTimestamp: "2024-05-02T06:38:17Z"
  generation: 1
  labels:
    app.kubernetes.io/instance: kubedb
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/name: kubedb-catalog
    app.kubernetes.io/version: v2024.4.27
    helm.sh/chart: kubedb-catalog-v2024.4.27
  name: mongodb-1.14.1
  resourceVersion: "2873"
  uid: a5808f31-9d27-4979-8a7d-f3357dbba6ba
spec:
  connectorPlugin:
    image: ghcr.io/appscode-images/kafka-connector-mongodb:1.14.1
  securityContext:
    runAsUser: 1001
  type: MongoDB
  version: 1.14.1
```

### metadata.name

`metadata.name` is a required field that specifies the name of the `KafkaConnectorVersion` CR. You have to specify this name in `spec.connectorPlugins` field of ConnectCluster CR.

We follow this convention for naming KafkaConnectorVersion CR:

- Name format: `{Plugin-Type}-{version}`

### spec.version

`spec.version` is a required field that specifies the original version of Connector plugin that has been used to build the docker image specified in `spec.connectorPlugin.image` field.

### spec.deprecated

`spec.deprecated` is an optional field that specifies whether the docker images specified here is supported by the current KubeDB operator.

The default value of this field is `false`. If `spec.deprecated` is set to `true`, KubeDB operator will skip processing this CRD object and will add a event to the CRD object specifying that the DB version is deprecated.

### spec.connectorPlugin.image

`spec.connectorPlugin.image` is a required field that specifies the docker image which will be used to install connector plugin by KubeDB operator.

```bash
helm upgrade -i kubedb oci://ghcr.io/appscode-charts/kubedb \
  --namespace kubedb --create-namespace \
  --set additionalPodSecurityPolicies[0]=custom-db-policy \
  --set additionalPodSecurityPolicies[1]=custom-snapshotter-policy \
  --set-file global.license=/path/to/the/license.txt \
  --wait --burst-limit=10000 --debug
```

## Next Steps

- Learn about Kafka CRD [here](/docs/v2025.6.30/guides/kafka/concepts/kafka).
- Learn about ConnectCluster CRD [here](/docs/v2025.6.30/guides/kafka/concepts/connectcluster).
- Deploy your first ConnectCluster with KubeDB by following the guide [here](/docs/v2025.6.30/guides/kafka/connectcluster/quickstart).
