---
title: Install KubeDB using YAML
description: Install KubeDB using YAML
menu:
  docs_v2026.4.27:
    identifier: install-kubedb-yaml
    name: YAML
    parent: install-kubedb-enterprise
    weight: 20
product_name: kubedb
menu_name: docs_v2026.4.27
section_menu_id: setup
info:
  autoscaler: v0.49.0
  cli: v0.64.0
  dashboard: v0.40.0
  installer: v2026.4.27
  ops-manager: v0.51.0
  product: kubedb
  provisioner: v0.64.0
  schema-manager: v0.40.0
  ui-server: v0.40.0
  version: v2026.4.27
  webhook-server: v0.40.0
---

# Using YAML

If you prefer to not use Helm, you can generate YAMLs from KubeDB chart and deploy using `kubectl`. Here we are going to show the procedure using Helm 3.

```bash
$ helm template kubedb oci://ghcr.io/appscode-charts/kubedb \
  --version {{< param "info.version" >}} \
  --namespace kubedb --create-namespace \
  --set-file global.license=/path/to/the/license.txt  \
  --set global.skipCleaner=true | kubectl apply -f -
```

{{< notice type="warning" message="If you are using **private Docker registries** using *self-signed certificates*, please pass the registry domains to the operator like below:" >}}

```bash
$ helm template kubedb oci://ghcr.io/appscode-charts/kubedb \
  --version {{< param "info.version" >}} \
  --namespace kubedb --create-namespace \
  --set-file global.license=/path/to/the/license.txt  \
  --set global.insecureRegistries[0]=hub.example.com \
  --set global.insecureRegistries[1]=hub2.example.com \
  --set global.skipCleaner=true | kubectl apply -f -
```

To see the detailed configuration options, visit [here](https://github.com/kubedb/installer/tree/{{< param "info.installer" >}}/charts/kubedb).

Next: [enable database engines and verify the installation](/docs/v2026.4.27/setup/install/kubedb/configuration).
