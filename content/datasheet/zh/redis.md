---
type: "datasheet"
id: "redis"
data: "data/products/kubedb/databases/redis.json"
url: "/zh/datasheet/redis"
title: "在 Kubernetes 上管理 Redis 的一站式解决方案"

description: "KubeDB 是一个原生 Kubernetes 的数据库管理解决方案，能够简化并自动化日常数据库运维任务，如部署、监控、升级、打补丁、扩缩容、存储扩展、备份、恢复、故障检测与修复。支持多种流行数据库，适用于任何私有云与公有云。"

hero_features:
  - "轻松管理多个数据库。"
  - "用 KubeDB 提高开发效率，降低成本。"
  - "在任意云、本地、开发机或 CI/CD 环境中运行 DBaaS。"
  - "摆脱数据库运维困扰，我们提供专业工程支持。"
  - "实现 App 与数据库的统一部署，加速左移策略。"
  - "为每个微服务释放数据库的全部潜力。"

contact_sales: "联系我们"
try_now: "立即试用"

social_prof_title: "我们的部分客户"

features_section:
  title: "功能亮点"
  description: ""
  features:
    - "数据库自动部署与管理"
    - "高可用与强健性设计"
    - "私有镜像仓库与隔离环境支持"
    - "备份与恢复机制"
    - "内建 Prometheus 监控与告警"
    - "支持横向与纵向扩展"
    - "存储卷动态扩展"
    - "自助服务 Web 管理门户"
    - "TLS 管理与证书轮换"
    - "GitOps（ArgoCD / FluxCD）集成"
    - "支持主版本、次版本与补丁升级"
    - "支持自定义数据库插件"
    - "通过 Envoy Gateway 实现跨集群访问"

kubernetes_platform:
  title: "KubeDB 可无缝集成至以下 Kubernetes 平台："
  description: "选择您偏好的平台，享受部署、可扩展性与数据库管理的便捷体验。与我们一同迈入应用交付的未来。"
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
  description: "KubeDB 的费用依据 <strong class=\"has-text-primary\">KubeDB 所管理数据库容器的内存上限</strong>（不是 Kubernetes 节点的内存）。例如，一个包含 3 个副本、每个配置 8GB RAM 的 Redis 实例，将按 24GB 计费。"

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
        gold: "适用于一般生产数据库"
        platinum: "适用于关键业务或任务数据库"

      - title: "支持覆盖范围"
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

      - title: "带 SLA 的工单数量"
        silver: "不适用"
        gold: "每月 5 个"
        platinum: "每月 10 个"

      - title: "可提交工单的联系人"
        silver: "1 位"
        gold: "5 位"
        platinum: "10 位"

      - title: "远程协助（屏幕共享，额外计费）"
        silver: "支持"
        gold: "支持（每月含 3 小时免费）"
        platinum: "支持（每月含 5 小时免费）"

      - title: "生产运维手册"
        silver: "不支持"
        gold: "支持"
        platinum: "支持"

      - title: "专属 Discord 私聊频道"
        silver: "不支持"
        gold: "支持"
        platinum: "支持"

      - title: "电话支持"
        silver: "不支持"
        gold: "支持"
        platinum: "支持 ☎"

      - title: "定制功能"
        silver: "不支持"
        gold: "可选，需额外付费"
        platinum: "可选，需额外付费"

faq_area:
  title: "常见问题"
  description: "以下是我们最常收到的一些问题。如未找到您的问题，欢迎随时联系我们。"
  accordions:
    - title: "KubeDB 是开源的吗？"
      description: "KubeDB 采用开放核心（Open-Core）模式。其 API 与客户端基于 Apache v2 许可证发布，支持集成至客户项目中。"

    - title: "KubeDB 是否经过大规模部署验证？"
      description: "KubeDB 自 2017 年起广泛应用于各类客户环境，已成功支持众多大规模部署。"

    - title: "KubeDB 和 StatefulSet 有何不同？"
      description: "KubeDB 提供包括监控、告警、备份/恢复、版本升级和自动扩缩容等在内的 Day 2 运维能力，超越传统 StatefulSet。"

    - title: "为什么选择 KubeDB 而非数据库厂商的 Operator？"
      description: "KubeDB 提供统一平台管理所有数据库，极大减少运维工作量，同时提供单一合同与支持渠道，效率更高。"

    - title: "KubeDB 相比云厂商数据库服务有何优势？"
      description: "KubeDB 支持更多数据库类型，适用于多云与本地环境，且提供更具性价比的替代方案。"

footer:
  about_appscode: 
    - "AppsCode 是 Kubernetes 云原生数据平台的领导者，由前 Google 工程师 Tamal Saha 于 2016 年创办。"
    - "AppsCode 开发了多款热门 Kubernetes 产品，包括 KubeDB、Stash、KubeVault、Kubeform 和 Voyager。总部设在美国拉斯维加斯，在孟加拉国达卡设有工程中心。"
  contact_us:
    title: "联系我们"
  copy_right: "AppsCode Inc. 版权所有。"
---
