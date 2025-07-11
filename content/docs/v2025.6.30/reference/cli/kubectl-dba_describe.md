---
title: Kubectl-Dba Describe
menu:
  docs_v2025.6.30:
    identifier: kubectl-dba-describe
    name: Kubectl-Dba Describe
    parent: reference-cli
menu_name: docs_v2025.6.30
section_menu_id: reference
info:
  autoscaler: v0.41.0
  cli: v0.56.0
  dashboard: v0.32.0
  installer: v2025.6.30
  ops-manager: v0.43.0
  provisioner: v0.56.0
  schema-manager: v0.32.0
  ui-server: v0.32.0
  version: v2025.6.30
  webhook-server: v0.32.0
---

## kubectl-dba describe

Show details of a specific resource or group of resources

### Synopsis

Show details of a specific resource or group of resources. This command joins many API calls together to form a detailed description of a given resource or group of resources.

Use "kubectl api-resources" for a complete list of supported resources.

```
kubectl-dba describe (-f FILENAME | TYPE [NAME_PREFIX | -l label] | TYPE/NAME)
```

### Examples

```
  # Describe a elasticsearch
  kubedb describe elasticsearches elasticsearch-demo
  
  # Describe a postgres
  kubedb describe pg/postgres-demo
  
  # Describe all postgreses
  kubedb describe pg
  
  Valid resource types include:
  * all
  * etcds
  * elasticsearches
  * postgreses
  * mysqls
  * mongodbs
  * redises
  * memcacheds
```

### Options

```
      --all-namespaces     If present, list the requested object(s) across all namespaces. Namespace in current context is ignored even if specified with --namespace.
  -f, --filename strings   Filename, directory, or URL to files containing the resource to describe
  -h, --help               help for describe
  -k, --kustomize string   Process the kustomization directory. This flag can't be used together with -f or -R.
  -R, --recursive          Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory.
  -l, --selector string    Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2)
      --show-events        If true, display events related to the described object. (default true)
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

* [kubectl-dba](/docs/v2025.6.30/reference/cli/kubectl-dba)	 - kubectl plugin for KubeDB

