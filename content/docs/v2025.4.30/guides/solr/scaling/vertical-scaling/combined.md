---
title: Solr Vertical Scaling Combined
menu:
  docs_v2025.4.30:
    identifier: sl-scaling-vertical-combined
    name: Combined Cluster
    parent: sl-scaling-vertical
    weight: 20
menu_name: docs_v2025.4.30
section_menu_id: guides
info:
  autoscaler: v0.39.0
  cli: v0.54.0
  dashboard: v0.30.0
  installer: v2025.4.30
  ops-manager: v0.41.0
  provisioner: v0.54.0
  schema-manager: v0.30.0
  ui-server: v0.30.0
  version: v2025.4.30
  webhook-server: v0.30.0
---

> New to KubeDB? Please start [here](/docs/v2025.4.30/README).

# Vertical Scale Solr Combined Cluster

This guide will show you how to use `KubeDB` Ops-manager operator to update the resources of a Solr Combined cluster.

## Before You Begin

- At first, you need to have a Kubernetes cluster, and the `kubectl` command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

- Install `KubeDB` Provisioner and Ops-manager operator in your cluster following the steps [here](/docs/v2025.4.30/setup/README).

- You should be familiar with the following `KubeDB` concepts:
    - [Solr](/docs/v2025.4.30/guides/solr/concepts/solr)
    - [Combined](/docs/v2025.4.30/guides/solr/clustering/combined_cluster)
    - [SolrOpsRequest](/docs/v2025.4.30/guides/solr/concepts/solropsrequests)
    - [Vertical Scaling Overview](/docs/v2025.4.30/guides/solr/scaling/vertical-scaling/overview)

To keep everything isolated, we are going to use a separate namespace called `demo` throughout this tutorial.

```bash
$ kubectl create ns demo
namespace/demo created
```

> **Note:** YAML files used in this tutorial are stored in [docs/examples/solr](/docs/v2025.4.30/examples/solr) directory of [kubedb/docs](https://github.com/kubedb/docs) repository.

## Apply Vertical Scaling on Combined Cluster

Here, we are going to deploy a `Solr` combined cluster using a supported version by `KubeDB` operator. Then we are going to apply vertical scaling on it.

### Prepare Solr Combined Cluster

Now, we are going to deploy a `Solr` Combined cluster database with version `3.6.1`.

### Deploy Solr Combined Cluster

In this section, we are going to deploy a Solr Combined cluster. Then, in the next section we will update the resources of the database using `SolrOpsRequest` CRD. Below is the YAML of the `Solr` CR that we are going to create,

```yaml
apiVersion: kubedb.com/v1alpha2
kind: Solr
metadata:
  name: solr-combined
  namespace: demo
spec:
  version: 9.4.1
  replicas: 2
  zookeeperRef:
    name: zoo
    namespace: demo
  storage:
    accessModes:
      - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi

```

Let's create the `Solr` CR we have shown above,

```bash
$ kubectl create -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/solr/scaling/vertical/combined/solr.yaml
solr.kubedb.com/solr-combined created
```

Now, wait until `solr-cluster` has status `Ready`. i.e,

```bash
$ kubectl get sl -n demo
NAME            TYPE                  VERSION   STATUS   AGE
solr-combined   kubedb.com/v1alpha2   9.4.1     Ready    63m
```

Let's check the Pod containers resources for `data`, `overseer` and `coordinator` of the solr Combined cluster. Run the following command to get the resources of the `broker` and `controller` containers of the Solr Combined cluster

```bash
$ kubectl get pod -n demo solr-combined-0 -o json | jq '.spec.containers[].resources'
{
  "limits": {
    "memory": "2Gi"
  },
  "requests": {
    "cpu": "900m",
    "memory": "2Gi"
  }
}

$ kubectl get pod -n demo solr-combined-1 -o json | jq '.spec.containers[].resources'
{
  "limits": {
    "memory": "2Gi"
  },
  "requests": {
    "cpu": "900m",
    "memory": "2Gi"
  }
}
```

This is the default resources of the Solr Combined cluster set by the `KubeDB` operator.

We are now ready to apply the `SolrOpsRequest` CR to update the resources of this database.

### Vertical Scaling

Here, we are going to update the resources of the combined cluster to meet the desired resources after scaling.

#### Create SolrOpsRequest

In order to update the resources of the database, we have to create a `SolrOpsRequest` CR with our desired resources. Below is the YAML of the `SolrOpsRequest` CR that we are going to create,

```yaml
apiVersion: ops.kubedb.com/v1alpha1
kind: SolrOpsRequest
metadata:
  name: slops-slops-vscale-combined-combined
  namespace: demo
spec:
  databaseRef:
    name: solr-cluster
  type: VerticalScaling
  verticalScaling:
    node:
      resources:
        limits:
          cpu: 1
          memory: 2.5Gi
        requests:
          cpu: 1
          memory: 2.5Gi
```

Here,

- `spec.databaseRef.name` specifies that we are performing vertical scaling operation on `solr-cluster` cluster.
- `spec.type` specifies that we are performing `VerticalScaling` on Solr.
- `spec.VerticalScaling.node` specifies the desired resources after scaling.

Let's create the `SolrOpsRequest` CR we have shown above,

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/solr/scaling/vertical/combined/scaling.yaml
solropsrequest.ops.kubedb.com/slops-slops-vscale-combined-combined created
```

#### Verify Solr Combined cluster resources updated successfully

If everything goes well, `KubeDB` Ops-manager operator will update the resources of `Solr` object and related `PetSets` and `Pods`.

Let's wait for `SolrOpsRequest` to be `Successful`.  Run the following command to watch `SolrOpsRequest` CR,

```bash
$ kubectl get slops -n demo
NAME                    TYPE              STATUS       AGE
slops-slops-vscale-combined-combined   VerticalScaling   Successful   3m9s
```

We can see from the above output that the `SolrOpsRequest` has succeeded. If we describe the `SolrOpsRequest` we will get an overview of the steps that were followed to scale the cluster.

```bash
$ kubectl describe slops -n demo slops-vscale-combined
Name:         slops-vscale-combined
Namespace:    demo
Labels:       <none>
Annotations:  <none>
API Version:  ops.kubedb.com/v1alpha1
Kind:         SolrOpsRequest
Metadata:
  Creation Timestamp:  2024-11-11T12:01:22Z
  Generation:          1
  Resource Version:    2357236
  UID:                 943f26ba-1cca-451c-ba90-8eeb73e5e386
Spec:
  Apply:  IfReady
  Database Ref:
    Name:  solr-combined
  Type:    VerticalScaling
  Vertical Scaling:
    Node:
      Resources:
        Limits:
          Cpu:     1
          Memory:  2.5Gi
        Requests:
          Cpu:     1
          Memory:  2.5Gi
Status:
  Conditions:
    Last Transition Time:  2024-11-11T12:01:22Z
    Message:               Solr ops-request has started to vertically scaling the Solr nodes
    Observed Generation:   1
    Reason:                VerticalScaling
    Status:                True
    Type:                  VerticalScaling
    Last Transition Time:  2024-11-11T12:01:25Z
    Message:               Successfully updated PetSets Resources
    Observed Generation:   1
    Reason:                UpdatePetSets
    Status:                True
    Type:                  UpdatePetSets
    Last Transition Time:  2024-11-11T12:03:15Z
    Message:               Successfully Restarted Pods With Resources
    Observed Generation:   1
    Reason:                RestartPods
    Status:                True
    Type:                  RestartPods
    Last Transition Time:  2024-11-11T12:01:30Z
    Message:               get pod; ConditionStatus:True; PodName:solr-combined-0
    Observed Generation:   1
    Status:                True
    Type:                  GetPod--solr-combined-0
    Last Transition Time:  2024-11-11T12:01:30Z
    Message:               evict pod; ConditionStatus:True; PodName:solr-combined-0
    Observed Generation:   1
    Status:                True
    Type:                  EvictPod--solr-combined-0
    Last Transition Time:  2024-11-11T12:01:35Z
    Message:               running pod; ConditionStatus:False
    Observed Generation:   1
    Status:                False
    Type:                  RunningPod
    Last Transition Time:  2024-11-11T12:02:25Z
    Message:               get pod; ConditionStatus:True; PodName:solr-combined-1
    Observed Generation:   1
    Status:                True
    Type:                  GetPod--solr-combined-1
    Last Transition Time:  2024-11-11T12:02:25Z
    Message:               evict pod; ConditionStatus:True; PodName:solr-combined-1
    Observed Generation:   1
    Status:                True
    Type:                  EvictPod--solr-combined-1
    Last Transition Time:  2024-11-11T12:03:15Z
    Message:               Successfully completed the vertical scaling for RabbitMQ
    Observed Generation:   1
    Reason:                Successful
    Status:                True
    Type:                  Successful
  Observed Generation:     1
  Phase:                   Successful
Events:
  Type     Reason                                                    Age    From                         Message
  ----     ------                                                    ----   ----                         -------
  Normal   Starting                                                  2m28s  KubeDB Ops-manager Operator  Start processing for SolrOpsRequest: demo/slops-vscale-combined
  Normal   Starting                                                  2m28s  KubeDB Ops-manager Operator  Pausing Solr databse: demo/solr-combined
  Normal   Successful                                                2m28s  KubeDB Ops-manager Operator  Successfully paused Solr database: demo/solr-combined for SolrOpsRequest: slops-vscale-combined
  Normal   UpdatePetSets                                             2m25s  KubeDB Ops-manager Operator  Successfully updated PetSets Resources
  Warning  get pod; ConditionStatus:True; PodName:solr-combined-0    2m20s  KubeDB Ops-manager Operator  get pod; ConditionStatus:True; PodName:solr-combined-0
  Warning  evict pod; ConditionStatus:True; PodName:solr-combined-0  2m20s  KubeDB Ops-manager Operator  evict pod; ConditionStatus:True; PodName:solr-combined-0
  Warning  running pod; ConditionStatus:False                        2m15s  KubeDB Ops-manager Operator  running pod; ConditionStatus:False
  Warning  get pod; ConditionStatus:True; PodName:solr-combined-1    85s    KubeDB Ops-manager Operator  get pod; ConditionStatus:True; PodName:solr-combined-1
  Warning  evict pod; ConditionStatus:True; PodName:solr-combined-1  85s    KubeDB Ops-manager Operator  evict pod; ConditionStatus:True; PodName:solr-combined-1
  Normal   RestartPods                                               35s    KubeDB Ops-manager Operator  Successfully Restarted Pods With Resources
  Normal   Starting                                                  35s    KubeDB Ops-manager Operator  Resuming Solr database: demo/solr-combined
  Normal   Successful                                                35s    KubeDB Ops-manager Operator  Successfully resumed Solr database: demo/solr-combined for SolrOpsRequest: slops-vscale-combined
```
Now, we are going to verify from one of the Pod yaml whether the resources of the Combined cluster has updated to meet up the desired state, Let's check,

```bash
$ kubectl get pod -n demo solr-combined-0 -o json | jq '.spec.containers[].resources'
{
  "limits": {
    "cpu": "1",
    "memory": "2560Mi"
  },
  "requests": {
    "cpu": "1",
    "memory": "2560Mi"
  }
}
$ kubectl get pod -n demo solr-combined-1 -o json | jq '.spec.containers[].resources'
{
  "limits": {
    "cpu": "1",
    "memory": "2560Mi"
  },
  "requests": {
    "cpu": "1",
    "memory": "2560Mi"
  }
}

```

The above output verifies that we have successfully scaled up the resources of the Solr Combined cluster.

## Cleaning Up

To clean up the Kubernetes resources created by this tutorial, run:

```bash
kubectl delete sl -n demo solr-cluster
kubectl delete solropsrequest -n demo slops-vscale-combined
kubectl delete ns demo
```

## Next Steps

- Detail concepts of [Solr object](/docs/v2025.4.30/guides/solr/concepts/solr).
- Different Solr Combined clustering modes [here](/docs/v2025.4.30/guides/solr/clustering/combined_cluster).
- Monitor your Solr database with KubeDB using [out-of-the-box Prometheus operator](/docs/v2025.4.30/guides/solr/monitoring/prometheus-operator).

- Monitor your Solr database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2025.4.30/guides/solr/monitoring/prometheus-builtin)
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.4.30/CONTRIBUTING).
