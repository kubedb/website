---
title: Kubectl-Dba Exec Postgres
menu:
  docs_v2022.02.22:
    identifier: kubectl-dba-exec-postgres
    name: Kubectl-Dba Exec Postgres
    parent: reference-cli
menu_name: docs_v2022.02.22
section_menu_id: reference
info:
  autoscaler: v0.10.0
  cli: v0.25.0
  community: v0.25.0
  dashboard: v0.1.0
  enterprise: v0.12.0
  installer: v2022.02.22
  schema-manager: v0.1.0
  ui-server: v0.1.0
  version: v2022.02.22
  webhook-server: v0.1.0
---

## kubectl-dba exec postgres

Execute SQL commands to a postgres resource

### Synopsis

Use this cmd to execute postgresql commands to a postgres object's primary pod.

Examples:
  # Execute a script named 'demo.sql' in 'pg-demo' postgres database in 'demo' namespace
  kubectl dba exec pg pg-demo -n demo -f demo.sql

  # Execute a command in 'pg-demo' postgres database in 'demo' namespace
  kubectl dba exec pg pg-demo -c '\l' -d kubedb"
				

```
kubectl-dba exec postgres [flags]
```

### Options

```
  -c, --command string   command to execute
  -d, --dbName string    name of the database inside postgres to execute command
  -f, --file string      path to command file
  -h, --help             help for postgres
```

### Options inherited from parent commands

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

* [kubectl-dba exec](/docs/v2022.02.22/reference/cli/kubectl-dba_exec)	 - Execute script or command to a database.

