---
type: "datasheet"
id: "mongodb"
data: "data/products/kubedb/databases/mongodb.json"
url: "/zh/datasheet/mongodb"

title: "在 Kubernetes 上管理 MongoDB 的一站式解决方案"
description: "KubeDB 是一个原生 Kubernetes 的数据库管理解决方案，简化并自动化日常数据库任务，如部署、监控、升级、打补丁、扩缩容、卷扩展、备份、恢复、故障检测和修复。支持多种主流数据库，适用于任何私有云和公有云环境。"

hero_features:
  - "轻松管理多个数据库。"
  - "使用 KubeDB 提高开发者效率，节省成本。"
  - "在任意云、本地、开发机或 CI/CD 中运行 DBaaS。"
  - "借助我们经验丰富的工程支持，告别运维烦恼。"
  - "实现应用与数据库的同步部署，加速开发左移。"
  - "为每个微服务解锁数据库的强大能力。"

contact_sales: "联系我们"
try_now: "立即试用"

social_prof_title: "我们的部分客户"

features_section:
  title: "功能亮点"
  description: ""
  features:
    - "数据库部署与简化管理"
    - "高可用性与强健性"
    - "私有镜像仓库与隔离环境支持"
    - "备份与恢复能力"
    - "内置 Prometheus 监控与告警"
    - "水平与垂直扩展"
    - "存储卷扩容"
    - "自助式 Web 管理门户"
    - "TLS 管理与证书自动轮换"
    - "GitOps（ArgoCD / FluxCD）集成"
    - "支持主版本、次版本与补丁更新"
    - "自定义数据库插件支持"
    - "通过 Envoy Gateway 实现跨集群访问"

kubernetes_platform:
  title: "KubeDB 可轻松集成至以下任意 Kubernetes 平台："
  description: "选择您熟悉的平台，轻松完成部署、扩展与运维。欢迎与我们一起拥抱未来的应用交付方式。"
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
  description: "KubeDB 的计费依据 <strong class=\"has-text-primary\">KubeDB 管理的数据库容器所设置的内存上限</strong>（而非 Kubernetes 节点内存）。例如，一个拥有 3 个副本、每个副本配置 8GB RAM 的 PostgreSQL 实例，按 24GB 内存计费。"

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
        silver: "适用于生产环境的自助式云方案"
        gold: "适用于生产数据库"
        platinum: "适用于关键业务或任务数据库"

      - title: "支持范围"
        silver: "自助服务"
        gold: "8x5 ⏰"
        platinum: "24x7 ⏰"

      - title: "响应 SLA"
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

      - title: "事件工单（含 SLA）"
        silver: "不适用"
        gold: "每月 5 个"
        platinum: "每月 10 个"

      - title: "可提交工单的联系人"
        silver: "1 个"
        gold: "5 个"
        platinum: "10 个"

      - title: "远程协助（屏幕共享，附加费用）"
        silver: "支持"
        gold: "支持（每月含 3 小时免费）"
        platinum: "支持（每月含 5 小时免费）"

      - title: "生产运维手册"
        silver: "不支持"
        gold: "支持"
        platinum: "支持"

      - title: "专属 Discord 私聊"
        silver: "不支持"
        gold: "支持"
        platinum: "支持"

      - title: "电话支持"
        silver: "不支持"
        gold: "支持"
        platinum: "支持 ☎"

      - title: "定制功能"
        silver: "不支持"
        gold: "需额外付费"
        platinum: "需额外付费"

faq_area:
  title: "常见问题解答"
  description: "以下是我们经常被问到的问题。如果您还有其他疑问，欢迎随时联系我们。"
  accordions:
    - title: "KubeDB 是开源的吗？"
      description: "KubeDB 采用开源核心（Open-Core）模式。API 和客户端基于 Apache v2 协议发布，可集成到您的项目中。"

    - title: "KubeDB 是否经过大规模验证？"
      description: "KubeDB 自 2017 年推出以来，已在多个客户环境中广泛部署，包括大型企业级使用场景。"

    - title: "KubeDB 与 StatefulSets 有什么区别？"
      description: "KubeDB 提供了完整的 Day 2 运维能力，如监控、告警、备份/恢复、版本升级和扩展等，远胜于基础 StatefulSet。"

    - title: "为什么选择 KubeDB 而不是数据库厂商的 Operator？"
      description: "通过 KubeDB，您可以在一个统一的平台下管理所有数据库，减少运维工作，避免多方协作的复杂性。"

    - title: "KubeDB 相较云厂商的数据库服务有何优势？"
      description: "KubeDB 支持多种数据库类型，适用于多云和本地部署环境，同时提供更具性价比的解决方案。"

footer:
  about_appscode: 
    - "AppsCode 是 Kubernetes 云原生数据平台领域的领导者。公司由前 Google 工程师 Tamal Saha 于 2016 年创立。"
    - "AppsCode 开发了多款流行的 Kubernetes 产品，包括 KubeDB、Stash、KubeVault、Kubeform 和 Voyager。总部位于美国内华达州拉斯维加斯，工程团队位于孟加拉国达卡。"
  contact_us:
    title: "联系我们"
  copy_right: "AppsCode Inc. 版权所有。"
---
