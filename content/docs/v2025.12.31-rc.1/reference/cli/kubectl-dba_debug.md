---
title: Kubectl-Dba Debug
menu:
  docs_v2025.12.31-rc.1:
    identifier: kubectl-dba-debug
    name: Kubectl-Dba Debug
    parent: reference-cli
menu_name: docs_v2025.12.31-rc.1
section_menu_id: reference
info:
  autoscaler: v0.45.0-rc.1
  cli: v0.60.0-rc.1
  dashboard: v0.36.0-rc.1
  installer: v2025.12.31-rc.1
  ops-manager: v0.47.0-rc.1
  provisioner: v0.60.0-rc.1
  schema-manager: v0.36.0-rc.1
  ui-server: v0.36.0-rc.1
  version: v2025.12.31-rc.1
  webhook-server: v0.36.0-rc.1
---

## kubectl-dba debug

Debug any Database issue

### Synopsis

Collect all the logs and yamls of a specific database in just one command

```
kubectl-dba debug
```

### Examples

```
  kubectl dba debug mongodb -n demo sample-mongodb --operator-namespace kubedb
  
  Valid resource types include:
  * elasticsearch
  * mongodb
  * mariadb
  * mysql
  * postgres
  * redis
  * gitops
```

### Options

```
  -h, --help   help for debug
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

* [kubectl-dba](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba)	 - kubectl plugin for KubeDB
* [kubectl-dba debug cassandra](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_cassandra)	 - Debug helper for Cassandra database
* [kubectl-dba debug clickhouse](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_clickhouse)	 - Debug helper for ClickHouse database
* [kubectl-dba debug druid](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_druid)	 - Debug helper for Druid database
* [kubectl-dba debug elasticsearch](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_elasticsearch)	 - Debug helper for Elasticsearch database
* [kubectl-dba debug ferretdb](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_ferretdb)	 - Debug helper for FerretDB database
* [kubectl-dba debug hazelcast](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_hazelcast)	 - Debug helper for Hazelcast database
* [kubectl-dba debug ignite](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_ignite)	 - Debug helper for Ignite database
* [kubectl-dba debug kafka](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_kafka)	 - Debug helper for Kafka database
* [kubectl-dba debug mariadb](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_mariadb)	 - Debug helper for MariaDB database
* [kubectl-dba debug memcached](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_memcached)	 - Debug helper for Memcached database
* [kubectl-dba debug mongodb](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_mongodb)	 - Debug helper for MongoDB database
* [kubectl-dba debug mssqlserver](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_mssqlserver)	 - Debug helper for MSSQLServer database
* [kubectl-dba debug mysql](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_mysql)	 - Debug helper for MySQL database
* [kubectl-dba debug oracle](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_oracle)	 - Debug helper for Oracle database
* [kubectl-dba debug perconaxtradb](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_perconaxtradb)	 - Debug helper for PerconaXtraDB database
* [kubectl-dba debug pgbouncer](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_pgbouncer)	 - Debug helper for PgBouncer database
* [kubectl-dba debug pgpool](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_pgpool)	 - Debug helper for Pgpool database
* [kubectl-dba debug postgres](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_postgres)	 - Debug helper for Postgres database
* [kubectl-dba debug proxysql](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_proxysql)	 - Debug helper for ProxySQL database
* [kubectl-dba debug rabbitmq](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_rabbitmq)	 - Debug helper for Rabbitmq database
* [kubectl-dba debug redis](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_redis)	 - Debug helper for Redis database
* [kubectl-dba debug singlestore](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_singlestore)	 - Debug helper for Singlestore database
* [kubectl-dba debug solr](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_solr)	 - Debug helper for Solr database
* [kubectl-dba debug zookeeper](/docs/v2025.12.31-rc.1/reference/cli/kubectl-dba_debug_zookeeper)	 - Debug helper for Zookeeper database

