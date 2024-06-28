---
title: PerconaXtraDBVersion CRD
menu:
  docs_v2022.10.12-rc.0:
    identifier: px-catalog-concepts
    name: PerconaXtraDBVersion
    parent: px-concepts-percona-xtradb
    weight: 15
menu_name: docs_v2022.10.12-rc.0
section_menu_id: guides
info:
  autoscaler: v0.14.0-rc.0
  cli: v0.29.0-rc.0
  dashboard: v0.5.0-rc.0
  installer: v2022.10.12-rc.0
  ops-manager: v0.16.0-rc.0
  provisioner: v0.29.0-rc.0
  schema-manager: v0.5.0-rc.0
  ui-server: v0.5.0-rc.0
  version: v2022.10.12-rc.0
  webhook-server: v0.5.0-rc.0
---

> New to KubeDB? Please start [here](/docs/v2022.10.12-rc.0/README).

# PerconaXtraDBVersion

## What is PerconaXtraDBVersion

`PerconaXtraDBVersion` is a Kubernetes `Custom Resource Definitions` (CRD). It provides a declarative configuration to specify the docker images to be used for PerconaXtraDB deployed with KubeDB in a Kubernetes native way.

When you install KubeDB, a `PerconaXtraDBVersion` custom resource will be created automatically for every supported PerconaXtraDB versions. You have to specify the name of `PerconaXtraDBVersion` object in `.spec.version` field of [PerconaXtraDB](/docs/v2022.10.12-rc.0/guides/percona-xtradb/concepts/percona-xtradb) object. Then, KubeDB will use the docker images specified in the `PerconaXtraDBVersion` crd to create your expected PerconaXtraDBVersion instance.

Using a separate object for specifying respective docker images, and pod security policy names allow us to modify the images, and policies independent of KubeDB operator. This will also allow the users to use a custom image for the database.

## PerconaXtraDBVersion Spec

As with all other Kubernetes objects, a PerconaXtraDBVersion needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `.spec` section.

```yaml
apiVersion: catalog.kubedb.com/v1alpha1
kind: PerconaXtraDBVersion
metadata:
  name: 8.0.26
spec:
  db:
    image: kubedb/percona-xtradb-cluster:5.7
  exporter:
    image: kubedb/mysqld-exporter:v0.11.0
  initContainer:
    image: kubedb/busybox
  podSecurityPolicies:
    databasePolicyName: percona-xtradb-db
  stash:
    addon:
      backupTask:
        name: perconaxtradb-backup-5.7
      restoreTask:
        name: perconaxtradb-restore-5.7
  version: "8.0.26"
```

### .metadata.name

`.metadata.name` is a required field that specifies the name of the `PerconaXtraDBVersion` object. You have to specify this name in `.spec.version` field of [PerconaXtraDB](/docs/v2022.10.12-rc.0/guides/percona-xtradb/concepts/percona-xtradb) object.

We follow this convention for naming PerconaXtraDBVersion object:

- Name format: `{Original PerconaXtraDB image version}-{modification tag}`

We modify original PerconaXtraDB docker image to support additional features. An image with higher modification tag will have more features than the images with lower modification tag. Hence, it is recommended to use PerconaXtraDBVersion object with highest modification tag to take advantage of the latest features.

### .spec.version

`.spec.version` is a required field that specifies the original version of PerconaXtraDB database that has been used to build the docker image specified in `.spec.db.image` field.

### .spec.deprecated

`.spec.deprecated` is an optional field that specifies whether the docker images specified here is supported by the current KubeDB operator.

The default value of this field is `false`. If `.spec.deprecated` is set `true`, KubeDB operator will not create the database and other respective resources for this version.

### .spec.db.image

`.spec.db.image` is a required field that specifies the docker image which will be used to create Statefulset by KubeDB operator to create expected PerconaXtraDB database.

### .spec.exporter.image

`.spec.exporter.image` is a required field that specifies the image which will be used to export Prometheus metrics.

### .spec.podSecurityPolicies.databasePolicyName

`.spec.podSecurityPolicies.databasePolicyName` is a required field that specifies the name of the pod security policy required to get the database server Pod(s) running.

## Next Steps

- Learn about PerconaXtraDB CRD [here](/docs/v2022.10.12-rc.0/guides/percona-xtradb/concepts/percona-xtradb).
- Deploy your first PerconaXtraDB database with KubeDB by following the guide [here](/docs/v2022.10.12-rc.0/guides/percona-xtradb/quickstart/quickstart).
