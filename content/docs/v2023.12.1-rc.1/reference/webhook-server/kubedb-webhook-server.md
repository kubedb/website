---
title: Kubedb-Webhook-Server
menu:
  docs_v2023.12.1-rc.1:
    identifier: kubedb-webhook-server
    name: Kubedb-Webhook-Server
    parent: reference-webhook-server
    weight: 0
menu_name: docs_v2023.12.1-rc.1
section_menu_id: reference
url: /docs/v2023.12.1-rc.1/reference/webhook-server/
aliases:
- /docs/v2023.12.1-rc.1/reference/webhook-server/kubedb-webhook-server/
info:
  autoscaler: v0.23.0-rc.1
  cli: v0.38.0-rc.1
  dashboard: v0.14.0-rc.1
  installer: v2023.12.1-rc.1
  ops-manager: v0.25.0-rc.1
  provisioner: v0.38.0-rc.1
  schema-manager: v0.14.0-rc.1
  ui-server: v0.14.0-rc.1
  version: v2023.12.1-rc.1
  webhook-server: v0.14.0-rc.1
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

* [kubedb-webhook-server run](/docs/v2023.12.1-rc.1/reference/webhook-server/kubedb-webhook-server_run)	 - Launch KubeDB Webhook Server
* [kubedb-webhook-server version](/docs/v2023.12.1-rc.1/reference/webhook-server/kubedb-webhook-server_version)	 - Prints binary version number.

