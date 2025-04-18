---
title: Uninstall KubeDB Community Edition
description: Uninstallation guide for KubeDB Community edition
menu:
  docs_v2022.08.04-rc.1:
    identifier: uninstall-kubedb-community
    name: Community Edition
    parent: uninstallation-guide
    weight: 10
product_name: kubedb
menu_name: docs_v2022.08.04-rc.1
section_menu_id: setup
info:
  autoscaler: v0.13.0-rc.1
  cli: v0.28.0-rc.1
  dashboard: v0.4.0-rc.1
  installer: v2022.08.04-rc.1
  ops-manager: v0.15.0-rc.1
  provisioner: v0.28.0-rc.1
  schema-manager: v0.4.0-rc.1
  ui-server: v0.4.0-rc.1
  version: v2022.08.04-rc.1
  webhook-server: v0.4.0-rc.1
---

# Uninstall KubeDB Community Edition

To uninstall KubeDB Community edition, run the following command:

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

</div>
<div class="tab-pane fade" id="script" role="tabpanel" aria-labelledby="script-tab">

## Using YAML (with helm 3)

If you prefer to not use Helm, you can generate YAMLs from the KubeDB chart and uninstall using `kubectl`.

```bash
$ helm template kubedb appscode/kubedb --namespace kubedb | kubectl delete -f -
```

</div>
</div>
