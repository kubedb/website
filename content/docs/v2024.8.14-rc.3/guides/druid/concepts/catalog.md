---
title: DruidVersion CRD
menu:
  docs_v2024.8.14-rc.3:
    identifier: dr-catalog-concepts
    name: DruidVersion
    parent: dr-concepts-druid
    weight: 15
menu_name: docs_v2024.8.14-rc.3
section_menu_id: guides
info:
  autoscaler: v0.32.0-rc.3
  cli: v0.47.0-rc.3
  dashboard: v0.23.0-rc.3
  installer: v2024.8.14-rc.3
  ops-manager: v0.34.0-rc.3
  provisioner: v0.47.0-rc.3
  schema-manager: v0.23.0-rc.3
  ui-server: v0.23.0-rc.3
  version: v2024.8.14-rc.3
  webhook-server: v0.23.0-rc.3
---

> New to KubeDB? Please start [here](/docs/v2024.8.14-rc.3/README).

# DruidVersion

[//]: # (## What is DruidVersion)

[//]: # ()
[//]: # (`DruidVersion` is a Kubernetes `Custom Resource Definitions` &#40;CRD&#41;. It provides a declarative configuration to specify the docker images to be used for [PgBouncer]&#40;https://pgbouncer.github.io/&#41; server deployed with KubeDB in a Kubernetes native way.)

[//]: # ()
[//]: # (When you install KubeDB, a `DruidVersion` custom resource will be created automatically for every supported PgBouncer release versions. You have to specify the name of `DruidVersion` crd in `spec.version` field of [PgBouncer]&#40;/docs/guides/pgbouncer/concepts/pgbouncer.md&#41; crd. Then, KubeDB will use the docker images specified in the `DruidVersion` crd to create your expected PgBouncer instance.)

[//]: # ()
[//]: # (Using a separate crd for specifying respective docker image names allow us to modify the images independent of KubeDB operator. This will also allow the users to use a custom PgBouncer image for their server. For more details about how to use custom image with PgBouncer in KubeDB, please visit [here]&#40;/docs/guides/pgbouncer/custom-versions/setup.md&#41;.)

[//]: # (## DruidVersion Specification)

[//]: # ()
[//]: # (As with all other Kubernetes objects, a DruidVersion needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `.spec` section.)

[//]: # ()
[//]: # (```yaml)

[//]: # (apiVersion: catalog.kubedb.com/v1alpha1)

[//]: # (kind: DruidVersion)

[//]: # (metadata:)

[//]: # (  name: "1.17.0")

[//]: # (  labels:)

[//]: # (    app: kubedb)

[//]: # (spec:)

[//]: # (  deprecated: false)

[//]: # (  version: "1.17.0")

[//]: # (  pgBouncer:)

[//]: # (    image: "${KUBEDB_CATALOG_REGISTRY}/pgbouncer:1.17.0")

[//]: # (  exporter:)

[//]: # (    image: "${KUBEDB_CATALOG_REGISTRY}/pgbouncer_exporter:v0.1.1")

[//]: # (```)

[//]: # ()
[//]: # (### metadata.name)

[//]: # ()
[//]: # (`metadata.name` is a required field that specifies the name of the `DruidVersion` crd. You have to specify this name in `spec.version` field of [PgBouncer]&#40;/docs/guides/pgbouncer/concepts/pgbouncer.md&#41; crd.)

[//]: # ()
[//]: # (We follow this convention for naming DruidVersion crd:)

[//]: # ()
[//]: # (- Name format: `{Original pgbouncer image version}-{modification tag}`)

[//]: # ()
[//]: # (We plan to modify original PgBouncer docker images to support additional features. Re-tagging the image with v1, v2 etc. modification tag helps separating newer iterations from the older ones. An image with higher modification tag will have more features than the images with lower modification tag. Hence, it is recommended to use DruidVersion crd with highest modification tag to take advantage of the latest features.)

[//]: # ()
[//]: # (### spec.version)

[//]: # ()
[//]: # (`spec.version` is a required field that specifies the original version of PgBouncer that has been used to build the docker image specified in `spec.server.image` field.)

[//]: # ()
[//]: # (### spec.deprecated)

[//]: # ()
[//]: # (`spec.deprecated` is an optional field that specifies whether the docker images specified here is supported by the current KubeDB operator.)

[//]: # ()
[//]: # (The default value of this field is `false`. If `spec.deprecated` is set `true`, KubeDB operator will not create the server and other respective resources for this version.)

[//]: # ()
[//]: # (### spec.pgBouncer.image)

[//]: # ()
[//]: # (`spec.pgBouncer.image` is a required field that specifies the docker image which will be used to create Petset by KubeDB operator to create expected PgBouncer server.)

[//]: # ()
[//]: # (### spec.exporter.image)

[//]: # ()
[//]: # (`spec.exporter.image` is a required field that specifies the image which will be used to export Prometheus metrics.)

[//]: # (## Next Steps)

[//]: # ()
[//]: # (- Learn about PgBouncer crd [here]&#40;/docs/guides/pgbouncer/concepts/catalog.md&#41;.)

[//]: # (- Deploy your first PgBouncer server with KubeDB by following the guide [here]&#40;/docs/guides/pgbouncer/quickstart/quickstart.md&#41;.)