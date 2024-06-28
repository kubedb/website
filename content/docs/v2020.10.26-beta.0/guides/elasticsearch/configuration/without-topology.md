---
title: Using Custom Configuration in Elasticsearch without Topology
menu:
  docs_v2020.10.26-beta.0:
    identifier: es-without-topology-configuration
    name: Without Topology
    parent: es-configuration
    weight: 30
menu_name: docs_v2020.10.26-beta.0
section_menu_id: guides
info:
  cli: v0.14.0-beta.5
  community: v0.14.0-beta.5
  enterprise: v0.1.0-beta.5
  installer: v0.14.0-beta.5
  version: v2020.10.26-beta.0
---

> New to KubeDB? Please start [here](/docs/v2020.10.26-beta.0/README).

# Using Custom Configuration in Elasticsearch without Topology

This tutorial will show you how to use custom configuration in an Elasticsearch cluster in KubeDB without specifying `spec.topology` field.

If you don't know how KubeDB handles custom configuration for an Elasticsearch cluster, please visit [here](/docs/v2020.10.26-beta.0/guides/elasticsearch/configuration/overview).

## Before You Begin

At first, you need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

Now, install KubeDB cli on your workstation and KubeDB operator in your cluster following the steps [here](/docs/v2020.10.26-beta.0/setup/README).

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

At first, let's create two configuration files namely `master-config.yml`, `data-config.yml` and `common-config.yalm` respectively.

Content of `master-config.yml`,

```yaml
node:
  name:  es-node-master
path:
  data: ["/usr/share/elasticsearch/data/master-datadir"]
```

Content of `data-config.yml`,

```yaml
node:
  name:  es-node-data
path:
  data: ["/usr/share/elasticsearch/data/data-datadir"]
http:
  compression: false
```

Content of `common-config.yml`,

```yaml
path:
  logs: /usr/share/elasticsearch/data/common-logdir
```

This time we have added an additional field `http.compression: false` in `data-config.yml` file. By default, this field is set to `true`.

Now, let's create a configMap with these configuration files,

```bash
 $ kubectl create configmap  -n demo es-configuration \
                        --from-file=./common-config.yml \
                        --from-file=./master-config.yml \
                        --from-file=./data-config.yml
configmap/es-configuration created
```

Check that the configMap has these configuration files,

```yaml
$ kubectl get configmap -n demo es-configuration -o yaml
apiVersion: v1
data:
  common-config.yml: |
    path:
      logs: /usr/share/elasticsearch/data/common-logdir
  data-config.yml: |-
    node:
      name:  es-node-data
    path:
      data: ["/usr/share/elasticsearch/data/data-datadir"]
    http:
      compression: false
  master-config.yml: |-
    node:
      name:  es-node-master
    path:
      data: ["/usr/share/elasticsearch/data/master-datadir"]
kind: ConfigMap
metadata:
  name: es-configuration
  namespace: demo
```

Now, create an Elasticsearch crd without topology,

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/elasticsearch/configuration/es-custom.yaml
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
  replicas: 2
  configSecret:
    name: es-configuration
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
$ kubectl get all -n demo -l=kubedb.com/name=custom-elasticsearch
NAME                         READY   STATUS    RESTARTS   AGE
pod/custom-elasticsearch-0   1/1     Running   0          74s
pod/custom-elasticsearch-1   1/1     Running   0          55s

NAME                                  TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
service/custom-elasticsearch          ClusterIP   10.0.6.32    <none>        9200/TCP   75s
service/custom-elasticsearch-master   ClusterIP   10.0.5.155   <none>        9300/TCP   75s

NAME                                    READY   AGE
statefulset.apps/custom-elasticsearch   2/2     74s

NAME                                                      AGE
appbinding.appcatalog.appscode.com/custom-elasticsearch   5s
```

Check secrets created by KubeDB,

```bash
$ kubectl get secret -n demo -l=kubedb.com/name=custom-elasticsearch
NAME                        TYPE     DATA   AGE
custom-elasticsearch-auth   Opaque   2      99s
custom-elasticsearch-cert   Opaque   5      99s
```

Once everything is created, Elasticsearch will go to `Running` state. Check that Elasticsearch is in running state.

```bash
$ kubectl get es -n demo custom-elasticsearch
NAME                   VERSION   STATUS    AGE
custom-elasticsearch   7.3.2     Running   110s
```

## Verify Configuration

Now, we will connect with the Elasticsearch cluster we have created. We will query for nodes settings to verify that the cluster is using the custom configuration we have provided.

At first, forward `9200` port of `custom-elasticsearch-0` pod. Run following command on a separate terminal,

```bash
$ kubectl port-forward -n demo custom-elasticsearch-0 9200
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
    oopcbph6
  ```

Now, we will query for settings of all nodes in an Elasticsearch cluster,

```bash
$ curl --user "elastic:oopcbph6" "localhost:9200/_nodes/_all/settings?pretty"
```

This will return a large JSON with nodes settings information. Here is the prettified JSON response,

```json
{
    "_nodes": {
        "total": 2,
        "successful": 2,
        "failed": 0
    },
    "cluster_name": "custom-elasticsearch",
    "nodes": {
        "qhH6AJ9JTU6SlYHKF3kwOQ": {
            "name": "es-node-master",
            "roles": [
                "master",
                "data",
                "ingest"
            ],
            "settings": {
                "node": {
                    "name": "es-node-master",
                    "data": "true",
                    "ingest": "true",
                    "master": "true"
                },
                "path": {
                    "data": [
                        "/usr/share/elasticsearch/data/master-datadir"
                    ],
                    "logs": "/usr/share/elasticsearch/data/common-logdir",
                    "home": "/elasticsearch"
                },
                "http": {
                    "compression": "false",
                },
            }
        },
        "mNgVB7i6RkOPtRmXzjqPFA": {
            "name": "es-node-master",
            "roles": [
                "master",
                "data",
                "ingest"
            ],
            "settings": {
                "node": {
                    "name": "es-node-master",
                    "data": "true",
                    "ingest": "true",
                    "master": "true"
                },
                "path": {
                    "data": [
                        "/usr/share/elasticsearch/data/master-datadir"
                    ],
                    "logs": "/usr/share/elasticsearch/data/common-logdir",
                    "home": "/elasticsearch"
                },
                "http": {
                    "compression": "false",
                },
            }
        }
    }
}
```

We have total two nodes in our Elasticsearch cluster. Here, we have an array of these node's settings information. Here, `"roles"` field represents if the node is working as either a master, ingest/client or data node. We can see from the response that all the nodes are working as master, ingest/client and data node simultaneously.

From the response above, we can see that `"node.name"` and `"path.data"` keys are set to the value we have specified in `master-config.yml` file. Note that, we had also specified these keys in `data-config.yml` file but they were overridden by the value in `master-config.yml` file. This happened because config values in `master-config.yml` file has higher precedence than the `data-config.yml` file. However, note that `"http.compress"` field has been applied from `data-config.yml` file as `master-config.yml` file does not have this field.

Also note that, the `"path.logs"` field of each node is set to the value we have specified in `common-config.yml` file.

## Cleanup

To cleanup the Kubernetes resources created by this tutorial, run:

```bash
kubectl patch -n demo es/custom-elasticsearch -p '{"spec":{"terminationPolicy":"WipeOut"}}' --type="merge"
kubectl delete -n demo es/custom-elasticsearch

kubectl delete  -n demo configmap/es-configuration

kubectl delete ns demo
```

To uninstall KubeDB follow this [guide](/docs/v2020.10.26-beta.0/setup/README).
