---
title: Pgpool CRD
menu:
  docs_v2024.6.4:
    identifier: pp-pgpool-concepts
    name: Pgpool
    parent: pp-concepts-pgpool
    weight: 10
menu_name: docs_v2024.6.4
section_menu_id: guides
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

> New to KubeDB? Please start [here](/docs/v2024.6.4/README).

# Pgpool

## What is Pgpool

`Pgpool` is a Kubernetes `Custom Resource Definitions` (CRD). It provides declarative configuration for [Pgpool](https://pgpool.net/) in a Kubernetes native way. You only need to describe the desired configuration in a `Pgpool`object, and the KubeDB operator will create Kubernetes objects in the desired state for you.

## Pgpool Spec

As with all other Kubernetes objects, a Pgpool needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `.spec` section. Below is an example Pgpool object.

```yaml
apiVersion: kubedb.com/v1alpha2
kind: Pgpool
metadata:
  name: pgpool
  namespace: pool
spec:
  version: "4.5.0"
  replicas: 1
  postgresRef:
    name: ha-postgres
    namespace: demo
  sslMode: verify-ca
  clientAuthMode: cert
  tls:
    issuerRef:
      apiGroup: cert-manager.io
      name: pgpool-ca-issuer
      kind: Issuer
    certificates:
      - alias: server
        subject:
          organizations:
            - kubedb:server
        dnsNames:
          - localhost
        ipAddresses:
          - "127.0.0.1"
  monitor:
    agent: prometheus.io/operator
    prometheus:
      serviceMonitor:
        labels:
          release: prometheus
        interval: 10s
  deletionPolicy: WipeOut
  syncUsers: true
  initConfig:
    pgpoolConfig:
      log_statement : on
      log_per_node_statement : on
      sr_check_period : 0
      health_check_period : 0
      backend_clustering_mode : 'streaming_replication'
      num_init_children : 5
      max_pool : 75
      child_life_time : 300
      child_max_connections : 0
      connection_life_time : 0
      client_idle_limit : 0
      connection_cache : on
      load_balance_mode : on
      ssl : on
      failover_on_backend_error : off
      log_min_messages : warning
      statement_level_load_balance: on
      memory_cache_enabled: on
  podTemplate:
    spec:
      containers:
        - name: pgpool
          resources:
            limits:
              memory: 2Gi
            requests:
              cpu: 200m
              memory: 256Mi

  serviceTemplates:
    - alias: primary
      spec:
        type: LoadBalancer
        ports:
          - name: http
            port: 9999
```