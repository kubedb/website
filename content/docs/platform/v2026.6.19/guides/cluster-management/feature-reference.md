---
layout: docs
menu:
  docsplatform_v2026.6.19:
    identifier: cluster-management-feature-reference
    name: Feature Set Reference
    parent: cluster-management
    weight: 31
menu_name: docsplatform_v2026.6.19
section_menu_id: guides
---

# Feature Set Reference

This page lists every feature available in each Feature Set, why you would enable it, and the features it depends on. Use it to decide what to turn on and to understand what gets pulled in automatically.

> **Prerequisites auto-enable.** When you enable a feature, every feature in its **Prerequisites** column is enabled for you if not already present. The chain is transitive — a prerequisite's own prerequisites are pulled in too.

---

## Opscenter Core *(Required)*

Core platform capabilities. Must be installed before any other Feature Set.

| Feature | Why enable | Prerequisites |
|---|---|---|
| **Kube UI Server** *(Required)* | The core Server that renders the UI of this particular cluster | — |
| **License Proxyserver** *(Recommended)* | Fetches and serves AppsCode product licenses. Required by KubeDB, KubeStash, Panopticon, KubeVault, Scanner. | — |
| **FluxCD** *(Recommended)* | GitOps engine for declaratively syncing manifests from Git. All features are actually deployed in the cluster via flux HelmRelease. | — |
| **OpenShift Adapter** | Adapts the platform to OpenShift. Enable only on OpenShift clusters. | — |
| **Opscenter Features** *(Required)* | Internal configurator that renders feature definitions. Platform-managed. | — |

Note: If you are an ArgoCD user, AppsCode provides a way to convert the flux HelmRelease to an Argo Application via a custom operator called FargoCD. This is configurable in the [selfhost](../../../selfhost-setup/install/_index.md) page.

![Configure Opscenter Core feature set showing Opscenter Features, Kube UI Server, License Proxyserver, FluxCD, and OpenShift Adapter](../images/feature-reference-images/featureset-opscenter-core.png)

---

## Backup & Recovery

Scheduled backup and recovery for Kubernetes applications and databases.

| Feature | Why enable | Prerequisites |
|---|---|---|
| **Stash 2.0** *(Recommended)* | Backup and restore of apps and databases via KubeStash. The current backup engine. | License Proxyserver |
| **Stash Presets** *(Recommended)* | Ready-made backup storage and retention policy configurations. | — |
| **Stash** | Legacy backup operator (Stash 1.0). Enable only to keep existing Stash 1.0 setups working. | License Proxyserver |
| **Stash Opscenter** | UI and Grafana monitoring for Stash. | Stash, Panopticon, Grafana Operator |

![Configure Backup & Recovery feature set showing Stash Opscenter, Stash 2.0, Stash, and Stash Presets](../images/feature-reference-images/featureset-backup-recovery.png)

---

## Databases

Production-grade database management powered by KubeDB.

| Feature | Why enable | Prerequisites |
|---|---|---|
| **KubeDB** *(Recommended)* | Operator to provision and manage production databases (MongoDB, Postgres, MySQL, Redis, Kafka, etc.). | License Proxyserver |
| **KubeDB Opscenter** *(Recommended)* | UI and monitoring dashboards for KubeDB. | KubeDB, Panopticon, Grafana Operator |
| **KubeDB UI Presets** *(Recommended)* | Default presets for the database creation forms. | — |
| **Prepare Cluster** | Pre-pulls images and prepares nodes for KubeDB. | — |

![Configure Databases feature set showing KubeDB Opscenter, Prepare Cluster, KubeDB UI Presets, and KubeDB with supported database types](../images/feature-reference-images/featureset-databases.png)

---

## Observability

Cluster monitoring, metrics, and dashboards.

| Feature | Why enable | Prerequisites |
|---|---|---|
| **Monitoring Operator** *(Recommended)* | Foundation operator that wires up cluster monitoring. Prerequisite for most observability features. | — |
| **Kube Prometheus Stack** *(Recommended)* | Prometheus, Grafana, and alerting bundle for Kubernetes-native monitoring. | Monitoring Operator |
| **Grafana Operator** *(Recommended)* | Manage Grafana dashboards as Kubernetes resources. | Monitoring Operator |
| **Panopticon** *(Recommended)* | Generates metrics from any Kubernetes resource (generic kube-state-metrics). | License Proxyserver |
| **Kubernetes Metrics Server** | Container CPU/memory metrics for `kubectl top` and built-in autoscaling. | — |
| **Prometheus Metrics Adapter** *(Recommended)* | Exposes Prometheus metrics to the Kubernetes custom-metrics API. | Kube Prometheus Stack |
| **Kubernetes Grafana Dashboards** *(Recommended)* | Prebuilt Kubernetes Grafana dashboards. | Grafana Operator |
| **AppsCode OTEL Stack** *(Recommended)* | OpenTelemetry collectors and pipelines for traces, metrics, and logs. | Monitoring Operator |
| **Thanos Operator** *(Recommended)* | Long-term, highly available Prometheus storage and global querying. | — |
| **Prometheus Label Proxy** *(Recommended)* | Enforces label-based tenant isolation on Prometheus queries. | Thanos Operator, Gateway API, Service Catalog |
| **Tenant Operator** *(Recommended)* | Isolates monitoring resources and access per tenant. | Prometheus Label Proxy, Thanos Operator |
| **Inbox Agent / Server / UI** *(ALPHA)* | Cluster event inbox components. | — |

![Configure Observability feature set showing Panopticon, Prometheus Metrics Adapter, Monitoring Operator, Kube Prometheus Stack, Grafana Operator, and Inbox components](../images/feature-reference-images/featureset-observability.png)

---

## Cost Management

Measure and allocate infrastructure and container costs.

| Feature | Why enable | Prerequisites |
|---|---|---|
| **Keda** *(Recommended)* | Event-driven autoscaling of workloads. | — |
| **Keda HTTP Addon** *(Recommended)* | Scale workloads based on HTTP traffic. | Keda |
| **Opencost** *(ALPHA)* | Measure and allocate infrastructure and container costs. | Kube Prometheus Stack, Monitoring Operator |
| **OpenCost Grafana Dashboards** | Cost visualization dashboards. | Opencost, Grafana Operator |

![Configure Cost Management feature set showing Keda HTTP Addon, OpenCost Grafana Dashboards, Opencost, and Keda](../images/feature-reference-images/featureset-cost-management.png)

---

## Security

TLS certificates, runtime security, and image scanning.

| Feature | Why enable | Prerequisites |
|---|---|---|
| **Scanner** *(Recommended)* | Scans image vulnerabilities and generates security reports. | License Proxyserver, Grafana Operator |
| **Cert Manager** | X.509 certificate issuance and renewal. | Gateway API |
| **CA Cert CSI Driver** | CSI driver that adds CA certificates to the OS trusted certificate issuers | Cert Manager |
| **Falco** | Container-native runtime threat detection. | — |
| **Falco UI Server** | UI for Falco runtime alerts. | Falco, Grafana Operator |

![Configure Security feature set showing Falco UI Server, Falco, CA Cert CSI Driver, Cert Manager, and Scanner](../images/feature-reference-images/featureset-security.png)

---

## Secret Management

Secure secret storage, syncing, and distribution.

| Feature | Why enable | Prerequisites |
|---|---|---|
| **External Secrets** | Sync secrets from external managers (AWS/GCP/Azure/Vault) into Kubernetes Secrets. | — |
| **Kubevault** | Operator to run and manage HashiCorp Vault. | License Proxyserver |
| **Kubevault Opscenter** | UI and monitoring for KubeVault. | Kubevault, Grafana Operator |
| **Config Syncer** | Sync ConfigMaps and Secrets across namespaces and clusters. | License Proxyserver |
| **Reloader** | Roll workloads automatically on ConfigMap/Secret changes. | — |
| **Sealed Secrets** | One-way encrypted Secrets safe to store in Git. | — |
| **Vault Secrets Operator** | Consume Vault secrets natively as Kubernetes Secrets. | — |
| **Secrets Store CSI Driver** | Mount secrets from external stores as CSI volumes. | — |
| **Azure Key Vault provider** | Azure Key Vault backend for the CSI driver. | Secrets Store CSI Driver |
| **AWS provider** | AWS Secrets Manager / SSM Parameter Store backend for the CSI driver. | Secrets Store CSI Driver |
| **Google Secret Manager provider** | Google Secret Manager backend for the CSI driver. | Secrets Store CSI Driver |
| **HashiCorp Vault provider** | HashiCorp Vault backend for the CSI driver. | Secrets Store CSI Driver |
| **Virtual Secrets** *(ALPHA)* | Virtual Secrets server for not to actually keep the secrets in k8s level. | — |
| **Virtual Secrets provider** *(ALPHA)* | Virtual Secrets backend for the CSI driver. | Virtual Secrets, Secrets Store CSI Driver |

![Configure Secret Management feature set showing External Secrets, Kubevault, Config Syncer, Reloader, Sealed Secrets, CSI driver providers, and Virtual Secrets](../images/feature-reference-images/featureset-secret-management.png)

---

## Policy Management

Platform-level policy enforcement.

| Feature | Why enable | Prerequisites |
|---|---|---|
| **Gatekeeper** | OPA-based policy controller. | — |
| **Gatekeeper Templates** | OPA Gatekeeper policy template library. | Gatekeeper |
| **Gatekeeper Constraints** | OPA Gatekeeper policy constraint library. | Gatekeeper, Gatekeeper Templates |
| **GateKeeper Policy Grafana Dashboards** | Policy compliance dashboards. | Gatekeeper, Grafana Operator |
| **Kyverno** | Kubernetes-native policy management. | — |
| **Kyverno Policies** | Pod Security Standards implemented as Kyverno policies. | Kyverno |

![Configure Policy Management feature set showing Kyverno Policies, Gatekeeper, Kyverno, GateKeeper Policy Grafana Dashboards, Gatekeeper Templates, and Gatekeeper Constraints](../images/feature-reference-images/featureset-policy-management.png)

---

## Storage Addons

Additional storage drivers and integrations.

| Feature | Why enable | Prerequisites |
|---|---|---|
| **NFS CSI driver** | Access NFS servers as Kubernetes volumes. | — |
| **Longhorn** | Cloud-native distributed block storage. | — |
| **CSI Volume Snapshotter** | Snapshot controller and validation webhook for CSI volumes. | — |
| **TopoLVM** | Local LVM-backed CSI storage. | — |

![Configure Storage Addons feature set showing Longhorn, NFS CSI driver, CSI Volume Snapshotter, and TopoLVM](../images/feature-reference-images/featureset-storage-addons.png)

---

## Networking Addons

Networking plugins and extensions.

| Feature | Why enable | Prerequisites |
|---|---|---|
| **Kubernetes Gateway API** *(Recommended)* | Installs the Gateway API CRDs and controller. | — |
| **External DNS Operator** | Manage external DNS records for Services and Ingresses. | — |
| **Voyager Ingress** | HAProxy-based ingress controller. | — |
| **Voyager Gateway** | Envoy-based gateway distro by AppsCode. | — |

![Configure Networking Addons feature set showing Voyager Gateway, Kubernetes Gateway API, External DNS Operator, and Voyager Ingress](../images/feature-reference-images/featureset-networking-addons.png)

---

## Opscenter Tools

DevOps tooling and management utilities.

| Feature | Why enable | Prerequisites |
|---|---|---|
| **Supervisor** *(Recommended)* | Day-2 operations — upgrade recommendations and maintenance windows. | — |
| **Sidekick** *(Recommended)* | Run a one-off container as a pod (sidecar-as-a-pod). | — |
| **Operator Shard Manager** *(Recommended)* | Scale operators by sharding responsibility across instances. | — |

![Configure Opscenter Tools feature set showing Operator Shard Manager, Sidekick, and Supervisor](../images/feature-reference-images/featureset-opscenter-tools.png)

---

## Cluster Management

Cluster provisioning and management tools (Cluster API core).

| Feature | Why enable | Prerequisites |
|---|---|---|
| **CAPI Catalog** | Catalog of Cluster API cluster templates. | — |
| **CAPI Ops Manager** | Day-2 operations for Cluster API clusters. | — |
| **Cluster Presets** | Preset configurations for cluster provisioning. Work with cloud NodePools | — |

![Configure Cluster Management feature set showing CAPI Catalog, CAPI Ops Manager, and Cluster Presets](../images/feature-reference-images/featureset-cluster-management.png)

---

## Cluster API AWS (CAPA)

Lifecycle management for clusters running on AWS.

| Feature | Why enable | Prerequisites |
|---|---|---|
| **AWS Credential Manager** *(Recommended)* | Manage AWS credentials used by CAPA. | — |
| **AWS EBS CSI Driver** *(Recommended)* | EBS-backed storage for provisioned clusters. | — |
| **AWS Load Balancer Controller** *(Recommended)* | Provision AWS load balancers for EKS clusters. | — |
| **AWS VPC Peering Operator** *(Recommended)* | Manage AWS VPC peering connections. | — |
| **Cluster Autoscaler** *(Recommended)* | Node autoscaling for Cluster API clusters. | — |

![Configure Cluster API AWS (CAPA) feature set showing AWS VPC Peering Operator, AWS Credential Manager, Cluster Autoscaler, AWS Load Balancer Controller, and AWS EBS CSI Driver](../images/feature-reference-images/featureset-capi-aws.png)

---

## Cluster API GCP (CAPG)

Lifecycle management for clusters running on GCP.

| Feature | Why enable | Prerequisites |
|---|---|---|
| **GCP Credential Manager** *(Recommended)* | Manage GCP credentials used by CAPG. | — |

![Configure Cluster API GCP (CAPG) feature set showing GCP Credential Manager](../images/feature-reference-images/featureset-capi-gcp.png)

---

## Cluster API Azure (CAPZ)

Lifecycle management for clusters running on Azure.

| Feature | Why enable | Prerequisites |
|---|---|---|
| **Azure Credential Manager** *(Recommended)* | Manage Azure credentials used by CAPZ. | — |

![Configure Cluster API Azure (CAPZ) feature set showing Azure Credential Manager](../images/feature-reference-images/featureset-capi-azure.png)

---

## Crossplane

Control-plane framework for infrastructure as code.

| Feature | Why enable | Prerequisites |
|---|---|---|
| **Crossplane** *(Recommended)* | The cloud-native control plane for provisioning infrastructure via Kubernetes APIs. | — |
| **KubeDB AWS Provider** | Provision KubeDB databases on AWS through Crossplane. | Crossplane |
| **KubeDB Azure Provider** | Provision KubeDB databases on Azure through Crossplane. | Crossplane |
| **KubeDB GCP Provider** | Provision KubeDB databases on GCP through Crossplane. | Crossplane |

![Configure Crossplane feature set showing KubeDB GCP Provider, KubeDB Azure Provider, KubeDB AWS Provider, and Crossplane](../images/feature-reference-images/featureset-crossplane.png)

---

## Multicluster Hub

Central hub for managing a fleet of clusters.

| Feature | Why enable | Prerequisites |
|---|---|---|
| **Multicluster Hub** *(Recommended)* | Core hub components. Foundation for all other hub features. | — |
| **Managed ServiceAccount Manager** *(Recommended)* | Manage service accounts on spoke clusters. | Multicluster Hub |
| **Cluster Auth Manager** *(Recommended)* | Authentication and authorization across the fleet. | Multicluster Hub, Managed ServiceAccount Manager |
| **Cluster Profile Manager** *(Recommended)* | Manage cluster profiles across the fleet. | Multicluster Hub, Cluster Auth Manager |
| **Cluster Proxy Manager** *(Recommended)* | Proxy traffic to spoke clusters. | Multicluster Hub, Cluster Profile Manager |
| **Cluster Gateway Manager** *(Recommended)* | API gateway for reaching spoke clusters. | Multicluster Hub, Cluster Profile Manager, Managed ServiceAccount Manager, Cluster Proxy Manager |
| **FluxCD Manager** *(Recommended)* | GitOps delivery across the fleet. | Multicluster Hub, Cluster Profile Manager |
| **License Proxyserver Manager** *(Recommended)* | Distribute AppsCode licenses to spoke clusters. | Multicluster Hub, Cluster Profile Manager |
| **Hub Cluster Robot** *(Recommended)* | Automation account for hub-driven operations. | Multicluster Hub, Cluster Auth Manager |

![Configure Multicluster Hub feature set showing Cluster Gateway Manager, Cluster Profile Manager, Managed ServiceAccount Manager, Cluster Auth Manager, Hub Cluster Robot, FluxCD Manager, License Proxyserver Manager, Cluster Proxy Manager, and Multicluster Hub](../images/feature-reference-images/featureset-multicluster-hub.png)

---

## Multicluster Spoke

Connect this cluster as a spoke to an existing hub.

| Feature | Why enable | Prerequisites |
|---|---|---|
| **Multicluster Spoke** *(Recommended)* | Register this cluster as a spoke of a Multicluster Hub. | — |

![Configure Multicluster Spoke feature set showing Multicluster Spoke component with Hub Information and Spoke Information fields](../images/feature-reference-images/featureset-multicluster-spoke.png)

---

## Kubernetes Native Service

Components for Kubernetes-native service patterns.

| Feature | Why enable | Prerequisites |
|---|---|---|
| **Service Catalog** *(Recommended)* | Exposes the Databases with gateway. Controls all the gw component provisioning for all modes including client orgs | Cert Manager, KubeDB |
| **Service Gateway Presets** *(Recommended)* | A preset that holds the root 'ace' gateway configurations | Cert Manager, External DNS Operator |
| **Service Connector Backend** | Backend for the service connector. | — |
| **Service Provider** | Service provider component. | — |

![Configure Kubernetes Native Service feature set showing Service Catalog, Service Connector Backend, Service Gateway Presets, and Service Provider](../images/feature-reference-images/featureset-kubernetes-native-service.png)
