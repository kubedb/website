---
title: Kubectl-Dba Pause
menu:
  docs_v2025.5.30:
    identifier: kubectl-dba-pause
    name: Kubectl-Dba Pause
    parent: reference-cli
menu_name: docs_v2025.5.30
section_menu_id: reference
info:
  autoscaler: v0.40.0
  cli: v0.55.0
  dashboard: v0.31.0
  installer: v2025.5.30
  ops-manager: v0.42.0
  provisioner: v0.55.0
  schema-manager: v0.31.0
  ui-server: v0.31.0
  version: v2025.5.30
  webhook-server: v0.31.0
---

## kubectl-dba pause

Pause the processing of an object.

### Synopsis

Pause the community-operator's watch for the objects. The community-operator will stop to process the object.

Use "kubectl api-resources" for a complete list of supported resources.

```
kubectl-dba pause (-f FILENAME | TYPE [NAME_PREFIX | -l label] | TYPE/NAME)
```

### Examples

```
  # Pause an elasticsearch
  dba pause elasticsearch elasticsearch-demo
  
  # Pause a postgres
  dba pause pg/postgres-demo
  
  # Pause all postgres
  dba pause postgreses
  
  Valid resource types include:
  * elasticsearch
  * mongodb
  * mariadb
  * mysql
  * postgres
  * redis
```

### Options

```
      --all-namespaces      If present, list the requested object(s) across all namespaces. Namespace in current context is ignored even if specified with --namespace.
  -f, --filename strings    Filename, directory, or URL to files containing the resource to pause
  -h, --help                help for pause
  -k, --kustomize string    Process the kustomization directory. This flag can't be used together with -f or -R.
      --only-archiver       If provided, only the archiver for the database is paused.
      --only-backupconfig   If provided, only the backupconfiguration for the database is paused.
      --only-db             If provided, only the database is paused.
  -R, --recursive           Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.
  -l, --selector string     Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2)
```

### Options inherited from parent commands

```
      --as string                             Username to impersonate for the operation. User could be a regular user or a service account in a namespace.
      --as-group stringArray                  Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --as-uid string                         UID to impersonate for the operation.
      --cache-dir string                      Default cache directory (default "/home/runner/.kube/cache")
      --certificate-authority string          Path to a cert file for the certificate authority
      --client-certificate string             Path to a client certificate file for TLS
      --client-key string                     Path to a client key file for TLS
      --cluster string                        The name of the kubeconfig cluster to use
      --context string                        The name of the kubeconfig context to use
      --default-seccomp-profile-type string   Default seccomp profile
      --disable-compression                   If true, opt-out of response compression for all requests to the server
      --insecure-skip-tls-verify              If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kubeconfig string                     Path to the kubeconfig file to use for CLI requests.
      --match-server-version                  Require server version to match client version
  -n, --namespace string                      If present, the namespace scope for this CLI request
      --password string                       Password for basic authentication to the API server
      --request-timeout string                The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests. (default "0")
  -s, --server string                         The address and port of the Kubernetes API server
      --tls-server-name string                Server name to use for server certificate validation. If it is not provided, the hostname used to contact the server is used
      --token string                          Bearer token for authentication to the API server
      --user string                           The name of the kubeconfig user to use
      --username string                       Username for basic authentication to the API server
```

### SEE ALSO

* [kubectl-dba](/docs/v2025.5.30/reference/cli/kubectl-dba)	 - kubectl plugin for KubeDB

