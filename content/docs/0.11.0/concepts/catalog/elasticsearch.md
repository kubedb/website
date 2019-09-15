---
title: ElasticsearchVersion
menu:
  docs_0.11.0:
    identifier: elasticsearh-version
    name: ElasticsearchVersion
    parent: catalog
    weight: 10
menu_name: docs_0.11.0
section_menu_id: concepts
info:
  version: 0.11.0
---

# ElasticsearchVersion

## What is ElasticsearchVersion

`ElasticsearchVersion` is a Kubernetes `Custom Resource Definitions` (CRD). It provides a declarative configuration to specify the docker images to be used for [Elasticsearch](https://www.elastic.co/products/elasticsearch) database deployed with KubeDB in Kubernetes native way.

When you install KubeDB, `ElasticsearchVersion` crd will be created automatically for every supported Elasticsearch versions. You have to specify the name of `ElasticsearchVersion` crd in `spec.version` field of [Elasticsearch](/docs/0.11.0/concepts/databases/elasticsearch) crd. Then, KubeDB will use the docker images specified in the `ElasticsearchVersion` crd to create your expected database.

Using a separate crd for specifying respective docker images, and pod security policy names allow us to modify the images, and policies independent of KubeDB operator. This will also allow the users to use a custom image for database.

## ElasticsearchVersion Specification

As with all other Kubernetes objects, a ElasticsearchVersion needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `.spec` section.

```yaml
apiVersion: catalog.kubedb.com/v1alpha1
kind: ElasticsearchVersion
metadata:
  name: "6.2.4-v1"
  labels:
    app: kubedb
spec:
  version: "6.2.4"
  deprecated: false
  db:
    image: "kubedb/elasticsearch:6.2.4-v1"
  exporter:
    image: "kubedb/elasticsearch_exporter:1.0.2"
  tools:
    image: "kubedb/elasticsearch-tools:6.2.4-v1"
  podSecurityPolicies:
    databasePolicyName: "elasticsearch-db"
    snapshotterPolicyName: "elasticsearch-snapshot"
```

### metadata.name

`metadata.name` is a required field that specifies the name of the `ElasticsearchVersion` crd. You have to specify this name in `spec.version` field of [Elasticsearch](/docs/0.11.0/concepts/databases/elasticsearch) crd.

We follow this convention for naming ElasticsearchVersion crd:
- Name format: `{Original Elasticsearch version}-{modification tag}`

We modify original Elasticsearch docker image to support additional features like Search Guard plugin integration, custom configuration etc. and re-tag the image with v1, v2 etc. modification tag. An image with higher modification tag will have more feature than the images with lower modification tag. Hence, it is recommended to use ElasticsearchVersion crd with highest modification tag to take advantage of the latest features.

### spec.version

`spec.version` is a required field that specifies the original version of Elasticsearch database that has been used to build the docker image specified in `spec.db.image` field.

### spec.deprecated

`spec.deprecated` is an optional field that specifies whether the docker images specified here is supported by the current KubeDB operator. For example, we have modified `kubedb/elasticsearch:6.2.4` docker image to support custom configuration and re-tagged as `kubedb/elasticsearch:6.2.4-v1`. Now, KubeDB `0.9.0-rc.0` supports providing custom configuration which required `kubedb/elasticsearch:6.2.4-v1` docker image. So, we have marked `kubedb/elasticsearch:6.2.4` as deprecated in KubeDB `0.9.0-rc.0`.

The default value of this field is `false`. If `spec.depcrecated` is set `true`, KubeDB operator will not create the database and other respective resources for this version.

### spec.db.image

`spec.db.image` is a required field that specifies the docker image which will be used to create Statfulset by KubeDB operator to create expected Elasticsearch database.

### spec.exporter.image

`spec.exporter.image` is a required field that specifies the image which will be used to export Prometheus metrics.

### spec.tools.image

`spec.tools.image` is a required field that specifies the image which will be used to take backup and initialize database from snapshot.

### spec.podSecurityPolicies.databasePolicyName

`spec.podSecurityPolicies.databasePolicyName` is a required field that specifies the name of the pod security policy required to get the database server pod(s) running.

### spec.podSecurityPolicies.snapshotterPolicyName

`spec.podSecurityPolicies.snapshotterPolicyName` is a required field that specifies the name of the pod security policy required to get the snapshotter pod(s) running. To use user-defined policies, names of the policies have to be set in `spec.podSecurityPolicies` and in the list of allowed policy names in KubeDB operator like below:

```console
helm upgrade kubedb-operator appscode/kubedb --namespace kube-system \
  --set additionalPodSecurityPolicies[0]=custom-db-policy \
  --set additionalPodSecurityPolicies[1]=custom-snapshotter-policy
```

## Next Steps

- Learn about Elasticsearch crd [here](/docs/0.11.0/concepts/databases/elasticsearch).
- Deploy your first Elasticsearch database with KubeDB by following the guide [here](/docs/0.11.0/guides/elasticsearch/quickstart/quickstart).