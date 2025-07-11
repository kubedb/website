---
title: KafkaVersion CRD
menu:
  docs_v2025.5.30:
    identifier: kf-catalog-concepts
    name: KafkaVersion
    parent: kf-concepts-kafka
    weight: 45
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

# KafkaVersion

## What is KafkaVersion

`KafkaVersion` is a Kubernetes `Custom Resource Definitions` (CRD). It provides a declarative configuration to specify the docker images to be used for [Kafka](https://kafka.apache.org) database deployed with KubeDB in a Kubernetes native way.

When you install KubeDB, a `KafkaVersion` custom resource will be created automatically for every supported Kafka versions. You have to specify the name of `KafkaVersion` CR in `spec.version` field of [Kafka](/docs/v2025.5.30/guides/kafka/concepts/kafka) crd. Then, KubeDB will use the docker images specified in the `KafkaVersion` CR to create your expected database.

Using a separate CRD for specifying respective docker images, and pod security policy names allow us to modify the images, and policies independent of KubeDB operator.This will also allow the users to use a custom image for the database.

## KafkaVersion Spec

As with all other Kubernetes objects, a KafkaVersion needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `.spec` section.

```yaml
apiVersion: catalog.kubedb.com/v1alpha1
kind: KafkaVersion
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
  name: 3.9.0
  resourceVersion: "2881"
  uid: 778fb80c-b37a-4ac6-bfaa-fec83e5f49c7
spec:
  connectCluster:
    image: ghcr.io/appscode-images/kafka-connect-cluster:3.9.0
  cruiseControl:
    image: ghcr.io/appscode-images/kafka-cruise-control:3.9.0
  db:
    image: ghcr.io/appscode-images/kafka-kraft:3.9.0
  podSecurityPolicies:
    databasePolicyName: kafka-db
  securityContext:
    runAsUser: 1001
  version: 3.9.0
```

### metadata.name

`metadata.name` is a required field that specifies the name of the `KafkaVersion` CR. You have to specify this name in `spec.version` field of [Kafka](/docs/v2025.5.30/guides/kafka/concepts/kafka) CR.

We follow this convention for naming KafkaVersion CR:

- Name format: `{Original Kafka image version}-{modification tag}`

We use official Apache Kafka release tar files to build docker images for supporting Kafka versions and re-tag the image with v1, v2 etc. modification tag when there's any. An image with higher modification tag will have more features than the images with lower modification tag. Hence, it is recommended to use KafkaVersion CR with the highest modification tag to enjoy the latest features.

### spec.version

`spec.version` is a required field that specifies the original version of Kafka database that has been used to build the docker image specified in `spec.db.image` field.

### spec.deprecated

`spec.deprecated` is an optional field that specifies whether the docker images specified here is supported by the current KubeDB operator.

The default value of this field is `false`. If `spec.deprecated` is set to `true`, KubeDB operator will skip processing this CRD object and will add a event to the CRD object specifying that the DB version is deprecated.

### spec.db.image

`spec.db.image` is a required field that specifies the docker image which will be used to create PetSet by KubeDB operator to create expected Kafka database.

### spec.cruiseControl.image

`spec.cruiseControl.image` is a required field that specifies the docker image which will be used to create Deployment by KubeDB operator to create expected Kafka Cruise Control.

### spec.connectCluster.image

`spec.connectCluster.image` is a required field that specifies the docker image which will be used to create PetSet by KubeDB operator to create expected Kafka Connect Cluster.

<!---
### spec.stash
This holds the Backup & Restore task definitions, where a `TaskRef` has a `Name` & `Params` section. Params specifies a list of parameters to pass to the task.

### spec.upgradeConstraints
UpgradeConstraints specifies the constraints that need to be considered during version upgrade. Here `allowList` contains the versions those are allowed for upgrading from the current version.
An empty list of AllowList indicates all the versions are accepted except the denyList.
On the other hand, `DenyList` contains all the rejected versions for the upgrade request. An empty list indicates no version is rejected.
--->
### spec.podSecurityPolicies.databasePolicyName

`spec.podSecurityPolicies.databasePolicyName` is a required field that specifies the name of the pod security policy required to get the database server pod(s) running.

```bash
helm upgrade -i kubedb oci://ghcr.io/appscode-charts/kubedb \
  --namespace kubedb --create-namespace \
  --set additionalPodSecurityPolicies[0]=custom-db-policy \
  --set additionalPodSecurityPolicies[1]=custom-snapshotter-policy \
  --set-file global.license=/path/to/the/license.txt \
  --wait --burst-limit=10000 --debug
```

## Next Steps

- Learn about Kafka CRD [here](/docs/v2025.5.30/guides/kafka/concepts/kafka).
- Deploy your first Kafka database with KubeDB by following the guide [here](/docs/v2025.5.30/guides/kafka/quickstart/kafka/).
