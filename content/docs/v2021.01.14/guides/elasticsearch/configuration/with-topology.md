---
title: Using Custom Configuration in Elasticsearch with Topology
menu:
  docs_v2021.01.14:
    identifier: es-with-topology-configuration
    name: With Topology
    parent: es-configuration
    weight: 20
menu_name: docs_v2021.01.14
section_menu_id: guides
info:
  autoscaler: v0.1.0
  cli: v0.16.0
  community: v0.16.0
  enterprise: v0.3.0
  installer: v0.16.0
  version: v2021.01.14
---

> New to KubeDB? Please start [here](/docs/v2021.01.14/README).

# Using Custom Configuration in Elasticsearch with Topology

This tutorial will show you how to use custom configuration in an Elasticsearch cluster in KubeDB specifying `spec.topology` field.

If you don't know how KubeDB handles custom configuration for an Elasticsearch cluster, please visit [here](/docs/v2021.01.14/guides/elasticsearch/configuration/overview).

## Before You Begin

At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/v2021.01.14/setup/README).

To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial.

```bash
$ kubectl create ns demo
namespace/demo created

$ kubectl get ns demo
NAME    STATUS  AGE
demo    Active  5s
```

> Note: YAML files used in this tutorial are stored in [docs/examples/elasticsearch](https://github.com/kubedb/docs/tree/{{< param "info.version" >}}/docs/examples/elasticsearch) folder in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Use Custom Configuration

At first, let's create four configuration files namely `master-config.yml`, `client-config.yml`, `data-config.yml` and `common-config.yalm`.

Content of `master-config.yml`,

```yaml
node:
  name:  es-node-master
path:
  data: ["/usr/share/elasticsearch/data/master-datadir"]
```

Content of `client-config.yml`,

```yaml
node:
  name:  es-node-client
path:
  data: ["/usr/share/elasticsearch/data/client-datadir"]
```

Content of `data-config.yml`,

```yaml
node:
  name:  es-node-data
path:
  data: ["/usr/share/elasticsearch/data/data-datadir"]
```

Content of `common-config.yml`,

```yaml
path:
  logs: /usr/share/elasticsearch/data/common-logdir
```

Now, let's create a configMap with these configuration files,

```bash
 $ kubectl create configmap -n demo es-configuration \
                        --from-file=./common-config.yml \
                        --from-file=./master-config.yml \
                        --from-file=./data-config.yml \
                        --from-file=./client-config.yml
configmap/es-configuration created
```

Check that the configMap has these configuration files,

```yaml
$ kubectl get configmap -n demo es-configuration -o yaml
apiVersion: v1
data:
  client-config.yml: |-
    node:
      name:  es-node-client
    path:
      data: ["/usr/share/elasticsearch/data/client-datadir"]
  common-config.yml: |
    path:
      logs: /usr/share/elasticsearch/data/common-logdir
  data-config.yml: |-
    node:
      name:  es-node-data
    path:
      data: ["/usr/share/elasticsearch/data/data-datadir"]
  master-config.yml: |-
    node:
      name:  es-node-master
    path:
      data: ["/usr/share/elasticsearch/data/master-datadir"]
kind: ConfigMap
metadata:
  ...
  name: es-configuration
  namespace: demo
  ...
```

Now, create an Elasticsearch crd with topology specified,

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/elasticsearch/configuration/es-custom-with-topology.yaml
elasticsearch.kubedb.com/custom-elasticsearch created
```

Below is the YAML for the Elasticsearch crd we just created.

```yaml
apiVersion: kubedb.com/v1alpha2
kind: Elasticsearch
metadata:
  name: custom-elasticsearch
  namespace: demo
spec:
  version: 7.3.2
  configSecret:
    name: es-configuration
  topology:
    master:
      suffix: master
      replicas: 1
      storage:
        storageClassName: "standard"
        accessModes:
        - ReadWriteOnce
        resources:
          requests:
            storage: 1Gi
    data:
      suffix: data
      replicas: 1
      storage:
        storageClassName: "standard"
        accessModes:
        - ReadWriteOnce
        resources:
          requests:
            storage: 1Gi
    ingest:
      suffix: ingest
      replicas: 2
      storage:
        storageClassName: "standard"
        accessModes:
        - ReadWriteOnce
        resources:
          requests:
            storage: 1Gi
```

Now, wait for few minutes. KubeDB will create necessary secrets, services, and statefulsets.

Check resources created in `demo` namespace by KubeDB,

```bash
$ kubectl get all -n demo -l=app.kubernetes.io/instance=custom-elasticsearch
NAME                                READY   STATUS    RESTARTS   AGE
pod/client-custom-elasticsearch-0   1/1     Running   0          2m5s
pod/client-custom-elasticsearch-1   1/1     Running   0          98s
pod/data-custom-elasticsearch-0     1/1     Running   0          61s
pod/master-custom-elasticsearch-0   1/1     Running   0          79s

NAME                                  TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
service/custom-elasticsearch          ClusterIP   10.0.12.187   <none>        9200/TCP   2m6s
service/custom-elasticsearch-master   ClusterIP   10.0.12.200   <none>        9300/TCP   2m6s

NAME                                           READY   AGE
statefulset.apps/client-custom-elasticsearch   2/2     2m6s
statefulset.apps/data-custom-elasticsearch     1/1     62s
statefulset.apps/master-custom-elasticsearch   1/1     80s

NAME                                                      AGE
appbinding.appcatalog.appscode.com/custom-elasticsearch   14s
```

Check secrets created by KubeDB,

```bash
$ kubectl get secret -n demo -l=app.kubernetes.io/instance=custom-elasticsearch
NAME                        TYPE     DATA   AGE
custom-elasticsearch-auth   Opaque   2      2m35s
custom-elasticsearch-cert   Opaque   5      2m35s
```

Once everything is created, Elasticsearch will go to `Running` state. Check that Elasticsearch is in running state.

```bash
$ kubectl get es -n demo custom-elasticsearch
NAME                   VERSION   STATUS    AGE
custom-elasticsearch   7.3.2     Running   2m51s
```

## Verify Configuration

Now, we will connect with the Elasticsearch cluster we have created. We will query for nodes settings to verify that the cluster is using the custom configuration we have provided.

At first, forward `9200` port of `client-custom-elasticsearch-0` pod. Run following command on a separate terminal,

```bash
$ kubectl port-forward -n demo client-custom-elasticsearch-0 9200
Forwarding from 127.0.0.1:9200 -> 9200
Forwarding from [::1]:9200 -> 9200
```

Now, we can connect to the database at `localhost:9200`. Let's find out necessary connection information first.

**Connection information:**

- Address: `localhost:9200`
- Username: Run following command to get *username*

  ```bash
  $ kubectl get secrets -n demo custom-elasticsearch-auth -o jsonpath='{.data.\ADMIN_USERNAME}' | base64 -d
    elastic
  ```

- Password: Run following command to get *password*

  ```bash
  $ kubectl get secrets -n demo custom-elasticsearch-auth -o jsonpath='{.data.\ADMIN_PASSWORD}' | base64 -d
    h4tcobpx
  ```

Now, we will query for settings of all nodes in an Elasticsearch cluster,

```bash
$ curl --user "elastic:h4tcobpx" "localhost:9200/_nodes/_all/settings?pretty"
```

This will return a large JSON with nodes settings information. Here is the prettified JSON response,

```json
{
    "_nodes": {
        "total": 4,
        "successful": 4,
        "failed": 0
    },
    "cluster_name": "custom-elasticsearch",
    "nodes": {
        "fA7g2r7rTV--FZzusuctww": {
            "name": "es-node-client",
            "roles": [
                "ingest"
            ],
            "settings": {
                "node": {
                    "name": "es-node-client",
                    "data": "false",
                    "ingest": "true",
                    "master": "false"
                },
                "path": {
                    "data": [
                        "/usr/share/elasticsearch/data/client-datadir"
                    ],
                    "logs": "/usr/share/elasticsearch/data/common-logdir",
                    "home": "/elasticsearch"
                },
            }
        },
        "_8HsT6oZTAGf9Gmz0kInsA": {
            "name": "es-node-client",
            "roles": [
                "ingest"
            ],
            "settings": {
                "node": {
                    "name": "es-node-client",
                    "data": "false",
                    "ingest": "true",
                    "master": "false"
                },
                "path": {
                    "data": [
                        "/usr/share/elasticsearch/data/client-datadir"
                    ],
                    "logs": "/usr/share/elasticsearch/data/common-logdir",
                    "home": "/elasticsearch"
                },
            }
        },
        "pT1cxPVNQU-UBkjcj6JSzw": {
            "name": "es-node-master",
            "roles": [
                "master"
            ],
            "settings": {
                "node": {
                    "name": "es-node-master",
                    "data": "false",
                    "ingest": "false",
                    "master": "true"
                },
                "path": {
                    "data": [
                        "/usr/share/elasticsearch/data/master-datadir"
                    ],
                    "logs": "/usr/share/elasticsearch/data/common-logdir",
                    "home": "/elasticsearch"
                },
            }
        },
        "tBecrUhUTlO9x5kXlPAR5A": {
            "name": "es-node-data",
            "roles": [
                "data"
            ],
            "settings": {
                "node": {
                    "name": "es-node-data",
                    "data": "true",
                    "ingest": "false",
                    "master": "false"
                },
                "path": {
                    "data": [
                        "/usr/share/elasticsearch/data/data-datadir"
                    ],
                    "logs": "/usr/share/elasticsearch/data/common-logdir",
                    "home": "/elasticsearch"
                },
            }
        }
    }
}
```

We have total four (1 master + 2 client + 1 data) nodes in our Elasticsearch cluster. Here, we have an array of these node's settings information. Here, `"roles"` field represents if the node is working as either a master, ingest/client or data node.

From the response above, we can see that `"node.name"` and `"path.data"` fields are set according to node rules to the value we have specified in configuration files.

Note that, the `"path.logs"` field of each node is set to the value we have specified in `common-config.yml` file.

## Cleanup

To cleanup the Kubernetes resources created by this tutorial, run:

```bash
kubectl patch -n demo es/custom-elasticsearch -p '{"spec":{"terminationPolicy":"WipeOut"}}' --type="merge"
kubectl delete -n demo es/custom-elasticsearch

kubectl delete  -n demo configmap/es-configuration

kubectl delete ns demo
```

To uninstall KubeDB follow this [guide](/docs/v2021.01.14/setup/README).
