---
title: Run KubeDB on Amazon EKS
description: Deploy and manage production-grade databases using KubeDB on Amazon Elastic Kubernetes Service
url: /partner/amazon-eks/
hero_badge: AWS Marketplace Partner
hero_description: Deploy and manage <strong>25+ production-grade databases</strong> as native Kubernetes resources on Amazon EKS. Leverage AWS infrastructure with broader choice, zero extra licensing, and true GitOps agility.
story_title: What This Means for AWS and EKS Users
primary_cta_text: Start Free Trial
primary_cta_url: /docs/latest/setup/
secondary_cta_text: View on AWS Marketplace
secondary_cta_url: https://aws.amazon.com/marketplace/
proof_points:
  - title: 25+ Database Engines
    text: PostgreSQL, MySQL, Redis, Kafka & more
  - title: Level 5 Operator
    text: Day-2 operations on Auto Pilot
  - title: 100% GitOps Native
    text: Declarative & developer-friendly
features_section:
  title: Production databases. Fully automated on EKS.
  subtitle: 25+ database engines with HA, scaling, backup, TLS, monitoring, and GitOps support
  items:
    - title: Run Databases Natively on EKS
      icon: heroicons:cloud
      description: KubeDB integrates deeply with EKS, supporting any Kubernetes StorageClass (including EBS, EFS, or third-party CSI drivers). Databases run inside your private pod network with full affinity and anti-affinity controls for Multi-AZ resiliency.
    - title: DBaaS Without Cloud Lock-In
      icon: heroicons:lock-closed
      description: Complete data ownership and sovereignty with portability across clouds or on-prem. Support for air-gapped and sovereign environments with your choice of storage optimized for performance, cost, or resilience.
    - title: Broad Database Support
      icon: heroicons:cube-transparent
      description: Manage 25+ database engines including PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch, Kafka, and more — all with consistent Kubernetes-native workflows.
    - title: Automated Lifecycle Management
      icon: heroicons:wrench-screwdriver
      description: Declarative CRDs handle provisioning, upgrades, scaling, and repair with zero-downtime where possible.
    - title: High Availability & Resiliency
      icon: heroicons:shield-check
      description: Multi-AZ clustering, automated failover, PodDisruptionBudgets, and continuous health checks.
    - title: Backup & Recovery
      icon: heroicons:circle-stack
      description: Integrated with KubeStash for policy-driven, incremental, encrypted backups to S3. Support for point-in-time recovery.
    - title: Monitoring & Observability
      icon: heroicons:chart-bar
      description: Native Prometheus + Grafana dashboards. Integrates with Amazon Managed Service for Prometheus.
    - title: Security & Governance
      icon: heroicons:lock-closed
      description: Automated TLS, Transparent Data Encryption, RBAC integration with EKS IAM, network policies, and Vault support.
    - title: Self-Service for Developers
      icon: heroicons:users
      description: Platform teams enforce policies while developers provision databases via Kubernetes-native workflows.
database_support:
  title: Comprehensive Database Support
  subtitle: 25+ database engines managed with Kubernetes-native workflows
  categories:
    - label: Relational
      items: PostgreSQL, MySQL, MariaDB, SQL Server, Percona XtraDB
    - label: NoSQL/Document
      items: MongoDB, DocumentDB, Cassandra
    - label: In-Memory/Cache
      items: Redis, Valkey, Memcached
    - label: Search
      items: Elasticsearch, OpenSearch, Solr
    - label: Analytics
      items: Druid, ClickHouse, SingleStore
    - label: Messaging
      items: Kafka, RabbitMQ
    - label: Others
      items: Hazelcast, ZooKeeper, PgBouncer, ProxySQL
integrations:
  title: Seamless AWS & Kubernetes Integration
  subtitle: KubeDB leverages the full power of AWS and Kubernetes to deliver a complete database platform
  image: /assets/images/partners/aws-kubernetes-integration.jpeg
  items:
    - icon: heroicons:server-stack
      title: Amazon EKS & Kubernetes
      description: Deploy databases natively on Amazon EKS, Red Hat OpenShift, Rancher, or any Kubernetes distribution. Full support for Kubernetes operators, Custom Resource Definitions (CRDs), and GitOps workflows.
    - icon: heroicons:circle-stack
      title: Amazon S3
      description: Automated backup and archival to S3 with lifecycle policies, versioning, cross-region replication, and support for GCS, Azure Blob, and other object stores.
    - icon: heroicons:eye
      title: Amazon CloudWatch & Prometheus
      description: Deep integration with CloudWatch and native Prometheus support. Pre-built Grafana dashboards, custom alerts, and automated incident response.
    - icon: heroicons:shield-check
      title: AWS IAM & Kubernetes RBAC
      description: Use AWS IAM for authentication and support for Kubernetes RBAC for fine-grained access control. Support for IAM roles, service accounts, and HashiCorp Vault for credential management.
    - icon: heroicons:lock-closed
      title: AWS VPC & Network Policies
      description: Deploy databases in your VPC with custom network configurations, security groups, and private subnets. Full support for Kubernetes NetworkPolicies.
cost_effective:
  badge: 60% Average Cost Savings
  title: Why KubeDB Is More Cost-Effective Than AWS RDS
  subtitle: Run databases on AWS at a fraction of the cost while improving performance and developer productivity
  items:
    - icon: heroicons:check-circle
      title: Better Bin Packing
      description: Run multiple databases on the same EC2 host, unlike RDS which requires dedicated instances
      highlight: Up to 60% cost reduction
    - icon: heroicons:check-circle
      title: Spot Instance Support
      description: Use AWS Spot Instances with Karpenter for database pods, reducing compute costs by up to 90%
      highlight: 70-90% compute savings
    - icon: heroicons:check-circle
      title: Lower Management Fees
      description: RDS charges premium management fees on top of EC2 costs. KubeDB fees are significantly lower
      highlight: 60-70% lower fees
    - icon: heroicons:check-circle
      title: Free for Short-Lived Workloads
      description: Use KubeDB free for any clusters running less than 30 days (dev, test, CI/CD environments)
      highlight: 100% free for dev/test
additional_integrations:
  title: Additional AWS & Enterprise Integrations
  items:
    - icon: heroicons:key
      title: AWS KMS
      description: Encryption key management & TDE
    - icon: heroicons:server
      title: EBS Volumes
      description: High-performance block storage
    - icon: heroicons:globe-alt
      title: Route 53
      description: DNS management
    - icon: heroicons:lock-closed
      title: AWS Secrets Manager
      description: Credential rotation
    - icon: heroicons:squares-plus
      title: CloudFormation
      description: Infrastructure as code
    - icon: heroicons:shield-check
      title: AWS Certificate Manager
      description: TLS/SSL certificates
    - icon: heroicons:arrows-up-down
      title: Auto Scaling
      description: Dynamic scaling policies
    - icon: heroicons:signal
      title: Datadog & New Relic
      description: Third-party monitoring
architecture:
  badge: Technical Architecture
  title: KubeDB runs natively on Amazon EKS
  description: The KubeDB Operator sits directly on top of your EKS clusters, leveraging AWS infrastructure, multi-AZ capabilities, and Kubernetes-native patterns for database automation.
  image: /assets/images/partners/amazon-eks-architecture.png
  layers:
    - label: KubeDB Platform
      details: Web Console • Envoy Gateway • Hub/Spoke Model • Policy Engine
      items:
        - name: Web Console
        - name: Envoy Gateway
        - name: Hub/Spoke Model
        - name: Policy Engine
    - label: KubeDB Operator
      details: Provisioner • OpsManager • AutoScaler • KubeDB • Migrator
      items:
        - name: Provisioner
        - name: OpsManager
        - name: AutoScaler
        - name: KubeDB
        - name: Migrator
    - label: Kubernetes Services
      details: ArgoCD • Open Cluster Management • Cert Manager • Prometheus • Grafana
      items:
        - name: ArgoCD
        - name: Open Cluster Manager
        - name: Cert Manager
        - name: Prometheus
        - name: Grafana
    - label: Kubernetes
      details: Kubernetes • AWS Infrastructure • Multi-AZ Support
      items:
        - name: OpenShift
        - name: Rancher
        - name: EKS
        - name: GKE
        - name: AKS
    - label: Infrastructure
      details: On-premises • Cloud • Edge
      items:
        - name: On-premises
          is_base: true
        - name: Cloud
          is_base: true
        - name: Edge
          is_base: true
  footer:
    - On-premises
    - Cloud
    - Edge
comparison:
  feature_label: Feature / Capability
  column_a: AWS RDS
  column_b: EKS + KubeDB
  rows:
    - feature: Provisioning Speed
      a: 5-10 minutes
      b: "&lt; 60 seconds"
    - feature: Multiple DBs per Host
      a: "No"
      b: "Yes"
    - feature: Spot Instance Support
      a: Limited
      b: Full support
    - feature: Management Fee
      a: High premium
      b: Low
    - feature: Developer Productivity
      a: Shared instances
      b: Preview environments, per-dev DBs
    - feature: Latency
      a: Cross-VPC (higher)
      b: Same cluster (low)
    - feature: Vendor Lock-in
      a: AWS only
      b: None - portable
    - feature: Tooling
      a: Separate tools
      b: Same as apps (Helm, Prometheus, etc.)
benefit_blocks:
  - variant: blue
    icon: heroicons:users
    title: Developer Productivity Benefits
    items:
      - Every developer gets their own database instance
      - Preview environments for every pull request
      - Different databases for different environments
      - Provision databases in under 60 seconds vs 5-10 minutes
      - Use same tools (Helm, Prometheus) for apps and databases
  - variant: purple
    icon: heroicons:server-stack
    title: Operational Advantages
    items:
      - No vendor lock-in—reuse DevOps workflows on-prem or any cloud
      - Lower latency with databases in same cluster as apps
      - No cross-VPC connections required
      - Consistent Terraform/Ansible scripts across environments
      - Support for additional databases like Elasticsearch, Kafka, etc.
savings_cta:
  title: Calculate Your Savings
  description: Organizations typically save 60-70% on database costs when switching from RDS to KubeDB, while improving provisioning speed and developer productivity
  stats:
    - value: 60%
      label: Lower Cost Budget
    - value: 10x
      label: Faster Provisioning
    - value: Zero
      label: Vendor Lock-In
  cta_text: Get a Cost Analysis
  cta_url: https://appscode.com/contact/
industries:
  title: Trusted Across Industries
  subtitle: Organizations rely on KubeDB for mission-critical databases across diverse industries and use cases
  items:
    - title: Financial Services & Healthcare
      description: Meet strict compliance requirements with data sovereignty, air-gapped deployments, and full control over data locality. SOC 2 and HIPAA compliant infrastructure.
      stats:
        - label: Data Sovereignty
          value: 100%
        - label: Compliance
          value: SOC 2, HIPAA
    - title: Multi-Tenant SaaS Applications
      description: Deliver isolated database instances for each tenant with automated provisioning, lifecycle management, and policy-driven governance at scale.
      stats:
        - label: Tenant Isolation
          value: Full
        - label: Self-Service
          value: Automated
    - title: Hybrid & Multi-Cloud Deployments
      description: Run databases consistently across AWS, on-premises, and other clouds. Avoid vendor lock-in with portable Kubernetes-native infrastructure.
      stats:
        - label: Portability
          value: Any Cloud
        - label: Lock-in
          value: Zero
    - title: Edge & IoT Workloads
      description: Deploy databases at the edge with automated backups to central storage. Support for disconnected operations and data synchronization.
      stats:
        - label: Edge Locations
          value: Unlimited
        - label: Sync
          value: Automated
testimonial:
  icon: heroicons:trophy
  quote: "InterSystems was delighted to engage with KubeDB in the delicate, yet fundamental task of supporting durable, non-ephemeral workloads with Kubernetes. ... I would recommend KubeDB consulting for any Kubernetes related work."
  author: Luca Ravazzolo
  role: Product Manager, InterSystems
getting_started:
  title: Getting Started on AWS EKS
  subtitle: Deploy KubeDB on your EKS cluster in minutes
  steps:
    - title: Deploy KubeDB
      description: Via Helm or Operator Lifecycle Manager on your EKS cluster
    - title: Create Database
      description: Define a database Custom Resource with desired spec
    - title: Configure Backups
      description: Set up backups to Amazon S3 and enable monitoring
    - title: Manage Operations
      description: Scale, upgrade, or failover using Kubernetes tools
  links:
    - icon: heroicons:globe-alt
      title: KubeDB Website
      description: Learn more about KubeDB
      url: https://kubedb.com
      external: true
    - icon: heroicons:document-text
      title: Documentation
      description: Complete guides and API reference
      url: /docs/latest/
      is_highlighted: true
    - icon: heroicons:cloud
      title: AWS Marketplace
      description: View our seller profile
      url: https://aws.amazon.com/marketplace/
      external: true
final_cta:
  badge:
    icon: heroicons:cloud
    text: AWS EKS Ready
  title:
    primary: Run Databases Natively
    highlight: on Amazon EKS
  subtitle: 60% cost savings, 10x faster provisioning, zero vendor lock-in
  bullets:
    - icon: heroicons:bolt
      text: Deploy 25+ databases in &lt;60s
    - icon: heroicons:currency-dollar
      text: 90% savings with Spot Instances
    - icon: heroicons:cloud
      text: Full AWS integration (S3, IAM, KMS)
  primary_cta:
    text: Start Free Trial
    url: /docs/latest/setup/
  secondary_cta:
    text: Watch Demo
    url: https://www.youtube.com/@AppsCodeInc
  stats:
    - icon: heroicons:currency-dollar
      color: green
      value: 60%
      label: Cost Savings
    - icon: heroicons:bolt
      color: pink
      value: "&lt;60s"
      label: Provisioning
    - icon: heroicons:circle-stack
      color: blue
      value: 25+
      label: DB Engines
    - icon: heroicons:arrow-trending-up
      color: orange
      value: 10K+
      label: Deployments
---

KubeDB by AppsCode delivers a production-grade, Kubernetes-native Database-as-a-Service platform that runs seamlessly on <b>Amazon Elastic Kubernetes Service (Amazon EKS)</b>. It enables platform teams and developers to provision, manage, scale, backup, and recover a wide range of databases using familiar Kubernetes APIs and declarative workflows—<b>without vendor lock-in</b> or reliance on hyperscaler-managed database services.

With KubeDB on Amazon EKS, you can:
- Deploy and manage multiple database types
- Leverage AWS infrastructure for high availability
- Integrate with AWS services for backup and disaster recovery
- Scale your databases with EKS auto-scaling features


{{  }}