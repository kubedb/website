---
title: Uninstall KubeDB Enterprise Edition
description: Uninstallation guide for KubeDB Enterprise edition
menu:
  docs_v2023.10.9:
    identifier: legacy-uninstall-kubedb-enterprise
    name: Enterprise Edition
    parent: legacy-uninstallation-guide
    weight: 20
product_name: kubedb
menu_name: docs_v2023.10.9
section_menu_id: setup
info:
  autoscaler: v0.21.0
  cli: v0.36.0
  dashboard: v0.12.0
  installer: v2023.10.9
  ops-manager: v0.23.0
  provisioner: v0.36.0
  schema-manager: v0.12.0
  ui-server: v0.12.0
  version: v2023.10.9
  webhook-server: v0.12.0
---

# Uninstall KubeDB Enterprise Edition

To uninstall KubeDB Enterprise edition, run the following command:

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
$ helm uninstall kubedb-enterprise --namespace kubedb
$ helm uninstall kubedb-autoscaler --namespace kubedb
$ helm uninstall kubedb-community  --namespace kubedb
```

</div>
<div class="tab-pane fade" id="script" role="tabpanel" aria-labelledby="script-tab">

## Using YAML (with helm 3)

If you prefer to not use Helm, you can generate YAMLs from KubeDB chart and uninstall using `kubectl`.

```bash
$ helm template kubedb-enterprise appscode/kubedb-enterprise --namespace kubedb | kubectl delete -f -
$ helm template kubedb-autoscaler appscode/kubedb-autoscaler --namespace kubedb | kubectl delete -f -
$ helm template kubedb-community  appscode/kubedb-community  --namespace kubedb | kubectl delete -f -
```

</div>
</div>
