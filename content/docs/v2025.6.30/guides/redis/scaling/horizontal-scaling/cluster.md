---
title: Horizontal Scaling Redis Cluster
menu:
  docs_v2025.6.30:
    identifier: rd-horizontal-scaling-cluster
    name: Cluster
    parent: rd-horizontal-scaling
    weight: 20
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

# Horizontal Scale Redis Cluster

This guide will give an overview on how KubeDB Ops-manager operator scales up or down `Redis` database shards and replicas Redis in Cluster mode.


## Before You Begin

- At first, you need to have a Kubernetes cluster, and the `kubectl` command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

- Install `KubeDB` Community and Enterprise operator in your cluster following the steps [here](/docs/v2025.6.30/setup/README).

- You should be familiar with the following `KubeDB` concepts:
  - [Redis](/docs/v2025.6.30/guides/redis/concepts/redis)
  - [RedisOpsRequest](/docs/v2025.6.30/guides/redis/concepts/redisopsrequest)
  - [Horizontal Scaling Overview](/docs/v2025.6.30/guides/redis/scaling/horizontal-scaling/overview)

To keep everything isolated, we are going to use a separate namespace called `demo` throughout this tutorial.

```bash
$ kubectl create ns demo
namespace/demo created
```

> **Note:** YAML files used in this tutorial are stored in [docs/examples/redis](/docs/v2025.6.30/examples/redis) directory of [kubedb/docs](https://github.com/kubedb/docs) repository.

## Apply Horizontal Scaling on Cluster

Here, we are going to deploy a `Redis` cluster using a supported version by `KubeDB` operator. Then we are going to apply horizontal scaling on it.

### Prepare Redis Cluster Database

Now, we are going to deploy a `Redis` cluster database with version `6.2.14`.

### Deploy Redis Cluster 

In this section, we are going to deploy a Redis cluster database. Then, in the next section we will update the resources of the database using `RedisOpsRequest` CRD. Below is the YAML of the `Redis` CR that we are going to create,

```yaml
apiVersion: kubedb.com/v1
kind: Redis
metadata:
  name: redis-cluster
  namespace: demo
spec:
  version: 6.2.14
  mode: Cluster
  cluster:
    shards: 3
    replicas: 2
  storageType: Durable
  storage:
    resources:
      requests:
        storage: "1Gi"
    storageClassName: "standard"
    accessModes:
      - ReadWriteOnce
  deletionPolicy: Halt
```

Let's create the `Redis` CR we have shown above, 

```bash
$ kubectl create -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/redis/scaling/horizontal-scaling/rd-cluster.yaml
redis.kubedb.com/redis-cluster created
```

Now, wait until `rd-cluster` has status `Ready`. i.e. ,

```bash
$ kubectl get redis -n demo
NAME            VERSION   STATUS   AGE
redis-cluster   6.2.14     Ready    7m
```

Let's check the number of shards and replicas this database has from the Redis object

```bash
$ kubectl get redis -n demo redis-cluster -o json | jq '.spec.cluster.shards'
3
$ kubectl get redis -n demo redis-cluster -o json | jq '.spec.cluster.replicas'
2
```

Now let's connect to redis-cluster using `redis-cli` and verify master and replica count of the cluster
```bash
$ kubectl exec -it -n demo redis-cluster-shard0-0 -c redis -- redis-cli -c cluster nodes | grep master
914e68b97816a9aae0ee90e68b918a096baf479b 10.244.0.159:6379@16379 myself,master - 0 1675770134000 1 connected 0-5460
a70923f477d7b37ce3c0beb7ed891f6501ac48ef 10.244.0.165:6379@16379 master - 0 1675770134111 3 connected 10923-16383
94ee446e08494f1c5c826e03151dd1889585140e 10.244.0.162:6379@16379 master - 0 1675770134813 2 connected 5461-10922

$ kubectl exec -it -n demo redis-cluster-shard0-0 -c redis -- redis-cli -c cluster nodes | grep slave | wc -l
6
```

We can see from above output that there are 3 masters and each master has 2 replicas. So, total 6 replicas in the cluster. Each master and its two replicas belongs to a shard.

We are now ready to apply the `RedisOpsRequest` CR to update the resources of this database.

### Horizontal Scaling

Here, we are going to scale up the shards and scale down the replicas of the redis cluster to meet the desired resources after scaling.

#### Create RedisOpsRequest

In order to  scale up the shards and scale down the replicas of the redis cluster, we have to create a `RedisOpsRequest` CR with our desired number of shards and replicas. Below is the YAML of the `RedisOpsRequest` CR that we are going to create,

```yaml
apiVersion: ops.kubedb.com/v1alpha1
kind: RedisOpsRequest
metadata:
  name: redisops-horizontal
  namespace: demo
spec:
  type: HorizontalScaling
  databaseRef:
    name: redis-cluster
  horizontalScaling:
    shards: 4
    replicas: 1
```

Here,

- `spec.databaseRef.name` specifies that we are performing horizontal scaling operation on `redis-cluster` database.
- `spec.type` specifies that we are performing `HorizontalScaling` on our database.
- `spec.horizontalScaling.shards` specifies the desired number of shards after scaling.
- `spec.horizontalScaling.replicas` specifies the desired number of replicas after scaling.

Let's create the `RedisOpsRequest` CR we have shown above,

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/redis/scaling/horizontal-scaling/horizontal-cluster.yaml
redisopsrequest.ops.kubedb.com/redisops-horizontal created
```

#### Verify Redis Cluster resources updated successfully 

If everything goes well, `KubeDB` Enterprise operator will update the replicas and shards of `Redis` object and related `PetSets`.

Let's wait for `RedisOpsRequest` to be `Successful`.  Run the following command to watch `RedisOpsRequest` CR,

```bash
$ watch kubectl get redisopsrequest -n demo redisops-horizontal
NAME                  TYPE                STATUS       AGE
redisops-horizontal   HorizontalScaling   Successful   6m11s
```

Now, we are going to verify if the number of shards and replicas the redis cluster has updated to meet up the desired state, Let's check,

```bash
$ kubectl get redis -n demo redis-cluster -o json | jq '.spec.cluster.shards'
4
$ kubectl get redis -n demo redis-cluster -o json | jq '.spec.cluster.replicas'
1
```

Now let's connect to redis-cluster using `redis-cli` and verify master and replica count of the cluster
```bash
$ kubectl exec -it -n demo redis-cluster-shard0-0 -c redis -- redis-cli -c cluster nodes | grep master
94a9278454d934d4b5058d3e49b4bca14ff88975 10.244.0.176:6379@16379 master - 0 1675770403000 6 connected 0-1364 5461-6826 10923-12287
914e68b97816a9aae0ee90e68b918a096baf479b 10.244.0.159:6379@16379 myself,master - 0 1675770403000 1 connected 1365-5460
a70923f477d7b37ce3c0beb7ed891f6501ac48ef 10.244.0.165:6379@16379 master - 0 1675770404571 3 connected 12288-16383
94ee446e08494f1c5c826e03151dd1889585140e 10.244.0.162:6379@16379 master - 0 1675770403667 2 connected 6827-10922

$ kubectl exec -it -n demo redis-cluster-shard0-0 -c redis -- redis-cli -c cluster nodes | grep slave | wc -l
4
```

The above output verifies that we have successfully scaled up the shards and scaled down the replicas of the Redis cluster database. The slots in redis shard 
is also distributed among 4 master.

## Cleaning up

To clean up the Kubernetes resources created by this tutorial, run:

```bash

$ kubectl patch -n demo rd/redis-cluster -p '{"spec":{"deletionPolicy":"WipeOut"}}' --type="merge"
redis.kubedb.com/redis-cluster patched

$ kubectl delete -n demo redis redis-cluster
redis.kubedb.com "redis-cluster" deleted

$ kubectl delete -n demo redisopsrequest redisops-horizontal 
redisopsrequest.ops.kubedb.com "redisops-horizontal " deleted
```