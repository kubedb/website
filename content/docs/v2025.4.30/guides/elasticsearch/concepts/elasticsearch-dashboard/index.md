---
title: ElasticsearchDashboard
menu:
  docs_v2025.4.30:
    identifier: es-dashboard-concepts
    name: ElasticsearchDashboard
    parent: es-concepts-elasticsearch
    weight: 21
menu_name: docs_v2025.4.30
section_menu_id: guides
info:
  autoscaler: v0.39.0
  cli: v0.54.0
  dashboard: v0.30.0
  installer: v2025.4.30
  ops-manager: v0.41.0
  provisioner: v0.54.0
  schema-manager: v0.30.0
  ui-server: v0.30.0
  version: v2025.4.30
  webhook-server: v0.30.0
---

> New to KubeDB? Please start [here](/docs/v2025.4.30/README).

# ElasticsearchDashboard

## What is ElasticsearchDashboard

`ElasticsearchDashboard` is a Kubernetes `Custom Resource Definitions` (CRD). It provides a declarative configuration to specify the docker images to be used for Elasticsearch Dashboard (`Kibana`, `Opensearch_Dashboards`) deployed with KubeDB in Kubernetes native way. When you install KubeDB, an `ElasticsearchVersion` custom resource will be created automatically for every supported `ElasticsearchDashboard` version.
Suppose you have a KubeDB-managed [Elasticsearch](/docs/v2025.4.30/guides/elasticsearch/concepts/elasticsearch/) provisioned in your cluster. You have to specify the name of `Elasticsearch` CRD in `spec.databaseRef.name` field of `ElasticsearchDashboard` CRD. Then, KubeDB will use the docker images specified in the `ElasticsearchVersion` CRD to create your expected dashboard.


## ElasticsearchDashboard Specification

As with all other Kubernetes objects, an `ElasticsearchDashboard` needs `apiVersion`, `kind`, and `metadata` fields. It also needs a `spec` section.

```yaml
apiVersion: elasticsearch.kubedb.com/v1alpha1
kind: ElasticsearchDashboard
metadata:
  name: es-cluster-dashboard
  namespace: demo
spec:
  replicas: 1
  enableSSL: true
  authSecret:
    name: es-cluster-user-cred
  configSecret:
    name: custom-configuration
  databaseRef:
    name: es-cluster
  podTemplate:
    spec:
      containers:
      - name: elasticsearch
        resources:
          limits:
            memory: 1.5Gi
          requests:
            cpu: 500m
            memory: 1.5Gi
  serviceTemplates:
    - alias: primary
      spec:
        ports:
          - port: 5601
  tls:
    certificates:
      - alias: database-client
        secretName: es-cluster-client-cert
  deletionPolicy: WipeOut
```



### spec.replicas

`spec.replicas` is an optional field that can be used if `spec.topology` is not specified. This field specifies the number of nodes (ie. pods) in the Elasticsearch cluster. The default value of this field is 1.

### spec.enableSSL

`spec.enableSSL` is an `optional` field that specifies whether to enable TLS to HTTP layer. The default value of this field is `false`. Enabling TLS from `ElasticsearchDashboard` CRD ensures secure connectivity with dashboard. In order to enable TLS in HTTP layer, the `spec.enableSSL` field in `elasticsearch` CRD has to be set to `true`.

### spec.authSecret

`spec.authSecret` is an `optional` field that points to a k8s secret used to hold the Elasticsearch `elastic`/`admin` user credentials. In order to access elastic search dashboard these credentials will be required.

The k8s secret must be of type: kubernetes.io/basic-auth with the following keys:

- `username`: Must be `elastic` for `x-pack`, and `admin` for `OpenSearch`.
- `password`: Password for the `elastic`/`admin` user.
  If `spec.authSecret` is not set, dashboard operator will use the authSecret from referred database object.

### spec.configSecret

`spec.configSecret` is an optional field that allows users to provide custom configuration for `ElasticsearchDashboard`. It contains a k8s secret name that holds the configuration files for `ElasticsearchDashboard`. If not provided, operator generated configurations will be applied to dashboard. If `configSecret` is provided, it will be merged with the operator-generated configuration. The user-provided configuration has higher precedence over the operator-generated configuration. The configuration file names are used as secret keys.

- Kibana:
  - `kibana.yml` for configuring Kibana

- Opensearch_dashboards:
  - `opensearch_dashboards.yml` for configuring OpenSearch_Dashboards

### spec.databaseRef

`spec.databaseRef` specifies the database name to which `ElasticsearchDashboard` is pointing. Referenced Elasticsearch instance must be deployed in the same namespace with dashboard. The dashboard will not become ready until database is ready and accepting connection requests.

### spec.podTemplate

KubeDB allows providing a template for database pod through `spec.podTemplate`. KubeDB operator will pass the information provided in `spec.podTemplate` to the PetSet created for the Elasticsearch database.

KubeDB accepts the following fields to set in `spec.podTemplate`:

- metadata
  - annotations (pod’s annotation)

- controller
  - annotations (deployment's annotation)

- spec:
  - env
  - resources
  - initContainers
  - imagePullSecrets
  - nodeSelector
  - serviceAccountName
  - schedulerName
  - tolerations
  - priorityClassName
  - priority
  - securityContext


### spec.serviceTemplates

`spec.serviceTemplates` is an optional field that contains a list of the `serviceTemplate`. The templates are identified by the alias. For Dashboard, the only configurable service alias is `primary`.

### spec.tls

`spec.tls` specifies the TLS/SSL configurations. User can provide custom TLS certificates using k8s secrets with allowed certificate aliases.`ElasticsearchDashboard` supports certificate with alias `database-client` to securely communicate with elasticsearch, alias `ca` to provide ca certificates and alias `server` for securely communicating with dashboard server. If `spec.tls` is not set the operator generated self-signed certificates will be used for secure connectivity with database and dashboard server.


## Next Steps

- Learn about Elasticsearch CRD [here](/docs/v2025.4.30/guides/elasticsearch/concepts/elasticsearch/).
- Deploy your first Elasticsearch database with KubeDB by following the guide [here](/docs/v2025.4.30/guides/elasticsearch/quickstart/overview/elasticsearch/).
- Deploy your first OpenSearch database with KubeDB by following the guide [here](/docs/v2025.4.30/guides/elasticsearch/quickstart/overview/opensearch/).
