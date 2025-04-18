---
type: "datasheet"
id: "elasticsearch"
data: "data/products/kubedb/databases/elasticsearch.json"
url: "/zh/datasheet/elasticsearch"

title: "在 Kubernetes 上管理 Elasticsearch 的一站式解决方案"
description: "KubeDB 是一款原生 Kubernetes 数据库管理解决方案，简化并自动化数据库的常规任务，例如：部署、监控、升级、修补、扩展、存储卷扩容、备份、恢复、故障检测和修复。支持多种流行数据库，适用于任何公有云和私有云环境。"
hero_features:
  - "轻松管理多个数据库。"
  - "借助 KubeDB 提高开发效率，节省成本。"
  - "在任何云环境、本地设备或 CI/CD 环境中运行您的 DBaaS。"
  - "通过我们的工程支持，告别数据库运维烦恼。"
  - "应用与数据库一体部署，实现左移策略。"
  - "为每个微服务释放数据库的强大能力。"

contact_sales: "联系我们"
try_now: "立即试用"

social_prof_title: "我们的精选客户"
features_section:
  title: "功能"
  description: ""
  features:
    - "数据库部署与简化管理"
    - "高可用性与弹性"
    - "私有镜像仓库与隔离集群"
    - "备份与恢复能力"
    - "内置 Prometheus 监控与警报"
    - "水平与垂直扩容"
    - "存储卷扩展"
    - "自助式 Web 门户"
    - "TLS 管理与证书轮换"
    - "GitOps（ArgoCD / FluxCD）集成"
    - "主版本、次版本与补丁版本升级"
    - "自定义数据库插件支持"
    - "通过 Envoy Gateway 实现跨集群访问"

kubernetes_platform:
  title: "KubeDB 可轻松集成至任何 Kubernetes 平台，包括："
  description: "选择您偏好的平台，享受轻松部署、扩展与管理。加入我们，共同拥抱未来的应用部署方式。"
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
  title: "定价模型"
  description: "KubeDB 的计费方式基于 <strong class=\"has-text-primary\">由 KubeDB 管理的数据库容器所设定的内存上限</strong>（不是 Kubernetes 工作节点的内存）。例如，一个拥有 3 个副本且每个副本配置 8 GB RAM 的 PostgreSQL 数据库将按 24 GB 内存计费。"

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
        silver: "面向生产环境数据库的自助式云计划"
        gold: "适用于生产数据库"
        platinum: "适用于关键业务或任务数据库"

      - title: "支持范围"
        silver: "自助服务"
        gold: "8x5 ⏰"
        platinum: "24x7 ⏰"

      - title: "响应时间 SLA"
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

      - title: "故障工单（含 SLA）"
        silver: "不适用"
        gold: "每月 5 个"
        platinum: "每月 10 个"

      - title: "工单联系人"
        silver: "1"
        gold: "5"
        platinum: "10"

      - title: "远程支持（屏幕共享，附加费用）"
        silver: "支持"
        gold: "支持（每月赠送 3 小时）"
        platinum: "支持（每月赠送 5 小时）"

      - title: "生产运行手册"
        silver: "不提供"
        gold: "提供"
        platinum: "提供"

      - title: "专属私聊（通过 Discord）"
        silver: "不提供"
        gold: "提供"
        platinum: "提供"

      - title: "电话支持"
        silver: "不提供"
        gold: "提供"
        platinum: "提供 ☎"

      - title: "定制功能"
        silver: "不支持"
        gold: "额外费用"
        platinum: "额外费用"

faq_area:
  title: "常见问题"
  description: "以下是我们最常被问到的一些问题。如果没有您想了解的内容，请随时联系我们。"
  accordions:
    - title: "KubeDB 是开源的吗？"
      description: "KubeDB 采用开放核心模式。API 和客户端在 Apache v2 许可证下开放，方便与其他项目集成。"

    - title: "KubeDB 是否经受过大规模部署的考验？"
      description: "KubeDB 自 2017 年启动以来，已在多个客户环境中成功部署，包括大规模应用场景。"

    - title: "KubeDB 与使用 StatefulSets 有什么不同？"
      description: "KubeDB 提供完整的 Day 2 运维能力，包括监控、警报、备份/恢复、版本升级与扩容等。"

    - title: "为什么选择 KubeDB 而不是数据库厂商的 Operator？"
      description: "与厂商的 Operator 不同，KubeDB 提供统一合同、简化运维流程，极大地降低了工程投入。"

    - title: "KubeDB 相比云服务商的托管数据库服务有何优势？"
      description: "KubeDB 支持多种数据库、跨云与本地环境，并具有更高的性价比。"

footer:
  about_appscode: 
    - "AppsCode 是 Kubernetes 云原生数据平台的领导者。由前 Google 工程师 Tamal Saha 于 2016 年创办。"
    - "AppsCode 开发了多个广受欢迎的 Kubernetes 工具，如 KubeDB、Stash、KubeVault、Kubeform 和 Voyager。总部位于美国内华达州拉斯维加斯，工程办公室设在孟加拉国达卡。"
  contact_us:
    title: "联系我们"
  copy_right: "AppsCode Inc. 版权所有。"
---
