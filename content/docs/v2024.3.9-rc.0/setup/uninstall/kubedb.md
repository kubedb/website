---
title: Uninstall KubeDB
description: Uninstallation guide for KubeDB
menu:
  docs_v2024.3.9-rc.0:
    identifier: uninstall-kubedb-enterprise
    name: KubeDB
    parent: uninstallation-guide
    weight: 20
product_name: kubedb
menu_name: docs_v2024.3.9-rc.0
section_menu_id: setup
info:
  autoscaler: v0.28.0-rc.0
  cli: v0.43.0-rc.0
  dashboard: v0.19.0-rc.0
  installer: v2024.3.9-rc.0
  ops-manager: v0.30.0-rc.0
  provisioner: v0.43.0-rc.0
  schema-manager: v0.19.0-rc.0
  ui-server: v0.19.0-rc.0
  version: v2024.3.9-rc.0
  webhook-server: v0.19.0-rc.0
---

# Uninstall KubeDB

To uninstall KubeDB, run the following command:

<ul class="nav nav-tabs" id="installerTab" role="tablist">
  <li class="nav-item">
    <a class="nav-link active" id="helm3-tab" data-toggle="tab" href="#helm3" role="tab" aria-controls="helm3" aria-selected="true">Helm 3</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="script-tab" data-toggle="tab" href="#script" role="tab" aria-controls="script" aria-selected="false">YAML</a>
  </li>
</ul>
<div class="tab-content" id="installerTabContent">
  <div class="tab-pane fade show active" id="helm3" role="tabpanel" aria-labelledby="helm3-tab">

## Using Helm 3

In Helm 3, release names are [scoped to a namespace](https://v3.helm.sh/docs/faq/#release-names-are-now-scoped-to-the-namespace). So, provide the namespace you used to install the operator when installing.

```bash
$ helm uninstall kubedb --namespace kubedb
```

Helm does not delete CRD objects. You can delete the ones KubeDB created with the following commands:

```bash
$ kubectl get crd -o name | grep kubedb.com | xargs kubectl delete
```

</div>
<div class="tab-pane fade" id="script" role="tabpanel" aria-labelledby="script-tab">

## Using YAML (with helm 3)

If you prefer to not use Helm, you can generate YAMLs from KubeDB chart and uninstall using `kubectl`.

```bash
$ helm template kubedb oci://ghcr.io/appscode-charts/kubedb \
  --namespace kubedb | kubectl delete -f -
```

</div>
</div>
