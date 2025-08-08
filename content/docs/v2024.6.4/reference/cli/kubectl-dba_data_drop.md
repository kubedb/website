---
title: Kubectl-Dba Data Drop
menu:
  docs_v2024.6.4:
    identifier: kubectl-dba-data-drop
    name: Kubectl-Dba Data Drop
    parent: reference-cli
menu_name: docs_v2024.6.4
section_menu_id: reference
info:
  autoscaler: v0.31.0
  cli: v0.46.0
  dashboard: v0.22.0
  installer: v2024.6.4
  ops-manager: v0.33.0
  provisioner: v0.46.0
  schema-manager: v0.22.0
  ui-server: v0.22.0
  version: v2024.6.4
  webhook-server: v0.22.0
---

## kubectl-dba data drop

Drop data from a database

### Synopsis

Drop data in a database.

```
kubectl-dba data drop
```

### Examples

```
  # Drop all the cli inserted data from mariadb
  kubectl dba data drop mariadb -n demo sample-maria
  
  # Drop all the cli inserted data from elasticsearch
  kubectl dba data drop es -n demo
  
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
  -h, --help   help for drop
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

* [kubectl-dba data](/docs/v2024.6.4/reference/cli/kubectl-dba_data)	 - Insert, Drop or Verify data in a database
* [kubectl-dba data drop elasticsearch](/docs/v2024.6.4/reference/cli/kubectl-dba_data_drop_elasticsearch)	 - Delete data from elasticsearch database
* [kubectl-dba data drop mariadb](/docs/v2024.6.4/reference/cli/kubectl-dba_data_drop_mariadb)	 - Drop data from MariaDB
* [kubectl-dba data drop mongodb](/docs/v2024.6.4/reference/cli/kubectl-dba_data_drop_mongodb)	 - Drop data from mongodb
* [kubectl-dba data drop mysql](/docs/v2024.6.4/reference/cli/kubectl-dba_data_drop_mysql)	 -  Drop data from mysql
* [kubectl-dba data drop postgres](/docs/v2024.6.4/reference/cli/kubectl-dba_data_drop_postgres)	 - Delete data from postgres database
* [kubectl-dba data drop redis](/docs/v2024.6.4/reference/cli/kubectl-dba_data_drop_redis)	 - Delete data from redis database

