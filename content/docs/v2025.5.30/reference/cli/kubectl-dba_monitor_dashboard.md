---
title: Kubectl-Dba Monitor Dashboard
menu:
  docs_v2025.5.30:
    identifier: kubectl-dba-monitor-dashboard
    name: Kubectl-Dba Monitor Dashboard
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

## kubectl-dba monitor dashboard

Check availability of a grafana dashboard

### Synopsis

Check availability of metrics in prometheus server used in a grafana dashboard.

```
kubectl-dba monitor dashboard
```

### Examples

```
  kubectl dba monitor dashboard [DATABASE] [DATABASE_NAME] -n [NAMESPACE] \
  [DASHBOARD_NAME] --file=[FILE_CONTAINING_DASHBOARD_JSON] --file=[FILE_CONTAINING_REMOTE_URL] \  <- these are ORed
  --prom-svc-name=[PROM_SVC_NAME] --prom-svc-namespace=[PROM_SVC_NS] --prom-svc-port=[PROM_SVC_PORT]
  
  # Check availability of a postgres grafana dashboard
  kubectl-dba monitor dashboard postgres pg15 -n demo \
  --file=/home/arnob/yamls/summary.json \
  --prom-svc-name=prometheus-kube-prometheus-prometheus --prom-svc-namespace=monitoring --prom-svc-port=9090
  
  Valid dashboards include:
  * connectcluster
  * druid
  * elasticsearch
  * kafka
  * mariadb
  * mongodb
  * mssql
  * mysql
  * perconaxtradb
  * pgpool
  * postgres
  * proxysql
  * rabbitmq
  * redis
  * singlestore
  * solr
  * zookeeper
  
  If --file is given, that is the local file. absolute or relative path both accepted.
  If --url is given, that is the remote file. You have to specify the full raw url.
  If just the dashboard name is given, then that will be searched in our dashboard repo. To be exact if mongodb-summary-dashboard specified only, The cli will look for the json in
  https://raw.githubusercontent.com/appscode/grafana-dashboards/master/mongodb/mongodb-summary-dashboard.json
```

### Options

```
  -b, --branch string   branch name of the github repo (default "master")
  -f, --file string     absolute or relative path of the file containing dashboard
  -h, --help            help for dashboard
  -d, --isdb            for non db object's. just provide the url (default true)
  -u, --url string      url of the raw file containing dashboard. For example: https://raw.githubusercontent.com/appscode/grafana-dashboards/master/mongodb/mongodb-summary-dashboard.json
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
      --prom-svc-name string                  name of the prometheus service
      --prom-svc-namespace string             namespace of the prometheus service
      --prom-svc-port int                     port of the prometheus service (default 9090)
      --request-timeout string                The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests. (default "0")
  -s, --server string                         The address and port of the Kubernetes API server
      --tls-server-name string                Server name to use for server certificate validation. If it is not provided, the hostname used to contact the server is used
      --token string                          Bearer token for authentication to the API server
      --user string                           The name of the kubeconfig user to use
      --username string                       Username for basic authentication to the API server
```

### SEE ALSO

* [kubectl-dba monitor](/docs/v2025.5.30/reference/cli/kubectl-dba_monitor)	 - Monitoring related commands for a database

