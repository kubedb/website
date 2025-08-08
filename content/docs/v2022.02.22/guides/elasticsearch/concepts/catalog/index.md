---
title: ElasticsearchVersion CRD
menu:
  docs_v2022.02.22:
    identifier: es-catalog-concepts
    name: ElasticsearchVersion
    parent: es-concepts-elasticsearch
    weight: 20
menu_name: docs_v2022.02.22
section_menu_id: guides
info:
  autoscaler: v0.10.0
  cli: v0.25.0
  community: v0.25.0
  dashboard: v0.1.0
  enterprise: v0.12.0
  installer: v2022.02.22
  schema-manager: v0.1.0
  ui-server: v0.1.0
  version: v2022.02.22
  webhook-server: v0.1.0
---

> New to KubeDB? Please start [here](/docs/v2022.02.22/README).

# ElasticsearchVersion

## What is ElasticsearchVersion

`ElasticsearchVersion` is a Kubernetes `Custom Resource Definitions` (CRD). It provides a declarative configuration to specify the docker images to be used for [Elasticsearch](https://www.elastic.co/products/elasticsearch) database deployed with KubeDB in a Kubernetes native way.

When you install KubeDB, an `ElasticsearchVersion` custom resource will be created automatically for every supported Elasticsearch version. You have to specify the name of `ElasticsearchVersion` CRD in `spec.version` field of [Elasticsearch](/docs/v2022.02.22/guides/elasticsearch/concepts/elasticsearch/) CRD. Then, KubeDB will use the docker images specified in the `ElasticsearchVersion` CRD to create your expected database.

Using a separate CRD for specifying respective docker images, and pod security policy names allow us to modify the images, and policies independent of the KubeDB operator. This will also allow the users to use a custom image for the database.

## ElasticsearchVersion Specification

As with all other Kubernetes objects, an ElasticsearchVersion needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `.spec` section.

```yaml
apiVersion: catalog.kubedb.com/v1alpha1
kind: ElasticsearchVersion
metadata:
  labels:
    app.kubernetes.io/instance: kubedb-catalog
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/name: kubedb-catalog
    app.kubernetes.io/version: v0.16.2
    helm.sh/chart: kubedb-catalog-v0.16.2
  name: opendistro-1.12.0
spec:
  authPlugin: OpenDistro
  db:
    image: kubedb/elasticsearch:1.12.0-opendistro
  exporter:
    image: kubedb/elasticsearch_exporter:1.1.0
  initContainer:
    image: kubedb/toybox:0.8.4
    yqImage: kubedb/elasticsearch-init:1.12.0-opendistro
  podSecurityPolicies:
    databasePolicyName: elasticsearch-db
  version: 7.10.0
```

### metadata.name

`metadata.name` is a required field that specifies the name of the `ElasticsearchVersion` CRD. You have to specify this name in `spec.version` field of [Elasticsearch](/docs/v2022.02.22/guides/elasticsearch/concepts/elasticsearch/) CRD.

We follow this convention for naming ElasticsearchVersion CRD:

- Name format: `{Security Plugin Name}-{Application Version}-{Modification Tag}`

- Samples: `searchguard-7.9.3`, `xpack-7.9.1-v1`, `opendistro-1.12.0`, etc.

We use the original Elasticsearch docker image provided by the distributors. Then we bundle the image with the necessary sidecar and init container images which facilitate features like sysctl kernel settings, custom configuration, monitoring matrices, etc.  An image with a higher modification tag will have more features and fixes than an image with a lower modification tag. Hence, it is recommended to use ElasticsearchVersion CRD with the highest modification tag to take advantage of the latest features.

### spec.version

`spec.version` is a required field that specifies the original version of the Elasticsearch database that has been used to build the docker image specified in `spec.db.image` field.

### spec.deprecated

`spec.deprecated` is an optional field that specifies whether the docker images specified here is supported by the current KubeDB operator. For example, we have modified `kubedb/elasticsearch:7.x.x-xpack` docker images to support custom configuration and re-tagged as `kubedb/elasticsearch:7.x.x-xpack-v1`. Now, KubeDB operator `version:x.y.z` supports providing custom configuration which required `kubedb/elasticsearch:7.x.x-xpack-v1` docker images. So, we have marked `kubedb/elasticsearch:7.x.x-xpack` as deprecated in KubeDB `version:x.y.z`.

The default value of this field is `false`. If `spec.deprecated` is set `true`, the KubeDB operator will not create the database and other respective resources for this version.

### spec.db.image

`spec.db.image` is a `required` field that specifies the docker image which will be used to create StatefulSet by KubeDB operator to create the expected Elasticsearch database.

### spec.exporter.image

`spec.exporter.image` is a `required` field that specifies the image which will be used to export Prometheus metrics if monitoring is enabled.

### spec.podSecurityPolicies.databasePolicyName

`spec.podSecurityPolicies.databasePolicyName` is a `required` field that specifies the name of the pod security policy required to get the database server pod(s) running.

## Next Steps

- Learn about Elasticsearch CRD [here](/docs/v2022.02.22/guides/elasticsearch/concepts/elasticsearch/).
- Deploy your first Elasticsearch database with KubeDB by following the guide [here](/docs/v2022.02.22/guides/elasticsearch/quickstart/overview/).
