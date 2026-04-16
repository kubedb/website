---
title: PgpoolVersion CRD
menu:
  docs_v2024.6.4:
    identifier: pp-catalog-concepts
    name: PgpoolVersion
    parent: pp-concepts-pgpool
    weight: 15
menu_name: docs_v2024.6.4
section_menu_id: guides
info:
  autoscaler: v0.31.0
  cli: v0.46.0
  dashboard: v0.22.0
  installer: v2024.6.4
  ops-manager: v0.33.0
  provisioner: v0.46.0
  schema-manager: v0.22.0
  ui-server: v0.22.0
  version: v2024.6.4
  webhook-server: v0.22.0
---

> New to KubeDB? Please start [here](/docs/v2024.6.4/README).

# PgpoolVersion

## What is PgpoolVersion

`PgpoolVersion` is a Kubernetes `Custom Resource Definitions` (CRD). It provides a declarative configuration to specify the docker images to be used for [Pgpool](https://pgpool.net/) server deployed with KubeDB in a Kubernetes native way.

When you install KubeDB, a `PgpoolVersion` custom resource will be created automatically for every supported Pgpool release versions. You have to specify the name of `PgpoolVersion` crd in `spec.version` field of [Pgpool](/docs/v2024.6.4/guides/pgpool/concepts/pgpool) crd. Then, KubeDB will use the docker images specified in the `PgpoolVersion` crd to create your expected Pgpool instance.

Using a separate crd for specifying respective docker image names allow us to modify the images independent of KubeDB operator. This will also allow the users to use a custom Pgpool image for their server. For more details about how to use custom image with Pgpool in KubeDB, please visit [here](/docs/v2024.6.4/guides/pgpool/custom-versions/setup).

## PgpoolVersion Specification

As with all other Kubernetes objects, a PgpoolVersion needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `.spec` section.

```yaml
apiVersion: catalog.kubedb.com/v1alpha1
kind: PgpoolVersion
metadata:
  name: 4.5.0
spec:
  exporter:
    image: ghcr.io/appscode-images/pgpool2_exporter:v1.2.2
  pgpool:
    image: ghcr.io/appscode-images/pgpool2:4.5.0
  version: 4.5.0
  deprecated: false
```

### metadata.name

`metadata.name` is a required field that specifies the name of the `PgpoolVersion` crd. You have to specify this name in `spec.version` field of [Pgpool](/docs/v2024.6.4/guides/pgpool/concepts/pgpool) crd.

We follow this convention for naming PgpoolVersion crd:

- Name format: `{Original pgpool image version}-{modification tag}`

We plan to modify original Pgpool docker images to support additional features. Re-tagging the image with v1, v2 etc. modification tag help separating newer iterations from the older ones. An image with higher modification tag will have more features than the images with lower modification tag. Hence, it is recommended to use PgpoolVersion crd with higher modification tag to take advantage of the latest features.

### spec.version

`spec.version` is a required field that specifies the original version of Pgpool that has been used to build the docker image specified in `spec.server.image` field.

### spec.deprecated

`spec.deprecated` is an optional field that specifies whether the docker images specified here is supported by the current KubeDB operator.

The default value of this field is `false`. If `spec.deprecated` is set `true`, KubeDB operator will not create the server and other respective resources for this version.

### spec.pgpool.image

`spec.pgpool.image` is a required field that specifies the docker image which will be used to create PetSet by KubeDB operator to create expected Pgpool server.

### spec.exporter.image

`spec.exporter.image` is a required field that specifies the image which will be used to export Prometheus metrics.

## Next Steps

- Learn about Pgpool crd [here](/docs/v2024.6.4/guides/pgpool/concepts/catalog).
- Deploy your first Pgpool server with KubeDB by following the guide [here](/docs/v2024.6.4/guides/pgpool/quickstart/quickstart).