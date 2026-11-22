---
title: Horizontal Scaling Milvus
menu:
  docs_v2026.8.26-rc.2:
    identifier: milvus-scaling-horizontal-scaling-guide
    name: Guide
    parent: milvus-scaling-horizontal-scaling
    weight: 20
menu_name: docs_v2026.8.26-rc.2
section_menu_id: guides
info:
  autoscaler: v0.52.0-rc.2
  cli: v0.67.0-rc.2
  dashboard: v0.43.0-rc.2
  installer: v2026.8.26-rc.2
  ops-manager: v0.54.0-rc.2
  product: kubedb
  provisioner: v0.67.0-rc.2
  schema-manager: v0.43.0-rc.2
  ui-server: v0.43.0-rc.2
  version: v2026.8.26-rc.2
  webhook-server: v0.43.0-rc.2
---

> New to KubeDB? Please start [here](/docs/v2026.8.26-rc.2/README).

# Horizontal Scaling Milvus

This guide will show you how to use the `KubeDB` Ops-manager operator to horizontally scale the roles of a distributed Milvus database.

> **Horizontal scaling is distributed-only.** A `Standalone` Milvus is a single all-in-one workload (one PetSet, one replica) and cannot be horizontally scaled. To scale out, deploy Milvus in `Distributed` mode.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Milvus](/docs/v2026.8.26-rc.2/guides/milvus/concepts/milvus)
  - [MilvusOpsRequest](/docs/v2026.8.26-rc.2/guides/milvus/concepts/milvusopsrequest)
  - [Horizontal Scaling Overview](/docs/v2026.8.26-rc.2/guides/milvus/scaling/horizontal-scaling/overview)

- Complete the dependency setup from [Prepare Dependencies](/docs/v2026.8.26-rc.2/guides/milvus/quickstart/prerequisites). It installs MinIO, creates the `milvus-storage-config` secret, and installs the etcd operator required by Milvus.

> Note: The yaml files used in this tutorial are stored in [docs/guides/milvus/scaling/horizontal-scaling/yamls](https://github.com/kubedb/docs/tree/{{< param "info.version" >}}/docs/guides/milvus/scaling/horizontal-scaling/yamls) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Deploy a Distributed Milvus

Deploy the distributed database (`milvus-cluster`) and wait until it is `Ready` (see the [distributed quickstart](/docs/v2026.8.26-rc.2/guides/milvus/quickstart/distributed)). By default each role runs a single replica.

```bash
$ kubectl get petset milvus-cluster-proxy milvus-cluster-streamingnode -n demo -o custom-columns=NAME:.metadata.name,REPLICAS:.spec.replicas
NAME                           REPLICAS
milvus-cluster-proxy           1
milvus-cluster-streamingnode   1
```

## Apply the HorizontalScaling OpsRequest

The sample changes only `proxy` and `streamingnode`. (The provided sample requests `1` for each; because the default is already `1`, this walkthrough requests `2` to demonstrate a scale-up.)

`horizontal-scaling-distributed.yaml`

```yaml
apiVersion: ops.kubedb.com/v1alpha1
kind: MilvusOpsRequest
metadata:
  name: milvus-hscale-up
  namespace: demo
spec:
  type: HorizontalScaling
  databaseRef:
    name: milvus-cluster
  horizontalScaling:
    topology:
      proxy: 2
      streamingnode: 2
```

Here, `spec.horizontalScaling.topology` carries the desired replica count per role. The API also accepts `mixcoord`, `querynode` and `dataNode`; this sample only scales `proxy` and `streamingnode`, but the other roles are scaled the same way.

```bash
$ kubectl apply -f horizontal-scaling-distributed.yaml
milvusopsrequest.ops.kubedb.com/milvus-hscale-up created
```

## Watch Progress and Verify

```bash
$ kubectl get milvusopsrequest milvus-hscale-up -n demo
NAME               TYPE                STATUS       AGE
milvus-hscale-up   HorizontalScaling   Successful   57s
```

```bash
$ kubectl describe milvusopsrequest milvus-hscale-up -n demo
...
Status:
  Conditions:
    Message:  Milvus ops-request has started to horizontally scale the Milvus nodes
    Reason:   HorizontalScaling
    Type:     HorizontalScaling
    Message:  Successfully Scaled Up proxy
    Reason:   ScaleUpProxy
    Type:     ScaleUpProxy
    Message:  pod readyproxy; ConditionStatus:True; PodName:milvus-cluster-proxy-1
    Type:     PodReadyproxy--milvus-cluster-proxy-1
    Message:  Successfully Scaled Up streamingnode
    Reason:   ScaleUpStreamingNode
    Type:     ScaleUpStreamingNode
  Phase:      Successful
```

Both roles now run two replicas:

```bash
$ kubectl get petset milvus-cluster-proxy milvus-cluster-streamingnode -n demo -o custom-columns=NAME:.metadata.name,REPLICAS:.spec.replicas
NAME                           REPLICAS
milvus-cluster-proxy           2
milvus-cluster-streamingnode   2

$ kubectl get pods -n demo -l app.kubernetes.io/instance=milvus-cluster | grep -E 'proxy|streamingnode'
milvus-cluster-proxy-0           1/1     Running   0          70s
milvus-cluster-proxy-1           1/1     Running   0          39s
milvus-cluster-streamingnode-0   1/1     Running   0          119s
milvus-cluster-streamingnode-1   1/1     Running   0          18s
```

> Scaling **down** works the same way — set lower replica counts in `spec.horizontalScaling.topology`.

## Cleaning up

```bash
$ kubectl delete milvusopsrequest -n demo milvus-hscale-up
$ kubectl delete milvus.kubedb.com -n demo milvus-cluster
$ kubectl delete ns demo
```

## Next Steps

- Learn about [vertical scaling](/docs/v2026.8.26-rc.2/guides/milvus/scaling/vertical-scaling/guide) of a Milvus database.
- Detail concepts of [Milvus object](/docs/v2026.8.26-rc.2/guides/milvus/concepts/milvus).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2026.8.26-rc.2/CONTRIBUTING).
