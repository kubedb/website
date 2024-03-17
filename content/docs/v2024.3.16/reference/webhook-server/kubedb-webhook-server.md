---
title: Kubedb-Webhook-Server
menu:
  docs_v2024.3.16:
    identifier: kubedb-webhook-server
    name: Kubedb-Webhook-Server
    parent: reference-webhook-server
    weight: 0
menu_name: docs_v2024.3.16
section_menu_id: reference
url: /docs/v2024.3.16/reference/webhook-server/
aliases:
- /docs/v2024.3.16/reference/webhook-server/kubedb-webhook-server/
info:
  autoscaler: v0.29.0
  cli: v0.44.0
  dashboard: v0.20.0
  installer: v2024.3.16
  ops-manager: v0.31.0
  provisioner: v0.44.0
  schema-manager: v0.20.0
  ui-server: v0.20.0
  version: v2024.3.16
  webhook-server: v0.20.0
---

## kubedb-webhook-server



### Options

```
      --bypass-validating-webhook-xray        if true, bypasses validating webhook xray checks
      --default-seccomp-profile-type string   Default seccomp profile
  -h, --help                                  help for kubedb-webhook-server
      --use-kubeapiserver-fqdn-for-aks        if true, uses kube-apiserver FQDN for AKS cluster to workaround https://github.com/Azure/AKS/issues/522 (default true)
```

### SEE ALSO

* [kubedb-webhook-server run](/docs/v2024.3.16/reference/webhook-server/kubedb-webhook-server_run)	 - Launch KubeDB Webhook Server
* [kubedb-webhook-server version](/docs/v2024.3.16/reference/webhook-server/kubedb-webhook-server_version)	 - Prints binary version number.

