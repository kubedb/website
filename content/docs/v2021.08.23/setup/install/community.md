---
title: Install KubeDB Community Edition
description: Installation guide for KubeDB Community edition
menu:
  docs_v2021.08.23:
    identifier: install-kubedb-community
    name: Community Edition
    parent: installation-guide
    weight: 10
product_name: kubedb
menu_name: docs_v2021.08.23
section_menu_id: setup
info:
  autoscaler: v0.5.0
  cli: v0.20.0
  community: v0.20.0
  enterprise: v0.7.0
  installer: v2021.08.23
  version: v2021.08.23
---

# Install KubeDB Community Edition

KubeDB Community edition is available under [AppsCode-Community-1.0.0](https://github.com/appscode/licenses/raw/1.0.0/AppsCode-Community-1.0.0.md) license and free to use for both commercial and non-commercial purposes. It comes with the cluster provisioning functionalities. However, it lacks some advanced features such as database backup/recovery, upgrading version, horizontal and vertical scaling, TLS/SSL support via [cert-manager](https://cert-manager.io/), updating configuration post provisioning, connection pooling, etc. compared to the Enterprise edition. A full features comparison between the KubeDB Community edition and Enterprise edition can be found [here](/docs/v2021.08.23/overview/README).

To use the KubeDB Community edition, you can grab **1 year** free license from [here](https://license-issuer.appscode.com/?p=kubedb-community). After that, you can issue another license for one more year. Typically we release a new version of the operator at least quarterly. So, you can just grab a new license every time you upgrade the operator.

## Get a License

In this section, we are going to show you how you can get a **1 year** free license for the KubeDB Community edition. You can get a license for your Kubernetes cluster by going through the following steps:

- At first, go to [AppsCode License Server](https://license-issuer.appscode.com/?p=kubedb-community) and fill-up the form. It will ask for your Name, Email, the product you want to install, and your cluster ID (UID of the `kube-system` namespace).
- Provide your name and email address. You can provide your personal or work email address.
- Then, select `KubeDB Community Edition` in the product field.
- Now, provide your cluster-ID. You can get your cluster ID easily by running the following command:

  ```bash
  $ kubectl get ns kube-system -o=jsonpath='{.metadata.uid}'
  ```

- Then, you have to agree with the terms and conditions. We recommend reading it before checking the box.
- Now, you can submit the form. After you submit the form, the AppsCode License server will send an email to the provided email address with a link to your license file.
- Navigate to the provided link and save the license into a file. Here, we save the license to a `license.txt` file.

Here is a screenshot of the license form.

<figure align="center">
  <img alt="KubeDB Backend Overview" src="/docs/v2021.08.23/images/setup/community_license_form.png">
  <figcaption align="center">Fig: KubeDB License Form</figcaption>
</figure>

You can create licenses for as many clusters as you want. You can upgrade your license any time without re-installing KubeDB by following the upgrading guide from [here](/docs/v2021.08.23/setup/upgrade/#updating-license).

> KubeDB licensing process has been designed to work with CI/CD workflow. You can automatically obtain a license from your CI/CD pipeline by following the guide from [here](https://github.com/appscode/offline-license-server#offline-license-server).

## Install

KubeDB operator can be installed as a Helm chart or simply as Kubernetes manifests.

<ul class="nav nav-tabs" id="installerTab" role="tablist">
  <li class="nav-item">
    <a class="nav-link active" id="helm3-tab" data-toggle="tab" href="#helm3" role="tab" aria-controls="helm3" aria-selected="true">Helm 3 (Recommended)</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="script-tab" data-toggle="tab" href="#script" role="tab" aria-controls="script" aria-selected="false">YAML</a>
  </li>
</ul>
<div class="tab-content" id="installerTabContent">
  <div class="tab-pane fade show active" id="helm3" role="tabpanel" aria-labelledby="helm3-tab">

## Using Helm 3

KubeDB can be installed via [Helm](https://helm.sh/) using the [chart](https://github.com/kubedb/installer/tree/{{< param "info.installer" >}}/charts/kubedb) from [AppsCode Charts Repository](https://github.com/appscode/charts). To install, follow the steps below:

```bash
$ helm repo add appscode https://charts.appscode.com/stable/
$ helm repo update

$ helm search repo appscode/kubedb
NAME                        CHART VERSION APP VERSION DESCRIPTION
appscode/kubedb             {{< param "info.version" >}}   {{< param "info.version" >}} KubeDB by AppsCode - Production ready databases...
appscode/kubedb-autoscaler  {{< param "info.autoscaler" >}}        {{< param "info.autoscaler" >}}      KubeDB Autoscaler by AppsCode - Autoscale KubeD...
appscode/kubedb-catalog     {{< param "info.community" >}}       {{< param "info.community" >}}     KubeDB Catalog by AppsCode - Catalog for databa...
appscode/kubedb-community   {{< param "info.community" >}}       {{< param "info.community" >}}     KubeDB Community by AppsCode - Community featur...
appscode/kubedb-crds        {{< param "info.community" >}}       {{< param "info.community" >}}     KubeDB Custom Resource Definitions
appscode/kubedb-enterprise  {{< param "info.enterprise" >}}        {{< param "info.enterprise" >}}      KubeDB Enterprise by AppsCode - Enterprise feat...

# Install KubeDB Community operator chart
$ helm install kubedb appscode/kubedb \
  --version {{< param "info.version" >}} \
  --namespace kube-system \
  --set-file global.license=/path/to/the/license.txt
```

To see the detailed configuration options, visit [here](https://github.com/kubedb/installer/tree/{{< param "info.installer" >}}/charts/kubedb).

</div>
<div class="tab-pane fade" id="script" role="tabpanel" aria-labelledby="script-tab">

## Using YAML

If you prefer to not use Helm, you can generate YAMLs from KubeDB chart and deploy using `kubectl`. Here we are going to show the prodecure using Helm 3.

```bash
$ helm repo add appscode https://charts.appscode.com/stable/
$ helm repo update

$ helm search repo appscode/kubedb
NAME                        CHART VERSION APP VERSION DESCRIPTION
appscode/kubedb             {{< param "info.version" >}}   {{< param "info.version" >}} KubeDB by AppsCode - Production ready databases...
appscode/kubedb-autoscaler  {{< param "info.autoscaler" >}}        {{< param "info.autoscaler" >}}      KubeDB Autoscaler by AppsCode - Autoscale KubeD...
appscode/kubedb-catalog     {{< param "info.community" >}}       {{< param "info.community" >}}     KubeDB Catalog by AppsCode - Catalog for databa...
appscode/kubedb-community   {{< param "info.community" >}}       {{< param "info.community" >}}     KubeDB Community by AppsCode - Community featur...
appscode/kubedb-crds        {{< param "info.community" >}}       {{< param "info.community" >}}     KubeDB Custom Resource Definitions
appscode/kubedb-enterprise  {{< param "info.enterprise" >}}        {{< param "info.enterprise" >}}      KubeDB Enterprise by AppsCode - Enterprise feat...

#  Install KubeDB Community operator chart
$ helm template kubedb appscode/kubedb \
  --version {{< param "info.version" >}}       \
  --namespace kube-system                        \
  --set-file global.license=/path/to/the/license.txt    \
  --set global.skipCleaner=true | kubectl apply -f -
```

To see the detailed configuration options, visit [here](https://github.com/kubedb/installer/tree/{{< param "info.installer" >}}/charts/kubedb).

</div>
</div>

## Verify installation

To check if KubeDB operator pods have started, run the following command:

```bash
$ watch kubectl get pods --all-namespaces -l "app.kubernetes.io/instance=kubedb"
NAMESPACE     NAME                                        READY   STATUS    RESTARTS   AGE
kube-system   kubedb-kubedb-community-7f4dc7c49c-l6ddf    1/1     Running   0          48s
```

Once the operator pod is running, you can cancel the above command by typing `Ctrl+C`.

Now, to confirm CRD groups have been registered by the operator, run the following command:

```bash
$ kubectl get crd -l app.kubernetes.io/name=kubedb
```

Now, you are ready to [create your first database](/docs/v2021.08.23/guides/README) using KubeDB.
