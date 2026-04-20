---
title: Redis External Connection Initialization
menu:
  docs_v2025.10.17:
    identifier: rd-announce-initialization
    name: Initialization
    parent: rd-announce
    weight: 10
menu_name: docs_v2025.10.17
section_menu_id: guides
info:
  autoscaler: v0.44.0
  cli: v0.59.0
  dashboard: v0.35.0
  installer: v2025.10.17
  ops-manager: v0.46.0
  provisioner: v0.59.0
  schema-manager: v0.35.0
  ui-server: v0.35.0
  version: v2025.10.17
  webhook-server: v0.35.0
---

> New to KubeDB? Please start [here](/docs/v2025.10.17/README).

# Redis External Connection Initialization using Redis Announce

Redis Announce is a feature in Redis that enables external connections to Redis replica sets deployed within Kubernetes. It allows applications or clients outside the Kubernetes cluster to connect to individual replica set members by mapping internal Kubernetes DNS names to externally accessible hostnames or IP addresses. This is useful for scenarios where external access is needed, such as hybrid deployments or connecting from outside the cluster.

## Before You Begin

At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/v2025.10.17/setup/README).

To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial.

```bash
$ kubectl create ns demo
namespace/demo created
```
> Note: YAML files used in this tutorial are stored in [docs/examples/redis](https://github.com/kubedb/docs/tree/{{< param "info.version" >}}/docs/examples/redis) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Redis Cluster with Announce

### Create DNS Records
Create dns/IP with port and bus-port, let's say, `Redis` has `2` replicas and `3` shards.

Example:

|         DNS/IP             |  port    | bus port  |
|----------------------------|:--------:|:---------:|
| rd0-0.kubedb.appscode      | 10050    | 10056     |
| rd0-1.kubedb.appscode      | 10051    | 10057     |
| rd1-0.kubedb.appscode      | 10052    | 10058     |
| rd1-1.kubedb.appscode      | 10053    | 10059     |
| rd2-0.kubedb.appscode      | 10054    | 10060     |
| rd2-1.kubedb.appscode      | 10055    | 10061     |

Below is the YAML for Redis Announce.

```yaml
apiVersion: kubedb.com/v1
kind: Redis
metadata:
  name: redis-announce
  namespace: demo
spec:
  version: 7.4.0
  mode: Cluster
  cluster:
    shards: 3
    replicas: 2
    announce:
      type: hostname
      shards:
        - endpoints:
            - "rd0-0.kubedb.appscode:10050@10056"
            - "rd0-1.kubedb.appscode:10051@10057"
        - endpoints:
            - "rd1-0.kubedb.appscode:10052@10058"
            - "rd1-1.kubedb.appscode:10053@10059"
        - endpoints:
            - "rd2-0.kubedb.appscode:10054@10060"
            - "rd2-1.kubedb.appscode:10055@10061"
  storageType: Durable
  storage:
    resources:
      requests:
        storage: 20M
    storageClassName: "standard"
    accessModes:
      - ReadWriteOnce
  deletionPolicy: WipeOut
```

Here,
- `.spec.cluster.announce.type` specifies preferred dns type. It can be hostname or ip.
- `.spec.cluster.announce.shards` specifies the DNS names for each shards in the replica set.
- `.spec.cluster.announce.shards.endpoints`  specifies the DNS names for each pod in the specific shard.

> Note: Here we need to add endpoints as <IP/DNS>:< port>@<bus-port>

Now, wait until `redis-announce` has status `Ready`. i.e,

```bash
$ watch kubectl get rd -n demo
Every 2.0s: kubectl get rd -n demo
NAME            VERSION   STATUS   AGE
redis-announce   7.4.0     Ready    6m56s
```

To check assigned DNS/IP or port or bust port list for every pod you can run:

```bash
$ kubectl exec -it -n demo redis-announce-shard0-0 -- cat /tmp/db-endpoints.txt
redis-announce-shard0-0 rd0-0.kubedb.appscode 10050 10056
redis-announce-shard0-1 rd0-1.kubedb.appscode 10051 10057
redis-announce-shard1-0 rd1-0.kubedb.appscode 10052 10058
redis-announce-shard1-1 rd1-1.kubedb.appscode 10053 10059
redis-announce-shard2-0 rd2-0.kubedb.appscode 10054 10060
redis-announce-shard2-1 rd2-1.kubedb.appscode 10055 10061
```

## Redis Cluster without Announce

If the Redis cluster is initialized without announces, this will get start with it's own pod IP.

Below is the YAML for Redis:

```yaml
apiVersion: kubedb.com/v1
kind: Redis
metadata:
  name: redis
  namespace: demo
spec:
  version: 7.4.0
  mode: Cluster
  cluster:
    shards: 3
    replicas: 2
  storageType: Durable
  storage:
    resources:
      requests:
        storage: 20M
    storageClassName: "standard"
    accessModes:
      - ReadWriteOnce
  deletionPolicy: WipeOut
```

Now, wait until `redis` has status `Ready`. i.e,

```bash
$ watch kubectl get rd -n demo
Every 2.0s: kubectl get rd -n demo
NAME            VERSION   STATUS   AGE
redis           7.4.0     Ready    6m56s
```

To check the endpoint type run:

```bash
$ kubectl exec -it -n demo redis-shard0-0 -- cat /tmp/endpoint-type.txt
ip
```

To check assigned DNS/IP or port or bust port list for every pod you can run:

```bash
$ kubectl exec -it -n demo redis-shard0-0 -- cat /tmp/db-endpoints.txt
redis-shard0-0 10.244.0.34 6379 16379
redis-shard0-1 10.244.0.27 6379 16379
redis-shard1-0 10.244.0.30 6379 16379
redis-shard1-1 10.244.0.28 6379 16379
redis-shard2-0 10.244.0.33 6379 16379
redis-shard2-1 10.244.0.32 6379 16379
```

## Cleaning up

To cleanup the Kubernetes resources created by this tutorial, run:

```bash
kubectl delete rd -n demo redis
kubectl delete rd -n demo redis-announce
```

If you would like to uninstall the KubeDB operator, please follow the steps [here](/docs/v2025.10.17/setup/README).

## Next Steps

- [Backup and Restore](/docs/v2025.10.17/guides/redis/backup/kubestash/overview/) Redis databases using KubeStash.
- Initialize [Redis with Script](/docs/v2025.10.17/guides/redis/initialization/using-script).
- Monitor your Redis database with KubeDB using [out-of-the-box Prometheus operator](/docs/v2025.10.17/guides/redis/monitoring/using-prometheus-operator).
- Monitor your Redis database with KubeDB using [out-of-the-box builtin-Prometheus](/docs/v2025.10.17/guides/redis/monitoring/using-builtin-prometheus).
- Use [private Docker registry](/docs/v2025.10.17/guides/redis/private-registry/using-private-registry) to deploy Redis with KubeDB.
- Detail concepts of [Redis object](/docs/v2025.10.17/guides/redis/concepts/redis).
- Detail concepts of [redisVersion object](/docs/v2025.10.17/guides/redis/concepts/catalog).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.10.17/CONTRIBUTING).