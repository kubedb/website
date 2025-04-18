---
type: "datasheet"
id: "kafka"
data: "data/products/kubedb/databases/kafka.json"
url: "/zh/datasheet/kafka"

title: "在 Kubernetes 上管理 Apache Kafka 的一站式解决方案"
description: "KubeDB 是一个原生 Kubernetes 的数据库管理解决方案，可简化并自动化常见的数据库任务，例如：部署、监控、升级、打补丁、扩展、卷扩容、备份、恢复、故障检测和修复。支持多种主流数据库，适用于所有公有云和私有云环境。"
hero_features:
  - "轻松管理多个数据库。"
  - "使用 KubeDB 提高开发者生产力，控制成本。"
  - "在任意云、本地环境、开发者电脑或 CI/CD 中运行 DBaaS。"
  - "通过我们贴心的工程支持，摆脱运维烦恼。"
  - "应用与数据库一体部署，实现左移开发策略。"
  - "为每个微服务释放数据库的强大潜能。"

contact_sales: "联系我们"
try_now: "立即试用"

social_prof_title: "我们的部分客户"
features_section:
  title: "功能"
  description: ""
  features:
    - "数据库部署与简化管理"
    - "高可用性与弹性"
    - "私有镜像仓库与隔离环境支持"
    - "备份与恢复能力"
    - "内置 Prometheus 监控与告警"
    - "水平和垂直扩展"
    - "存储卷扩容"
    - "自助式 Web 管理门户"
    - "TLS 管理与证书轮换"
    - "GitOps（ArgoCD / FluxCD）集成"
    - "主版本、次版本与补丁升级"
    - "自定义数据库插件支持"
    - "通过 Envoy Gateway 实现跨集群访问"

kubernetes_platform:
  title: "KubeDB 可轻松集成到任何 Kubernetes 平台，例如："
  description: "选择您喜欢的平台，体验部署、扩展和管理的便利。欢迎加入我们，共同拥抱未来的应用部署方式。"
  platform_name:
    - "AWS 弹性 Kubernetes 服务（EKS）"
    - "Azure Kubernetes 服务（AKS）"
    - "Google Kubernetes 引擎（GKE）"
    - "Red Hat OpenShift"
    - "Rancher"
    - "VMware Tanzu"
    - "Equinix Metal"
    - "OpenStack"
    - "本地 Kubernetes 集群"
    - "IBM Cloud"
    - "Oracle Cloud"
    - "阿里云"
    - "DigitalOcean"
    - "Linode"
    - "Exoscale 云托管"

pricing_model:
  title: "计费模式"
  description: "KubeDB 的计费基于 <strong class=\"has-text-primary\">由 KubeDB 管理的数据库容器的内存上限</strong>（不是 Kubernetes 工作节点的内存）。例如，一个有 3 个副本、每个副本分配 8GB 内存的 PostgreSQL 实例，将按 24GB 内存计费。"

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
        silver: "适用于生产数据库的自助式云方案"
        gold: "适用于生产数据库"
        platinum: "适用于关键业务数据库"

      - title: "支持覆盖范围"
        silver: "自助服务"
        gold: "8x5 ⏰"
        platinum: "24x7 ⏰"

      - title: "SLA 响应时间"
        silver: "尽力而为"
        gold: "支持"
        platinum: "支持"

      - title: "季度更新"
        silver: "支持"
        gold: "支持"
        platinum: "支持"

      - title: "紧急补丁"
        silver: "不支持"
        gold: "支持"
        platinum: "支持"

      - title: "故障工单（SLA 覆盖）"
        silver: "不适用"
        gold: "每月 5 个"
        platinum: "每月 10 个"

      - title: "工单联系人"
        silver: "1 个"
        gold: "5 个"
        platinum: "10 个"

      - title: "远程协助（屏幕共享，需额外付费）"
        silver: "支持"
        gold: "支持（含每月 3 小时免费）"
        platinum: "支持（含每月 5 小时免费）"

      - title: "生产运行手册"
        silver: "不支持"
        gold: "支持"
        platinum: "支持"

      - title: "专属私聊（通过 Discord）"
        silver: "不支持"
        gold: "支持"
        platinum: "支持"

      - title: "电话支持"
        silver: "不支持"
        gold: "支持"
        platinum: "支持 ☎"

      - title: "定制功能"
        silver: "不支持"
        gold: "额外费用"
        platinum: "额外费用"

faq_area:
  title: "常见问题"
  description: "以下是我们最常被问到的问题。如果没有您想找的内容，请随时联系我们。"
  accordions:
    - title: "KubeDB 是开源的吗？"
      description: "KubeDB 采用开放核心模式。其 API 和客户端在 Apache v2 协议下可用于集成至客户项目中。"

    - title: "KubeDB 是否经过大规模部署验证？"
      description: "KubeDB 自 2017 年起推出，已经在众多客户项目中部署，包括大型部署环境。"

    - title: "KubeDB 与 StatefulSets 有何不同？"
      description: "KubeDB 在 Day 2 运维方面具有明显优势，涵盖监控、警报、备份/恢复、版本升级及扩展等功能。"

    - title: "为什么选择 KubeDB 而不是数据库厂商的 Operator？"
      description: "KubeDB 可将所有数据库需求整合至一个合同中，极大减少工程投入，相比厂商 Operator 更高效便捷。"

    - title: "KubeDB 相较于云服务商的托管数据库服务有何优势？"
      description: "KubeDB 提供多种数据库选项，支持多云和本地部署，并具有更高的性价比。"

footer:
  about_appscode: 
    - "AppsCode 是 Kubernetes 云原生数据平台领域的领导者。由前 Google 工程师 Tamal Saha 于 2016 年创办。"
    - "AppsCode 开发了多款广受欢迎的 Kubernetes 工具产品，包括 KubeDB、Stash、KubeVault、Kubeform 和 Voyager。公司总部位于美国内华达州拉斯维加斯，工程办公室设在孟加拉国达卡。"
  contact_us:
    title: "联系我们"
  copy_right: "AppsCode Inc. 版权所有。"
---
