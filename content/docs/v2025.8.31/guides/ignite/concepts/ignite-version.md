---
title: IgniteVersion CRD
menu:
  docs_v2025.8.31:
    identifier: ig-catalog-concepts
    name: IgniteVersion
    parent: ig-concepts-ignite
    weight: 15
menu_name: docs_v2025.8.31
section_menu_id: guides
info:
  autoscaler: v0.43.0
  cli: v0.58.0
  dashboard: v0.34.0
  installer: v2025.8.31
  ops-manager: v0.45.0
  provisioner: v0.58.0
  schema-manager: v0.34.0
  ui-server: v0.34.0
  version: v2025.8.31
  webhook-server: v0.34.0
---

> New to KubeDB? Please start [here](/docs/v2025.8.31/README).

# IgniteVersion

## What is IgniteVersion

`IgniteVersion` is a Kubernetes `Custom Resource Definitions` (CRD). It provides a declarative configuration to specify the docker images to be used for [Ignite](https://ignite.apache.org/) database deployed with KubeDB in a Kubernetes native way.

When you install KubeDB, a `IgniteVersion` custom resource will be created automatically for every supported Ignite versions. You have to specify the name of `IgniteVersion` crd in `spec.version` field of [Ignite](/docs/v2025.8.31/guides/ignite/concepts/ignite) crd. Then, KubeDB will use the docker images specified in the `IgniteVersion` crd to create your expected database.

Using a separate crd for specifying respective docker images, and pod security policy names allow us to modify the images, and policies independent of KubeDB operator. This will also allow the users to use a custom image for the database.

## IgniteVersion Specification

As with all other Kubernetes objects, a IgniteVersion needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `.spec` section.

```yaml
apiVersion: catalog.kubedb.com/v1alpha1
  kind: IgniteVersion
  metadata:
    annotations:
      meta.helm.sh/release-name: kubedb-catalog
      meta.helm.sh/release-namespace: kubedb
    creationTimestamp: "2025-05-20T08:57:56Z"
    generation: 1
    labels:
      app.kubernetes.io/instance: kubedb-catalog
      app.kubernetes.io/managed-by: Helm
      app.kubernetes.io/name: kubedb-catalog
      app.kubernetes.io/version: v2025.4.30
      helm.sh/chart: kubedb-catalog-v2025.4.30
    name: 2.17.0
    resourceVersion: "847947"
    uid: be60213c-5aba-43ac-9dbf-a352005cbb0c
  spec:
    db:
      image: ghcr.io/appscode-images/ignite:2.17.0
    initContainer:
      image: ghcr.io/kubedb/ignite-init:2.17.0-v1
    securityContext:
      runAsUser: 70
    version: 2.17.0
```

### metadata.name

`metadata.name` is a required field that specifies the name of the `IgniteVersion` crd. You have to specify this name in `spec.version` field of [Ignite](/docs/v2025.8.31/guides/ignite/concepts/ignite) crd.

We follow this convention for naming IgniteVersion crd:

- Name format: `{Original Ignite image version}-{modification tag}`

We modify original Ignite docker image to support Ignite and re-tag the image with v1, v2 etc. modification tag. An image with higher modification tag will have more features than the images with lower modification tag. Hence, it is recommended to use IgniteVersion crd with highest modification tag to take advantage of the latest features.

### spec.version

`spec.version` is a required field that specifies the original version of Ignite server that has been used to build the docker image specified in `spec.db.image` field.

### spec.deprecated

`spec.deprecated` is an optional field that specifies whether the docker images specified here is supported by the current KubeDB operator.

The default value of this field is `false`. If `spec.deprecated` is set to `true`, KubeDB operator will skip processing this CRD object and will add a event to the CRD object specifying that the DB version is deprecated.

### spec.db.image

`spec.db.image` is a required field that specifies the docker image which will be used to create Petset by KubeDB operator to create expected Ignite server.

### spec.exporter.image

`spec.exporter.image` is a required field that specifies the image which will be used to export Prometheus metrics.

### spec.podSecurityPolicies.databasePolicyName

`spec.podSecurityPolicies.databasePolicyName` is a required field that specifies the name of the pod security policy required to get the database server pod(s) running. To use a user-defined policy, the name of the polict has to be set in `spec.podSecurityPolicies` and in the list of allowed policy names in KubeDB operator like below:

```bash
helm upgrade -i kubedb oci://ghcr.io/appscode-charts/kubedb \
  --namespace kubedb --create-namespace \
  --set additionalPodSecurityPolicies[0]=custom-db-policy \
  --set-file global.license=/path/to/the/license.txt \
  --wait --burst-limit=10000 --debug
```

## Next Steps

- Learn about Ignite crd [here](/docs/v2025.8.31/guides/ignite/concepts/ignite).
- Deploy your first Ignite server with KubeDB by following the guide [here](/docs/v2025.8.31/guides/ignite/quickstart/quickstart).
