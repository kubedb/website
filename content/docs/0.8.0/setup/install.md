---
title: Install
menu:
  docs_0.8.0:
    identifier: install-kubedb
    name: Install
    parent: setup
    weight: 10
menu_name: docs_0.8.0
section_menu_id: setup
info:
  version: 0.8.0
---

> New to KubeDB? Please start [here](/docs/0.8.0/concepts/README).

# Installation Guide

There are 2 parts to installing KubeDB. You need to install a Kubernetes operator in your cluster using scripts or via Helm and download kubedb cli on your workstation. You can also use kubectl cli with KubeDB custom resource objects.


## Install KubeDB Operator

To use `kubedb`, you will need to install KubeDB [operator](https://github.com/kubedb/operator). KubeDB operator can be installed via a script or as a Helm chart.

<ul class="nav nav-tabs" id="installerTab" role="tablist">
  <li class="nav-item">
    <a class="nav-link active" id="script-tab" data-toggle="tab" href="#script" role="tab" aria-controls="script" aria-selected="true">Script</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="helm-tab" data-toggle="tab" href="#helm" role="tab" aria-controls="helm" aria-selected="false">Helm</a>
  </li>
</ul>
<div class="tab-content" id="installerTabContent">
  <div class="tab-pane fade show active" id="script" role="tabpanel" aria-labelledby="script-tab">

## Using Script

To install KubeDB in your Kubernetes cluster, run the following command:

```console
$ curl -fsSL https://raw.githubusercontent.com/kubedb/cli/0.8.0/hack/deploy/kubedb.sh | bash
```

After successful installation, you should have a `kubedb-operator-***` pod running in the `kube-system` namespace.

```console
$ kubectl get pods -n kube-system | grep kubedb-operator
kubedb-operator-65d97f8cf9-8c9tj        2/2       Running   0          1m
```

#### Customizing Installer

The installer script and associated yaml files can be found in the [/hack/deploy](https://github.com/kubedb/cli/tree/0.8.0/hack/deploy) folder. You can see the full list of flags available to installer using `-h` flag.

```console
$ curl -fsSL https://raw.githubusercontent.com/kubedb/cli/0.8.0/hack/deploy/kubedb.sh | bash -s -- -h
kubedb.sh - install kubedb operator

kubedb.sh [options]

options:
-h, --help                         show brief help
-n, --namespace=NAMESPACE          specify namespace (default: kube-system)
    --rbac                         create RBAC roles and bindings (default: true)
    --docker-registry              docker registry used to pull KubeDB images (default: appscode)
    --image-pull-secret            name of secret used to pull KubeDB operator images
    --run-on-master                run KubeDB operator on master
    --enable-validating-webhook    enable/disable validating webhooks for KubeDB CRDs
    --enable-mutating-webhook      enable/disable mutating webhooks for KubeDB CRDs
    --enable-analytics             send usage events to Google Analytics (default: true)
    --uninstall                    uninstall KubeDB
    --purge                        purges KubeDB crd objects and crds
```

If you would like to run KubeDB operator pod in `master` instances, pass the `--run-on-master` flag:

```console
$ curl -fsSL https://raw.githubusercontent.com/kubedb/cli/0.8.0/hack/deploy/kubedb.sh \
    | bash -s -- --run-on-master [--rbac]
```

KubeDB operator will be installed in a `kube-system` namespace by default. If you would like to run KubeDB operator pod in `kubedb` namespace, pass the `--namespace=kubedb` flag:

```console
$ kubectl create namespace kubedb
$ curl -fsSL https://raw.githubusercontent.com/kubedb/cli/0.8.0/hack/deploy/kubedb.sh \
    | bash -s -- --namespace=kubedb [--run-on-master] [--rbac]
```

If you are using a private Docker registry, you need to pull required images from KubeDB's [Docker Hub account](https://hub.docker.com/r/kubedb/).

To pass the address of your private registry and optionally a image pull secret use flags `--docker-registry` and `--image-pull-secret` respectively.

```console
$ kubectl create namespace kubedb
$ curl -fsSL https://raw.githubusercontent.com/kubedb/cli/0.8.0/hack/deploy/kubedb.sh \
    | bash -s -- --docker-registry=MY_REGISTRY [--image-pull-secret=SECRET_NAME] [--rbac]
```

KubeDB implements [validating and mutating admission webhooks](https://kubernetes.io/docs/admin/admission-controllers/#validatingadmissionwebhook-alpha-in-18-beta-in-19) for KubeDB CRDs. This is enabled by default for Kubernetes 1.9.0 or later releases. To disable this feature, pass the `--enable-validating-webhook=false` and `--enable-mutating-webhook=false` flag respectively.

```console
$ curl -fsSL https://raw.githubusercontent.com/kubedb/cli/0.8.0/hack/deploy/kubedb.sh \
    | bash -s -- --enable-validating-webhook=false --enable-mutating-webhook=false [--rbac]
```

</div>
<div class="tab-pane fade" id="helm" role="tabpanel" aria-labelledby="helm-tab">

## Using Helm

KubeDB can be installed via [Helm](https://helm.sh/) using the [chart](https://github.com/kubedb/cli/tree/0.8.0/chart/kubedb) from [AppsCode Charts Repository](https://github.com/appscode/charts). To install the chart with the release name `my-release`:

```console
$ helm repo add appscode https://charts.appscode.com/stable/
$ helm repo update
$ helm search appscode/kubedb
NAME            CHART VERSION APP VERSION   DESCRIPTION
appscode/kubedb 0.8.0  0.8.0  KubeDB by AppsCode - Production ready databases...

# Kubernetes 1.9.0 or later
$ helm install appscode/kubedb --name kubedb-operator --version 0.8.0 \
  --set apiserver.ca="$(onessl get kube-ca)" \
  --set apiserver.enableValidatingWebhook=true \
  --set apiserver.enableMutatingWebhook=true
```

To install `onessl`, run the following commands:

```console
# Mac OSX amd64:
curl -fsSL -o onessl https://github.com/kubepack/onessl/releases/download/0.3.0/onessl-darwin-amd64 \
  && chmod +x onessl \
  && sudo mv onessl /usr/local/bin/

# Linux amd64:
curl -fsSL -o onessl https://github.com/kubepack/onessl/releases/download/0.3.0/onessl-linux-amd64 \
  && chmod +x onessl \
  && sudo mv onessl /usr/local/bin/

# Linux arm64:
curl -fsSL -o onessl https://github.com/kubepack/onessl/releases/download/0.3.0/onessl-linux-arm64 \
  && chmod +x onessl \
  && sudo mv onessl /usr/local/bin/
```

To see the detailed configuration options, visit [here](https://github.com/kubedb/cli/tree/0.8.0/chart/kubedb).

</div>
</div>

### Installing in GKE Cluster

If you are installing KubeDB on a GKE cluster, you will need cluster admin permissions to install KubeDB operator. Run the following command to grant admin permision to the cluster.

```console
# get current google identity
$ gcloud info | grep Account
Account: [user@example.org]

$ kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user=user@example.org
```


## Verify operator installation

To check if KubeDB operator pods have started, run the following command:

```console
$ kubectl get pods --all-namespaces -l app=kubedb --watch
```

Once the operator pods are running, you can cancel the above command by typing `Ctrl+C`.

Now, to confirm CRD groups have been registered by the operator, run the following command:

```console
$ kubectl get crd -l app=kubedb
```

Now, you are ready to [create your first database](/docs/0.8.0/guides/README) using KubeDB.


## Install KubeDB CLI

KubeDB provides a CLI to work with database objects. Download pre-built binaries from [kubedb/cli Github releases](https://github.com/kubedb/cli/releases) and put the binary to some directory in your `PATH`. To install on Linux 64-bit and MacOS 64-bit you can run the following commands:

```console
# Linux amd 64-bit
wget -O kubedb https://github.com/kubedb/cli/releases/download/0.8.0/kubedb-linux-amd64 \
  && chmod +x kubedb \
  && sudo mv kubedb /usr/local/bin/

# Mac 64-bit
wget -O kubedb https://github.com/kubedb/cli/releases/download/0.8.0/kubedb-darwin-amd64 \
  && chmod +x kubedb \
  && sudo mv kubedb /usr/local/bin/
```

If you prefer to install KubeDB cli from source code, you will need to set up a GO development environment following [these instructions](https://golang.org/doc/code.html). Then, install `kubedb` CLI using `go get` from source code.

```bash
go get github.com/kubedb/cli/...
```

Please note that this will install KubeDB cli from master branch which might include breaking and/or undocumented changes.


## Configuring RBAC

KubeDB installer will create 3 user facing cluster roles:

| ClusterRole       | Aggregates To | Desription |
| ----------------- | --------------| ---------- |
| kubedb:core:admin | admin         | Allows edit access to all `KubeDB` CRDs, intended to be granted within a namespace using a RoleBinding. This grants ability to wipeout dormant database and delete their record. |
| kubedb:core:edit  | edit          | Allows edit access to all `KubeDB` CRDs except `DormantDatabase` CRD, intended to be granted within a namespace using a RoleBinding. |
| kubedb:core:view  | view          | Allows read-only access to `KubeDB` CRDs, intended to be granted within a namespace using a RoleBinding. |

These user facing roles supports [ClusterRole Aggregation](https://kubernetes.io/docs/admin/authorization/rbac/#aggregated-clusterroles) feature in Kubernetes 1.9 or later clusters.


## Upgrade KubeDB

To upgrade KubeDB cli, just replace the old cli with the new version. To upgrade KubeDB operator, please follow the instruction for the corresponding release.
