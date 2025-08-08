---
title: Kubedb-Webhook-Server Version
menu:
  docs_v2022.12.24-rc.1:
    identifier: kubedb-webhook-server-version
    name: Kubedb-Webhook-Server Version
    parent: reference-webhook-server
menu_name: docs_v2022.12.24-rc.1
section_menu_id: reference
info:
  autoscaler: v0.15.0-rc.1
  cli: v0.30.0-rc.1
  dashboard: v0.6.0-rc.1
  installer: v2022.12.24-rc.1
  ops-manager: v0.17.0-rc.1
  provisioner: v0.30.0-rc.1
  schema-manager: v0.6.0-rc.1
  ui-server: v0.6.0-rc.1
  version: v2022.12.24-rc.1
  webhook-server: v0.6.0-rc.1
---

## kubedb-webhook-server version

Prints binary version number.

```
kubedb-webhook-server version [flags]
```

### Options

```
      --check string   Check version constraint
  -h, --help           help for version
      --short          Print just the version number.
```

### Options inherited from parent commands

```
      --bypass-validating-webhook-xray   if true, bypasses validating webhook xray checks
      --use-kubeapiserver-fqdn-for-aks   if true, uses kube-apiserver FQDN for AKS cluster to workaround https://github.com/Azure/AKS/issues/522 (default true)
```

### SEE ALSO

* [kubedb-webhook-server](/docs/v2022.12.24-rc.1/reference/webhook-server/kubedb-webhook-server)	 - 

