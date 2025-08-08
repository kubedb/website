---
title: Kubedb-Webhook-Server
menu:
  docs_v2024.3.9-rc.0:
    identifier: kubedb-webhook-server
    name: Kubedb-Webhook-Server
    parent: reference-webhook-server
    weight: 0
menu_name: docs_v2024.3.9-rc.0
section_menu_id: reference
url: /docs/v2024.3.9-rc.0/reference/webhook-server/
aliases:
- /docs/v2024.3.9-rc.0/reference/webhook-server/kubedb-webhook-server/
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

## kubedb-webhook-server



### Options

```
      --bypass-validating-webhook-xray        if true, bypasses validating webhook xray checks
      --default-seccomp-profile-type string   Default seccomp profile
  -h, --help                                  help for kubedb-webhook-server
      --use-kubeapiserver-fqdn-for-aks        if true, uses kube-apiserver FQDN for AKS cluster to workaround https://github.com/Azure/AKS/issues/522 (default true)
```

### SEE ALSO

* [kubedb-webhook-server run](/docs/v2024.3.9-rc.0/reference/webhook-server/kubedb-webhook-server_run)	 - Launch KubeDB Webhook Server
* [kubedb-webhook-server version](/docs/v2024.3.9-rc.0/reference/webhook-server/kubedb-webhook-server_version)	 - Prints binary version number.

