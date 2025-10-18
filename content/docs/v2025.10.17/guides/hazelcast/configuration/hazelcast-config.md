---
title: Configuring Hazelcast Cluster
menu:
  docs_v2025.10.17:
    identifier: hz-configuration-cluster
    name: Cluster Configuration
    parent: hz-configuration
    weight: 15
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

# Configure Hazelcast Cluster

In Hazelcast cluster, nodes work together to provide distributed computing and caching capabilities. In this tutorial, we will see how to configure a Hazelcast cluster.

## Before You Begin

At first, you need to have a Kubernetes cluster, and the `kubectl` command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one by using [kind](https://kind.sigs.k8s.io/docs/user/quick-start/).

Now, install the KubeDB operator in your cluster following the steps [here](/docs/v2025.10.17/setup/README).

To keep things isolated, this tutorial uses a separate namespace called `demo` throughout this tutorial.

```bash
$ kubectl create namespace demo
namespace/demo created

$ kubectl get namespace
NAME                 STATUS   AGE
demo                 Active   9s
```

> Note: YAML files used in this tutorial are stored in [here](https://github.com/kubedb/docs/tree/{{< param "info.version" >}}/docs/examples/hazelcast/configuration/
) in GitHub repository [kubedb/docs](https://github.com/kubedb/docs).

## Find Available StorageClass

We will have to provide `StorageClass` in Hazelcast CR specification. Check available `StorageClass` in your cluster using the following command,

```bash
$ kubectl get storageclass
NAME                 PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
standard (default)   rancher.io/local-path   Delete          WaitForFirstConsumer   false                  1h
```

Here, we have `standard` StorageClass in our cluster from [Local Path Provisioner](https://github.com/rancher/local-path-provisioner).

## Use Custom Configuration

Say we want to enable persistence with custom validation and data load timeout settings. Let's create the `hazelcast.yaml` file with our desired configurations.

**hazelcast.yaml:**

```yaml
hazelcast:
  persistence:
    enabled: true
    validation-timeout-seconds: 2500
    data-load-timeout-seconds: 3000
    auto-remove-stale-data: false
```

Let's create a k8s secret containing the above configuration where the file name will be the key and the file-content as the value:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: hz
  namespace: demo
stringData:
  hazelcast.yaml: |-
    hazelcast:
      persistence:
        enabled: true
        validation-timeout-seconds: 2500
        data-load-timeout-seconds: 3000
        auto-remove-stale-data: false
  hazelcast-client.yaml: |-
```

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/hazelcast/configuration/configsecret-combine.yaml
secret/hz created
```
Before deploying hazelcast we need to create license secret since we are running enterprise version of hazelcast.

```bash
kubectl create secret generic hz-license-key -n demo --from-literal=licenseKey='your hazelcast license key'
secret/hz-license-key created
```
Now that the config secret is created, it needs to be mention in the [Hazelcast](/docs/v2025.10.17/guides/hazelcast/concepts/hazelcast) object's yaml:

```yaml
apiVersion: kubedb.com/v1alpha2
kind: Hazelcast
metadata:
  name: hazelcast-dev
  namespace: demo
spec:
  replicas: 2
  version: 5.5.2
  licenseSecret:
    name: hz-license-key
  configSecret:
    name: hz
  storage:
    accessModes:
      - ReadWriteOnce
    resources:
      requests:
        storage: 1Gi
    storageClassName: longhorn
  storageType: Durable
  deletionPolicy: WipeOut
```

Now, create the Hazelcast object by the following command:

```bash
$ kubectl apply -f https://github.com/kubedb/docs/raw/{{< param "info.version" >}}/docs/examples/hazelcast/configuration/hazelcast-config.yaml
hazelcast.kubedb.com/hazelcast-dev created
```

Now, wait for the Hazelcast to become ready:

```bash
$ kubectl get hz -n demo -w
NAME            TYPE            VERSION   STATUS         AGE
hazelcast-dev   kubedb.com/v1alpha2   5.5.2     Provisioning   0s
hazelcast-dev   kubedb.com/v1alpha2   5.5.2     Provisioning   24s
.
.
hazelcast-dev   kubedb.com/v1alpha2   5.5.2     Ready          92s
```

## Verify Configuration

Let's exec into one of the hazelcast pod that we have created and check the configurations are applied or not:

Exec into the Hazelcast pod:

```bash
$ kubectl exec -it -n demo hazelcast-dev-0 -- bash
hazelcast@hazelcast-dev-0:~$ 
```

Now, execute the following commands to see the configurations:
```bash
hazelcast@hazelcast-dev-0:~$ cat /data/hazelcast/hazelcast.yaml | grep persistence
  persistence:
hazelcast@hazelcast-dev-0:~$ cat /data/hazelcast/hazelcast.yaml | grep enabled
    enabled: true
hazelcast@hazelcast-dev-0:~$ cat /data/hazelcast/hazelcast.yaml | grep validation-timeout-seconds
    validation-timeout-seconds: 2500
hazelcast@hazelcast-dev-0:~$ cat /data/hazelcast/hazelcast.yaml | grep data-load-timeout-seconds
    data-load-timeout-seconds: 3000
```
Here, we can see that our given persistence configuration is applied to the Hazelcast cluster for all nodes.

## Cleanup

To cleanup the Kubernetes resources created by this tutorial, run:

```bash
$ kubectl delete hz -n demo hazelcast-dev 
$ kubectl delete secret -n demo hz 
$ kubectl delete namespace demo
```

## Next Steps

- Detail concepts of [Hazelcast object](/docs/v2025.10.17/guides/hazelcast/concepts/hazelcast).
- Monitor your Hazelcast database with KubeDB using [out-of-the-box Prometheus operator](/docs/v2025.10.17/guides/hazelcast/monitoring/prometheus-operator).

- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2025.10.17/CONTRIBUTING).
