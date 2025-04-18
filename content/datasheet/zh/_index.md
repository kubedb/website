---
url: '/zh/datasheet/'
title: "Kubernetes 上的数据库一站式管理解决方案"
description: "KubeDB 是一款原生 Kubernetes 数据库管理解决方案，简化并自动化了数据库的日常操作，如：创建、监控、升级、修补、扩展、卷扩展、备份、恢复、故障检测和修复，支持多种流行数据库，适用于任何私有和公有云环境。"
hero_features:
  - "轻松管理多个数据库。"
  - "提高开发人员的生产力，降低成本。"
  - "在任何云、本地开发机器或 CI/CD 中运行您的 DBaaS。"
  - "通过我们的工程支持服务，告别烦恼。"
  - "一键部署应用和数据库，实现左移策略。"
  - "为每个微服务释放数据库的强大功能"

contact_sales: "联系我们"
try_now: "立即体验"

social_prof_title: "我们的精选客户"
features_section:
  title: "功能"
  description: ""
  features:
    - "数据库创建与简化管理"
    - "高可用性与弹性"
    - "私有镜像仓库与隔离集群支持"
    - "备份与恢复功能"
    - "内置 Prometheus 监控与警报"
    - "水平与垂直扩展"
    - "存储卷扩展"
    - "自助式 Web 门户"
    - "TLS 管理与证书轮换"
    - "GitOps（ArgoCD / FluxCD）集成"
    - "主版本、次版本与补丁版本升级"
    - "自定义数据库插件支持"
    - "通过 Envoy Gateway 实现跨集群访问"

kubernetes_platform:
  title: "KubeDB 可轻松集成到任何 Kubernetes 平台，例如："
  description: "选择您偏好的平台，享受部署、扩展和管理的便捷。加入我们，共同拥抱应用部署的未来。"
  platform_name:
    - "AWS 弹性 Kubernetes 服务 (EKS)"
    - "Azure Kubernetes 服务 (AKS)"
    - "Google Kubernetes 引擎 (GKE)"
    - "Red Hat OpenShift"
    - "Rancher"
    - "VMware Tanzu"
    - "Equinix Metal"
    - "Openstack"
    - "本地 Kubernetes 集群"
    - "IBM Cloud"
    - "Oracle Cloud"
    - "阿里云"
    - "Digital Ocean"
    - "Linode"
    - "Exoscale 云托管"

pricing_model:
  title: "定价模型"
  description: "KubeDB 按 <strong class=\"has-text-primary\">由 KubeDB 管理的数据库容器设置的内存上限</strong> 进行计费（不是 Kubernetes 工作节点的内存）。例如，一个具有 3 个副本且每个副本配置 8 GB RAM 的 PostgreSQL 数据库将在计费时算作 24GB 内存。"

support_plans:
  title: "支持计划"
  features_table:
    thead:
      - ""
      - "银牌"
      - "金牌"
      - "铂金"
    tbody:
      - title: "推荐对象"
        silver: "适用于生产数据库的自助式云计划"
        gold: "适用于生产数据库"
        platinum: "适用于业务或关键任务数据库"

      - title: "支持覆盖"
        silver: "自助服务"
        gold: "8x5 ⏰"
        platinum: "24x7 ⏰"

      - title: "响应时间 SLA"
        silver: "尽力而为"
        gold: "是"
        platinum: "是"

      - title: "季度更新"
        silver: "是"
        gold: "是"
        platinum: "是"

      - title: "紧急补丁"
        silver: "否"
        gold: "是"
        platinum: "是"

      - title: "事故工单（含 SLA）"
        silver: "不适用"
        gold: "每月 5 个"
        platinum: "每月 10 个"

      - title: "工单联系人"
        silver: "1"
        gold: "5"
        platinum: "10"

      - title: "远程协助（屏幕共享，额外付费）"
        silver: "是"
        gold: "是（每月免费 3 小时）"
        platinum: "是（每月免费 5 小时）"

      - title: "生产运行手册"
        silver: "否"
        gold: "是"
        platinum: "是"

      - title: "专属私聊（通过 Discord）"
        silver: "否"
        gold: "是"
        platinum: "是"

      - title: "电话支持"
        silver: "否"
        gold: "是"
        platinum: "是 ☎"

      - title: "自定义功能"
        silver: "否"
        gold: "额外收费"
        platinum: "额外收费"

faq_area:
  title: "常见问题解答"
  description: "以下是我们最常收到的一些问题。如果您没有找到想了解的内容，欢迎随时联系我们。"
  accordions:
    - title: "KubeDB 是开源的吗？"
      description: "KubeDB 采用开放核心模式。API 和客户端遵循 Apache v2 许可证，便于集成到客户端项目中。"

    - title: "KubeDB 是否已经被大规模部署验证？"
      description: "KubeDB 从 2017 年开始，已经在众多客户中成功部署，包括大规模生产环境。"

    - title: "KubeDB 与 StatefulSets 有何区别？"
      description: "KubeDB 提供全面的 Day 2 运维能力，包括监控、警报、备份/恢复、版本升级和扩展等。"

    - title: "为什么使用 KubeDB 而不是数据库供应商的 Operator？"
      description: "使用 KubeDB，您可以通过单一合同满足所有数据库需求，并最大限度减少工程投入。"

    - title: "KubeDB 相比云厂商的托管数据库服务有何优势？"
      description: "KubeDB 提供丰富的数据库选择，支持多云及本地环境，且更具成本效益。"

footer:
  about_appscode: 
    - "AppsCode 是 Kubernetes 云原生数据平台的领导者。由前 Google 工程师 Tamal Saha 于 2016 年创立。"
    - "AppsCode 开发了多款流行的 Kubernetes 产品，如 KubeDB、Stash、KubeVault、Kubeform 和 Voyager。总部位于美国内华达州拉斯维加斯，工程办公室位于孟加拉国达卡。"
  contact_us:
    title: "联系我们"
  copy_right: "AppsCode Inc. 版权所有。"
---
