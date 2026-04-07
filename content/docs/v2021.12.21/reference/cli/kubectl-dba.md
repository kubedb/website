---
title: Kubectl-Dba
menu:
  docs_v2021.12.21:
    identifier: kubectl-dba
    name: Kubectl-Dba
    parent: reference-cli
    weight: 0
menu_name: docs_v2021.12.21
section_menu_id: reference
url: /docs/v2021.12.21/reference/cli/
aliases:
- /docs/v2021.12.21/reference/cli/kubectl-dba/
info:
  autoscaler: v0.9.2
  cli: v0.24.0
  community: v0.24.2
  enterprise: v0.11.2
  installer: v2021.12.21
  version: v2021.12.21
---

## kubectl-dba

kubectl plugin for KubeDB

### Synopsis

kubectl plugin for KubeDB by AppsCode - Kubernetes ready production-grade Databases

 Find more information at https://kubedb.com

```
kubectl-dba [flags]
```

### Options

```
      --as string                      Username to impersonate for the operation
      --as-group stringArray           Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --cache-dir string               Default cache directory (default "/home/runner/.kube/cache")
      --certificate-authority string   Path to a cert file for the certificate authority
      --client-certificate string      Path to a client certificate file for TLS
      --client-key string              Path to a client key file for TLS
      --cluster string                 The name of the kubeconfig cluster to use
      --context string                 The name of the kubeconfig context to use
      --enable-analytics               Send analytical events to Google Analytics (default true)
  -h, --help                           help for kubectl-dba
      --insecure-skip-tls-verify       If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kubeconfig string              Path to the kubeconfig file to use for CLI requests.
      --match-server-version           Require server version to match client version
  -n, --namespace string               If present, the namespace scope for this CLI request
      --password string                Password for basic authentication to the API server
      --request-timeout string         The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests. (default "0")
  -s, --server string                  The address and port of the Kubernetes API server
      --tls-server-name string         Server name to use for server certificate validation. If it is not provided, the hostname used to contact the server is used
      --token string                   Bearer token for authentication to the API server
      --user string                    The name of the kubeconfig user to use
      --username string                Username for basic authentication to the API server
```

### SEE ALSO

* [kubectl-dba completion](/docs/v2021.12.21/reference/cli/kubectl-dba_completion)	 - Generate completion script
* [kubectl-dba connect](/docs/v2021.12.21/reference/cli/kubectl-dba_connect)	 - Connect to a database.
* [kubectl-dba describe](/docs/v2021.12.21/reference/cli/kubectl-dba_describe)	 - Show details of a specific resource or group of resources
* [kubectl-dba exec](/docs/v2021.12.21/reference/cli/kubectl-dba_exec)	 - Execute script or command to a database.
* [kubectl-dba options](/docs/v2021.12.21/reference/cli/kubectl-dba_options)	 - Print the list of flags inherited by all commands
* [kubectl-dba pause](/docs/v2021.12.21/reference/cli/kubectl-dba_pause)	 - Pause the processing of an object.
* [kubectl-dba restart](/docs/v2021.12.21/reference/cli/kubectl-dba_restart)	 - Smartly restart the pods of the database.
* [kubectl-dba resume](/docs/v2021.12.21/reference/cli/kubectl-dba_resume)	 - Resume processing of an object.
* [kubectl-dba show-credentials](/docs/v2021.12.21/reference/cli/kubectl-dba_show-credentials)	 - Prints credentials of the database.
* [kubectl-dba version](/docs/v2021.12.21/reference/cli/kubectl-dba_version)	 - Prints binary version number.

