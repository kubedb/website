---
title: Restart Milvus
menu:
  docs_v2026.6.19:
    identifier: milvus-restart-guide
    name: Guide
    parent: milvus-restart
    weight: 10
menu_name: docs_v2026.6.19
section_menu_id: guides
info:
  autoscaler: v0.50.0
  cli: v0.65.0
  dashboard: v0.41.0
  installer: v2026.6.19
  ops-manager: v0.52.0
  product: kubedb
  provisioner: v0.65.0
  schema-manager: v0.41.0
  ui-server: v0.41.0
  version: v2026.6.19
  webhook-server: v0.41.0
---

> New to KubeDB? Please start [here](/docs/v2026.6.19/README).

# Restart Milvus

KubeDB supports restarting a Milvus database via a `MilvusOpsRequest`. Restarting can be useful to recover from a transient issue or to force pods to re-read mounted secrets/config.

## Before You Begin

- You should be familiar with the following `KubeDB` concepts:
  - [Milvus](/docs/v2026.6.19/guides/milvus/concepts/milvus)
  - [MilvusOpsRequest](/docs/v2026.6.19/guides/milvus/concepts/milvusopsrequest)

- An object-storage secret named `my-release-minio` must exist in the `demo` namespace.

> Note: The yaml files used in this tutorial are stored in [docs/guides/milvus/restart/yamls](https://github.com/kubedb/docs/tree/{{< param "info.version" >}}/docs/guides/milvus/restart/yamls) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Restart Standalone Milvus

Deploy a standalone Milvus and wait until it is `Ready` (see the [quickstart](/docs/v2026.6.19/guides/milvus/quickstart/standalone)).

### Apply the Restart OpsRequest

`restart-standalone.yaml`

```yaml
apiVersion: ops.kubedb.com/v1alpha1
kind: MilvusOpsRequest
metadata:
  name: restart
  namespace: demo
spec:
  type: Restart
  databaseRef:
    name: milvus-standalone
  timeout: 5m
  apply: Always
```

Here,

- `spec.type: Restart` selects the restart operation.
- `spec.databaseRef.name` is the database to restart.
- `spec.apply: Always` applies the restart regardless of the database's current readiness.

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/guides/milvus/restart/yamls/restart-standalone.yaml
milvusopsrequest.ops.kubedb.com/restart created
```

### Watch Progress

```bash
$ kubectl get milvusopsrequest restart -n demo
NAME      TYPE      STATUS       AGE
restart   Restart   Successful   57s
```

```bash
$ kubectl describe milvusopsrequest restart -n demo
...
Status:
  Conditions:
    Message:  Milvus ops-request has started to restart milvus nodes
    Reason:   Restart
    Type:     Restart
    Message:  get pod; ConditionStatus:True; PodName:milvus-standalone-0
    Type:     GetPod--milvus-standalone-0
    Message:  evict pod; ConditionStatus:True; PodName:milvus-standalone-0
    Type:     EvictPod--milvus-standalone-0
    Message:  check pod running; ConditionStatus:True; PodName:milvus-standalone-0
    Type:     CheckPodRunning--milvus-standalone-0
    Message:  Successfully Restarted Milvus nodes
    Reason:   RestartNodes
    Type:     RestartNodes
    Message:  Controller has successfully restart the Milvus replicas
    Reason:   Successful
    Type:     Successful
  Phase:      Successful
Events:
  Normal   Starting       Pausing Milvus databse: demo/milvus-standalone
  Warning  evict pod; ConditionStatus:True; PodName:milvus-standalone-0
  Warning  check pod running; ConditionStatus:True; PodName:milvus-standalone-0
  Normal   RestartNodes   Successfully Restarted Milvus nodes
  Normal   Successful     Successfully resumed Milvus database: demo/milvus-standalone for MilvusOpsRequest: restart
```

The pod has been evicted and recreated:

```bash
$ kubectl get pods -n demo -l app.kubernetes.io/instance=milvus-standalone
NAME                  READY   STATUS    RESTARTS   AGE
milvus-standalone-0   1/1     Running   0          14s
```

## Restart Distributed Milvus

For a distributed Milvus, the same `Restart` OpsRequest is used, pointing at the distributed database (`milvus-cluster`). The operator restarts the pods of every distributed role (`mixcoord`, `datanode`, `querynode`, `streamingnode`, `proxy`) one workload at a time.

`restart-distributed.yaml`

```yaml
apiVersion: ops.kubedb.com/v1alpha1
kind: MilvusOpsRequest
metadata:
  name: restart
  namespace: demo
spec:
  type: Restart
  databaseRef:
    name: milvus-cluster
  timeout: 5m
  apply: Always
```

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/guides/milvus/restart/yamls/restart-distributed.yaml
milvusopsrequest.ops.kubedb.com/restart created

$ kubectl get milvusopsrequest restart -n demo
NAME      TYPE      STATUS       AGE
restart   Restart   Successful   2m8s
```

The describe output shows each role's pod being evicted and checked in turn:

```bash
$ kubectl describe milvusopsrequest restart -n demo
...
Status:
  Conditions:
    Message:  Milvus ops-request has started to restart milvus nodes
    Reason:   Restart
    Type:     Restart
    Message:  evict pod; ConditionStatus:True; PodName:milvus-cluster-mixcoord-0
    Type:     EvictPod--milvus-cluster-mixcoord-0
    Message:  check pod running; ConditionStatus:True; PodName:milvus-cluster-mixcoord-0
    Type:     CheckPodRunning--milvus-cluster-mixcoord-0
    Message:  evict pod; ConditionStatus:True; PodName:milvus-cluster-datanode-0
    Type:     EvictPod--milvus-cluster-datanode-0
    ... (querynode, streamingnode, proxy follow)
  Phase:      Successful
```

All role pods have been recreated:

```bash
$ kubectl get pods -n demo -l app.kubernetes.io/instance=milvus-cluster
NAME                             READY   STATUS    RESTARTS   AGE
milvus-cluster-datanode-0        1/1     Running   0          105s
milvus-cluster-mixcoord-0        1/1     Running   0          114s
milvus-cluster-proxy-0           1/1     Running   0          13s
milvus-cluster-querynode-0       1/1     Running   0          65s
milvus-cluster-streamingnode-0   1/1     Running   0          25s
```

## Cleaning up

```bash
$ kubectl delete milvusopsrequest -n demo restart
$ kubectl delete milvus.kubedb.com -n demo milvus-standalone
$ kubectl delete ns demo
```

## Next Steps

- Learn how to [reconfigure](/docs/v2026.6.19/guides/milvus/reconfigure/guide) a Milvus database.
- Detail concepts of [Milvus object](/docs/v2026.6.19/guides/milvus/concepts/milvus).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2026.6.19/CONTRIBUTING).
