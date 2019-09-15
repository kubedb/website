---
title: Kubedb
menu:
  docs_0.9.0-rc.0:
    identifier: kubedb
    name: Kubedb
    parent: reference
    weight: 0
menu_name: docs_0.9.0-rc.0
section_menu_id: reference
aliases:
- /docs/0.9.0-rc.0/reference/
info:
  version: 0.9.0-rc.0
---

## kubedb

Command line interface for KubeDB

### Synopsis

KubeDB by AppsCode - Kubernetes ready production-grade Databases 

Find more information at https://github.com/kubedb/cli.

```
kubedb [flags]
```

### Options

```
      --alsologtostderr                  log to standard error as well as files
      --analytics                        Send analytical events to Google Analytics (default true)
      --as string                        Username to impersonate for the operation
      --as-group stringArray             Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --cache-dir string                 Default HTTP cache directory (default "/home/tamal/.kube/http-cache")
      --certificate-authority string     Path to a cert file for the certificate authority
      --client-certificate string        Path to a client certificate file for TLS
      --client-key string                Path to a client key file for TLS
      --cluster string                   The name of the kubeconfig cluster to use
      --context string                   The name of the kubeconfig context to use
  -h, --help                             help for kubedb
      --insecure-skip-tls-verify         If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kubeconfig string                Path to the kubeconfig file to use for CLI requests.
      --log-backtrace-at traceLocation   when logging hits line file:N, emit a stack trace (default :0)
      --log-dir string                   If non-empty, write log files in this directory
      --logtostderr                      log to standard error instead of files
      --match-server-version             Require server version to match client version
  -n, --namespace string                 If present, the namespace scope for this CLI request
      --request-timeout string           The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests. (default "0")
  -s, --server string                    The address and port of the Kubernetes API server
      --stderrthreshold severity         logs at or above this threshold go to stderr (default 2)
      --token string                     Bearer token for authentication to the API server
      --user string                      The name of the kubeconfig user to use
  -v, --v Level                          log level for V logs
      --vmodule moduleSpec               comma-separated list of pattern=N settings for file-filtered logging
```

### SEE ALSO

* [kubedb api-resources](/docs/0.9.0-rc.0/reference/kubedb_api-resources)	 - Print the supported API resources on the server
* [kubedb create](/docs/0.9.0-rc.0/reference/kubedb_create)	 - Create a resource from a file or from stdin.
* [kubedb delete](/docs/0.9.0-rc.0/reference/kubedb_delete)	 - Delete resources by filenames, stdin, resources and names, or by resources and label selector
* [kubedb describe](/docs/0.9.0-rc.0/reference/kubedb_describe)	 - Show details of a specific resource or group of resources
* [kubedb edit](/docs/0.9.0-rc.0/reference/kubedb_edit)	 - Edit a resource on the server
* [kubedb get](/docs/0.9.0-rc.0/reference/kubedb_get)	 - Display one or many resources
* [kubedb version](/docs/0.9.0-rc.0/reference/kubedb_version)	 - Prints binary version number.


