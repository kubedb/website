---
title: Kubedb-Operator Version
menu:
  docs_v2020.11.12:
    identifier: kubedb-operator-version
    name: Kubedb-Operator Version
    parent: reference-operator
menu_name: docs_v2020.11.12
section_menu_id: reference
info:
  cli: v0.15.1
  community: v0.15.1
  enterprise: v0.2.1
  installer: v0.15.1
  version: v2020.11.12
---

## kubedb-operator version

Prints binary version number.

```
kubedb-operator version [flags]
```

### Options

```
      --check string   Check version constraint
  -h, --help           help for version
      --short          Print just the version number.
```

### Options inherited from parent commands

```
      --alsologtostderr                  log to standard error as well as files
      --bypass-validating-webhook-xray   if true, bypasses validating webhook xray checks
      --enable-analytics                 Send analytical events to Google Analytics (default true)
      --log-flush-frequency duration     Maximum number of seconds between log flushes (default 5s)
      --log_backtrace_at traceLocation   when logging hits line file:N, emit a stack trace (default :0)
      --log_dir string                   If non-empty, write log files in this directory
      --logtostderr                      log to standard error instead of files (default true)
      --stderrthreshold severity         logs at or above this threshold go to stderr
      --use-kubeapiserver-fqdn-for-aks   if true, uses kube-apiserver FQDN for AKS cluster to workaround https://github.com/Azure/AKS/issues/522 (default true)
  -v, --v Level                          log level for V logs
      --vmodule moduleSpec               comma-separated list of pattern=N settings for file-filtered logging
```

### SEE ALSO

* [kubedb-operator](/docs/v2020.11.12/reference/operator/kubedb-operator)	 - KubeDB operator by AppsCode

