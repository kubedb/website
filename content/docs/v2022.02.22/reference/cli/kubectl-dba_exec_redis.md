---
title: Kubectl-Dba Exec Redis
menu:
  docs_v2022.02.22:
    identifier: kubectl-dba-exec-redis
    name: Kubectl-Dba Exec Redis
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

## kubectl-dba exec redis

Execute SQL commands to a redis resource

### Synopsis

Use this cmd to execute redis commands to a redis object's primary pod.

Examples:
  # Execute a script named 'demo.lua' in 'rd-demo' redis database in 'demo' namespace
  kubectl dba exec rd rd-demo -n demo -f demo.lua

  # Execute a script named 'demo.lua' that has KEYS and ARGS set, in 'rd-demo' redis database in 'demo' namespace
  kubectl dba exec rd rd-demo -n demo -f demo.lua  -k "key1" -a "arg1"

  # Execute a command in 'rd-demo' redis database in 'demo' namespace
  kubectl dba exec rd rd-demo -c 'set x y'
				

```
kubectl-dba exec redis [flags]
```

### Options

```
  -a, --argv stringArray   args to pass to the lua script, used in script as ARGV[*] and the flag can be specified multiple times with different args. 
  -c, --command string     single command to execute
  -f, --file string        path to lua script file
  -h, --help               help for redis
  -k, --keys stringArray   keys to pass to the lua script, used in script as KEYS[*] and the flag can be specified multiple times with different keys. 
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
