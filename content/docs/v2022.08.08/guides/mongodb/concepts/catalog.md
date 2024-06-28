---
title: MongoDBVersion CRD
menu:
  docs_v2022.08.08:
    identifier: mg-catalog-concepts
    name: MongoDBVersion
    parent: mg-concepts-mongodb
    weight: 15
menu_name: docs_v2022.08.08
section_menu_id: guides
info:
  autoscaler: v0.13.0
  cli: v0.28.0
  dashboard: v0.4.0
  installer: v2022.08.08
  ops-manager: v0.15.0
  provisioner: v0.28.0
  schema-manager: v0.4.0
  ui-server: v0.4.0
  version: v2022.08.08
  webhook-server: v0.4.0
---

> New to KubeDB? Please start [here](/docs/v2022.08.08/README).

# MongoDBVersion

## What is MongoDBVersion

`MongoDBVersion` is a Kubernetes `Custom Resource Definitions` (CRD). It provides a declarative configuration to specify the docker images to be used for [MongoDB](https://www.mongodb.com/) database deployed with KubeDB in a Kubernetes native way.

When you install KubeDB, a `MongoDBVersion` custom resource will be created automatically for every supported MongoDB versions. You have to specify the name of `MongoDBVersion` crd in `spec.version` field of [MongoDB](/docs/v2022.08.08/guides/mongodb/concepts/mongodb) crd. Then, KubeDB will use the docker images specified in the `MongoDBVersion` crd to create your expected database.

Using a separate crd for specifying respective docker images, and pod security policy names allow us to modify the images, and policies independent of KubeDB operator.This will also allow the users to use a custom image for the database.

## MongoDBVersion Spec

As with all other Kubernetes objects, a MongoDBVersion needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `.spec` section.

```yaml
apiVersion: catalog.kubedb.com/v1alpha1
kind: MongoDBVersion
metadata:
  name: "4.2.3"
  labels:
    app: kubedb
spec:
  version: "4.2.3"
  deprecated: false
  db:
    image: "${KUBEDB_DOCKER_REGISTRY}/mongo:4.2.3"
  exporter:
    image: "${KUBEDB_DOCKER_REGISTRY}/percona-mongodb-exporter:v0.8.0"
  initContainer:
    image: "${KUBEDB_DOCKER_REGISTRY}/mongodb-init:4.2-v1"
  podSecurityPolicies:
    databasePolicyName: mongodb-db
  replicationModeDetector:
    image: "${KUBEDB_DOCKER_REGISTRY}/replication-mode-detector:v0.3.2"
```

### metadata.name

`metadata.name` is a required field that specifies the name of the `MongoDBVersion` crd. You have to specify this name in `spec.version` field of [MongoDB](/docs/v2022.08.08/guides/mongodb/concepts/mongodb) crd.

We follow this convention for naming MongoDBVersion crd:

- Name format: `{Original MongoDB image verion}-{modification tag}`

We modify original MongoDB docker image to support MongoDB clustering and re-tag the image with v1, v2 etc. modification tag. An image with higher modification tag will have more features than the images with lower modification tag. Hence, it is recommended to use MongoDBVersion crd with highest modification tag to enjoy the latest features.

### spec.version

`spec.version` is a required field that specifies the original version of MongoDB database that has been used to build the docker image specified in `spec.db.image` field.

### spec.deprecated

`spec.deprecated` is an optional field that specifies whether the docker images specified here is supported by the current KubeDB operator. For example, we have modified `kubedb/mongo:3.6` docker image to support MongoDB clustering and re-tagged as `kubedb/mongo:3.6-v1`. So, we have marked `kubedb/mongo:3.6` as deprecated for KubeDB `0.9.0-rc.0`.

The default value of this field is `false`. If `spec.deprecated` is set to `true`, KubeDB operator will skip processing this CRD object and will add a event to the CRD object specifying that the DB version is deprecated.

### spec.db.image

`spec.db.image` is a required field that specifies the docker image which will be used to create Statefulset by KubeDB operator to create expected MongoDB database.

### spec.exporter.image

`spec.exporter.image` is a required field that specifies the image which will be used to export Prometheus metrics.

### spec.tools.image

`spec.tools.image` is a required field that specifies the image which will be used to take backup and initialize database from a snapshot.

### spec.podSecurityPolicies.databasePolicyName

`spec.podSecurityPolicies.databasePolicyName` is a required field that specifies the name of the pod security policy required to get the database server pod(s) running.

```bash
helm upgrade kubedb-operator appscode/kubedb --namespace kube-system \
  --set additionalPodSecurityPolicies[0]=custom-db-policy \
  --set additionalPodSecurityPolicies[1]=custom-snapshotter-policy
```

## Next Steps

- Learn about MongoDB crd [here](/docs/v2022.08.08/guides/mongodb/concepts/mongodb).
- Deploy your first MongoDB database with KubeDB by following the guide [here](/docs/v2022.08.08/guides/mongodb/quickstart/quickstart).
