---
title: Troubleshooting KubeDB Installation
description: Troubleshooting guide for KubeDB installation
menu:
  docs_v2024.1.28-rc.1:
    identifier: install-kubedb-troubleshoot
    name: Troubleshooting
    parent: installation-guide
    weight: 40
product_name: kubedb
menu_name: docs_v2024.1.28-rc.1
section_menu_id: setup
info:
  autoscaler: v0.26.0-rc.1
  cli: v0.41.0-rc.1
  dashboard: v0.17.0-rc.1
  installer: v2024.1.28-rc.1
  ops-manager: v0.28.0-rc.1
  provisioner: v0.41.0-rc.1
  schema-manager: v0.17.0-rc.1
  ui-server: v0.17.0-rc.1
  version: v2024.1.28-rc.1
  webhook-server: v0.17.0-rc.1
---

## Installing in GKE Cluster

If you are installing KubeDB on a GKE cluster, you will need cluster admin permissions to install KubeDB operator. Run the following command to grant admin permision to the cluster.

```bash
$ kubectl create clusterrolebinding "cluster-admin-$(whoami)" \
  --clusterrole=cluster-admin                                 \
  --user="$(gcloud config get-value core/account)"
```

In addition, if your GKE cluster is a [private cluster](https://cloud.google.com/kubernetes-engine/docs/how-to/private-clusters), you will need to either add an additional firewall rule that allows master nodes access port `8443/tcp` on worker nodes, or change the existing rule that allows access to ports `443/tcp` and `10250/tcp` to also allow access to port `8443/tcp`. The procedure to add or modify firewall rules is described in the official GKE documentation for private clusters mentioned before.

## Detect KubeDB version

To detect KubeDB version, exec into the operator pod and run `kubedb version` command.

```bash
$ POD_NAMESPACE=kubedb
$ POD_NAME=$(kubectl get pods -n $POD_NAMESPACE -l app.kubernetes.io/name=kubedb-community -o jsonpath={.items[0].metadata.name})
$ kubectl exec $POD_NAME -c operator -n $POD_NAMESPACE -- /operator version

Version = v0.20.0
VersionStrategy = tag
GitTag = v0.20.0
GitBranch = HEAD
CommitHash = c24b636ea015b1f4e7be84ec206f123501fa148a
CommitTimestamp = 2021-08-23T11:15:37
GoVersion = go1.16.7
Compiler = gcc
Platform = linux/amd64
```
