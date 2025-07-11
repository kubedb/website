---
title: DruidVersion CRD
menu:
  docs_v2025.6.30:
    identifier: guides-druid-concepts-druidversion
    name: DruidVersion
    parent: guides-druid-concepts
    weight: 30
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

# DruidVersion

## What is DruidVersion

`DruidVersion` is a Kubernetes `Custom Resource Definitions` (CRD). It provides a declarative configuration to specify the docker images to be used for [Druid](https://druid.apache.org) database deployed with KubeDB in a Kubernetes native way.

When you install KubeDB, a `DruidVersion` custom resource will be created automatically for every supported Druid versions. You have to specify the name of `DruidVersion` CR in `spec.version` field of [Druid](/docs/v2025.6.30/guides/druid/concepts/druid) crd. Then, KubeDB will use the docker images specified in the `DruidVersion` CR to create your expected database.

Using a separate CRD for specifying respective docker images, and pod security policy names allow us to modify the images, and policies independent of KubeDB operator.This will also allow the users to use a custom image for the database.

## DruidVersion Spec

As with all other Kubernetes objects, a DruidVersion needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `.spec` section.

```yaml
apiVersion: catalog.kubedb.com/v1alpha1
kind: DruidVersion
metadata:
  annotations:
    meta.helm.sh/release-name: kubedb
    meta.helm.sh/release-namespace: kubedb
  creationTimestamp: "2024-10-16T13:10:10Z"
  generation: 1
  labels:
    app.kubernetes.io/instance: kubedb
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/name: kubedb-catalog
    app.kubernetes.io/version: v2024.9.30
    helm.sh/chart: kubedb-catalog-v2024.9.30
  name: 28.0.1
  resourceVersion: "42125"
  uid: e30e23aa-febc-4029-8be7-993afaff1fc6
spec:
  db:
    image: ghcr.io/appscode-images/druid:28.0.1
  initContainer:
    image: ghcr.io/kubedb/druid-init:28.0.1
  securityContext:
    runAsUser: 1000
  version: 28.0.1
```

### metadata.name

`metadata.name` is a required field that specifies the name of the `DruidVersion` CR. You have to specify this name in `spec.version` field of [Druid](/docs/v2025.6.30/guides/druid/concepts/druid) CR.

We follow this convention for naming DruidVersion CR:

- Name format: `{Original Druid image version}-{modification tag}`

We use official Apache Druid release tar files to build docker images for supporting Druid versions and re-tag the image with v1, v2 etc. modification tag when there's any. An image with higher modification tag will have more features than the images with lower modification tag. Hence, it is recommended to use DruidVersion CR with the highest modification tag to enjoy the latest features.

### spec.version

`spec.version` is a required field that specifies the original version of Druid database that has been used to build the docker image specified in `spec.db.image` field.

### spec.deprecated

`spec.deprecated` is an optional field that specifies whether the docker images specified here is supported by the current KubeDB operator.

The default value of this field is `false`. If `spec.deprecated` is set to `true`, KubeDB operator will skip processing this CRD object and will add a event to the CRD object specifying that the DB version is deprecated.

### spec.db.image

`spec.db.image` is a required field that specifies the docker image which will be used to create PetSet by KubeDB operator to create expected Druid database.

### spec.initContainer.image

`spec.initContainer.image` is a required field that specifies the image which will be used to remove `lost+found` directory and mount an `EmptyDir` data volume.

### spec.podSecurityPolicies.databasePolicyName

`spec.podSecurityPolicies.databasePolicyName` is a required field that specifies the name of the pod security policy required to get the database server pod(s) running.

```bash
helm upgrade -i kubedb oci://ghcr.io/appscode-charts/kubedb \
  --namespace kubedb --create-namespace \
  --set global.featureGates.Druid=true --set global.featureGates.ZooKeeper=true \
  --set additionalPodSecurityPolicies[0]=custom-db-policy \
  --set additionalPodSecurityPolicies[1]=custom-snapshotter-policy \
  --set-file global.license=/path/to/the/license.txt \
  --wait --burst-limit=10000 --debug
```

## Next Steps

- Learn about Druid CRD [here](/docs/v2025.6.30/guides/druid/concepts/druid).
- Deploy your first Druid database with KubeDB by following the guide [here](/docs/v2025.6.30/guides/druid/quickstart/guide/).
