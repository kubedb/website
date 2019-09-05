---
title: RedisVersion
menu:
  docs_v0.13.0-rc.0:
    identifier: redis-version
    name: RedisVersion
    parent: catalog
    weight: 30
menu_name: docs_v0.13.0-rc.0
section_menu_id: concepts
---

# RedisVersion

## What is RedisVersion

`RedisVersion` is a Kubernetes `Custom Resource Definitions` (CRD). It provides a declarative configuration to specify the docker images to be used for [Redis](https://redis.io/) database deployed with KubeDB in Kubernetes native way.

When you install KubeDB, `RedisVersion` crd will be created automatically for every supported Redis versions. You have to specify the name of `RedisVersion` crd in `spec.version` field of [Redis](/docs/v0.13.0-rc.0/concepts/databases/redis) crd. Then, KubeDB will use the docker images specified in the `RedisVersion` crd to create your expected database.

Using a separate crd for specifying respective docker images, and pod security policy names allow us to modify the images, and policies independent of KubeDB operator. This will also allow the users to use a custom image for the database.

## RedisVersion Specification

As with all other Kubernetes objects, a RedisVersion needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `.spec` section.

```yaml
apiVersion: catalog.kubedb.com/v1alpha1
kind: RedisVersion
metadata:
  name: "4.0-v1"
  labels:
    app: kubedb
spec:
  version: "4.0"
  db:
    image: "${KUBEDB_DOCKER_REGISTRY}/redis:4.0-v1"
  exporter:
    image: "${KUBEDB_DOCKER_REGISTRY}/redis_exporter:v0.21.1"
  podSecurityPolicies:
    databasePolicyName: "redis-db"
```

### metadata.name

`metadata.name` is a required field that specifies the name of the `RedisVersion` crd. You have to specify this name in `spec.version` field of [Redis](/docs/v0.13.0-rc.0/concepts/databases/redis) crd.

We follow this convention for naming RedisVersion crd:

- Name format: `{Original Redis image verion}-{modification tag}`

We modify original Redis docker image to support Redis clustering and re-tag the image with v1, v2 etc. modification tag. An image with higher modification tag will have more feature than the images with lower modification tag. Hence, it is recommended to use RedisVersion crd with highest modification tag to enjoy the latest features.

### spec.version

`spec.version` is a required field that specifies the original version of Redis server that has been used to build the docker image specified in `spec.db.image` field.

### spec.deprecated

`spec.deprecated` is an optional field that specifies whether the docker images specified here is supported by the current KubeDB operator.

The default value of this field is `false`. If `spec.depcrecated` is set to `true`, KubeDB operator will skip processing this CRD object and will add a event to the CRD object specifying that the DB version is deprecated.

### spec.db.image

`spec.db.image` is a required field that specifies the docker image which will be used to create Statefulset by KubeDB operator to create expected Redis server.

### spec.exporter.image

`spec.exporter.image` is a required field that specifies the image which will be used to export Prometheus metrics.

### spec.podSecurityPolicies.databasePolicyName

`spec.podSecurityPolicies.databasePolicyName` is a required field that specifies the name of the pod security policy required to get the database server pod(s) running. To use a user-defined policy, the name of the polict has to be set in `spec.podSecurityPolicies` and in the list of allowed policy names in KubeDB operator like below:

```console
helm upgrade kubedb-operator appscode/kubedb --namespace kube-system \
  --set additionalPodSecurityPolicies[0]=custom-db-policy
```

## Next Steps

- Learn about Redis crd [here](/docs/v0.13.0-rc.0/concepts/databases/redis).
- Deploy your first Redis server with KubeDB by following the guide [here](/docs/v0.13.0-rc.0/guides/redis/quickstart/quickstart).
