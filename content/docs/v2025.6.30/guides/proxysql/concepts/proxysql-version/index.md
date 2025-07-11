---
title: ProxySQLVersion CRD
menu:
  docs_v2025.6.30:
    identifier: guides-proxysql-concepts-proxysqlversion
    name: ProxySQLVersion
    parent: guides-proxysql-concepts
    weight: 10
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

# ProxySQLVersion

## What is ProxySQLVersion

`ProxySQLVersion` is a Kubernetes `Custom Resource Definitions` (CRD). It provides a declarative configuration to specify the docker images to be used for [ProxySQL](https://www.proxysql.com/) deployed with KubeDB in a Kubernetes native way.

When you install KubeDB, a `ProxySQLVersion` custom resource will be created automatically for supported ProxySQL versions. You have to specify the name of `ProxySQLVersion` object in `.spec.version` field of [ProxySQL](/docs/v2025.6.30/guides/proxysql/concepts/proxysql/) object. Then, KubeDB will use the docker images specified in the `ProxySQLVersion` object to create your ProxySQL instance.

Using a separate CRD for this purpose allows us to modify the images, and policies independent of KubeDB operator. This will also allow the users to use a custom image for the ProxySQL.

## ProxySQLVersion Specification

As with all other Kubernetes objects, a ProxySQLVersion needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `.spec` section.

```yaml
apiVersion: catalog.kubedb.com/v1alpha1
kind: ProxySQLVersion
metadata:
  name: "2.3.2-debian"
  labels:
    app: kubedb
spec:
  version: "2.3.2-debian"
  proxysql:
    image: "${KUBEDB_CATALOG_REGISTRY}/proxysql:2.3.2-debian-v2"
  exporter:
    image: "${KUBEDB_CATALOG_REGISTRY}/proxysql-exporter:1.1.0"
  podSecurityPolicies:
    databasePolicyName: proxysql-db
```

### .metadata.name

`.metadata.name` is a required field that specifies the name of the `ProxySQLVersion` object. You have to specify this name in `.spec.version` field of [ProxySQL](/docs/v2025.6.30/guides/proxysql/concepts/proxysql/) object.

We follow this convention for naming ProxySQLVersion object:

- Name format: `{Original ProxySQL image version}-{modification tag}`

We modify the original ProxySQL docker image to support additional features. An image with a higher modification tag will have more features than the images with a lower modification tag. Hence, it is recommended to use ProxySQLVersion object with the highest modification tag to take advantage of the latest features.

### .spec.version

`.spec.version` is a required field that specifies the original version of ProxySQL that has been used to build the docker image specified in `.spec.proxysql.image` field.

### .spec.deprecated

`spec.deprecated` is an optional field that specifies whether the docker images specified here is supported by the current KubeDB operator.

The default value of this field is `false`. If `.spec.deprecated` is set `true`, KubeDB operator will not deploy ProxySQL and other respective resources for this version.

### .spec.proxysql.image

`.spec.proxysql.image` is a required field that specifies the docker image which will be used to create Petset by KubeDB operator to deploy expected ProxySQL.

### .spec.exporter.image

`.spec.exporter.image` is a required field that specifies the image which will be used to export Prometheus metrics.

### .spec.podSecurityPolicies.databasePolicyName

`spec.podSecurityPolicies.databasePolicyName` is a required field that specifies the name of the pod security policy required to get the ProxySQL pod(s) running.

## Next Steps

- Learn how to use KubeDB ProxySQL to load balance MySQL Group Replication [here](/docs/v2025.6.30/guides/proxysql/quickstart/mysqlgrp/)