---
title: Kubectl-Dba Connect Memcached
menu:
  docs_v2023.06.19:
    identifier: kubectl-dba-connect-memcached
    name: Kubectl-Dba Connect Memcached
    parent: reference-cli
menu_name: docs_v2023.06.19
section_menu_id: reference
info:
  autoscaler: v0.19.0
  cli: v0.34.0
  dashboard: v0.10.0
  installer: v2023.06.19
  ops-manager: v0.21.0
  provisioner: v0.34.0
  schema-manager: v0.10.0
  ui-server: v0.10.0
  version: v2023.06.19
  webhook-server: v0.10.0
---

## kubectl-dba connect memcached

Connect to a telnet shell to run command against a memcached database

### Synopsis

Use this cmd to exec into a memcached object's primary pod.

```
kubectl-dba connect memcached [flags]
```

### Options

```
  -h, --help   help for memcached
```

### Options inherited from parent commands

```
      --as string                      Username to impersonate for the operation. User could be a regular user or a service account in a namespace.
      --as-group stringArray           Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --as-uid string                  UID to impersonate for the operation.
      --cache-dir string               Default cache directory (default "/home/runner/.kube/cache")
      --certificate-authority string   Path to a cert file for the certificate authority
      --client-certificate string      Path to a client certificate file for TLS
      --client-key string              Path to a client key file for TLS
      --cluster string                 The name of the kubeconfig cluster to use
      --context string                 The name of the kubeconfig context to use
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

* [kubectl-dba connect](/docs/v2023.06.19/reference/cli/kubectl-dba_connect)	 - Connect to a database.
