---
type: "datasheet"
id: "memcached"
data: "data/products/kubedb/databases/memcached.json"
url: "/fr/datasheet/memcached"
title: "Solution complète pour la gestion de Memcached sur Kubernetes"

description: "KubeDB est une solution de gestion de bases de données native Kubernetes qui simplifie et automatise les tâches courantes de gestion des bases de données, telles que la provision, la surveillance, la mise à jour, les patchs, la mise à l'échelle, l'expansion de volume, la sauvegarde, la récupération, la détection de défaillance et la réparation pour diverses bases de données populaires sur tous les clouds privés et publics."
hero_features:
  - "Gérez plusieurs bases de données en toute simplicité."
  - "Améliorez la productivité des développeurs sans dépasser votre budget avec KubeDB."
  - "Exécutez votre DBaaS sur n'importe quel cloud, sur site, sur des machines de développement ou dans CI/CD."
  - "Dites adieu aux tracas grâce à notre support technique pratique."
  - "Déployez votre application et votre base de données en un seul geste."
  - "Libérez la puissance des bases de données par microservice"

contact_sales: "CONTACTEZ LES VENTES"
try_now: "ESSAYER MAINTENANT"

social_prof_title: "Nos clients sélectionnés"
features_section:
  title: "Caractéristiques"
  description: ""
  features:
    - "Provisionnement et gestion simplifiée des bases de données"
    - "Haute disponibilité et résilience"
    - "Registre privé et clusters isolés"
    - "Sauvegarde et restauration"
    - "Surveillance Prometheus et alertes intégrées"
    - "Mise à l'échelle horizontale et verticale"
    - "Expansion de volume"
    - "Portail web en libre-service"
    - "Gestion TLS et rotation des certificats"
    - "Intégration GitOps (ArgoCD / FluxCD)"
    - "Mises à jour des versions majeures, mineures et de patch"
    - "Support des plugins de bases de données personnalisés"
    - "Accès inter-clusters via Envoy Gateway"

kubernetes_platform:
  title: "KubeDB s'intègre facilement avec n'importe quelle plateforme Kubernetes, telles que ;"
  description: "Sélectionnez votre plateforme préférée et profitez du déploiement, de la scalabilité et de la gestion. Rejoignez-nous pour embrasser l'avenir du déploiement d'applications."
  platform_name:
    - "AWS Elastic Kubernetes Service (EKS)"
    - "Azure Kubernetes Service (AKS)"
    - "Google Kubernetes Engine (GKE)"
    - "Red Hat OpenShift"
    - "Rancher"
    - "VMware Tanzu"
    - "Equinix Metal"
    - "Openstack"
    - "Clusters Kubernetes On-Prem"
    - "IBM Cloud"
    - "Oracle Cloud"
    - "Alibaba Cloud"
    - "Digital Ocean"
    - "Linode"
    - "Exoscale Cloud Hosting"

pricing_model:
  title: "Modèle tarifaire"
  description: "KubeDB est facturé par la <strong class=\"has-text-primary\">limite de mémoire définie pour les containers de base de données gérés par KubeDB (et non la mémoire des nœuds de travail Kubernetes).</strong> Par exemple, une base de données PostgreSQL avec 3 réplicas, chacun avec 8 Go de RAM, sera comptée comme 24 Go de mémoire pour la facturation."

support_plans:
  title: "Plans de support"
  features_table:
    thead:
      - ""
      - "Silver"
      - "Gold"
      - "Platinum"
    tbody:
      - title: "Recommandé pour"
        silver: "Plan en libre-service style Cloud pour les bases de données de production"
        gold: "Pour les bases de données de production"
        platinum: "Pour les bases de données critiques pour l'entreprise et/ou la mission"

      - title: "Couverture du support"
        silver: "Libre-Service"
        gold: "8x5 ⏰"
        platinum: "24x7 ⏰"

      - title: "Délai de réponse SLA"
        silver: "Effort maximal"
        gold: "Oui"
        platinum: "Oui"

      - title: "Mises à jour trimestrielles"
        silver: "Oui"
        gold: "Oui"
        platinum: "Oui"

      - title: "Patchs d'urgence"
        silver: "Non"
        gold: "Oui"
        platinum: "Oui"

      - title: "Tickets d'incidents (avec couverture SLA)"
        silver: "N/A"
        gold: "5/mois"
        platinum: "10/mois"

      - title: "Contacts pour la gestion des tickets"
        silver: "1"
        gold: "5"
        platinum: "10"

      - title: "Aide à distance (via partage d'écran) moyennant des frais supplémentaires"
        silver: "Oui"
        gold: "Oui (inclut 3 heures gratuites/mois)"
        platinum: "Oui (inclut 5 heures gratuites/mois)"

      - title: "Guide de production"
        silver: "Non"
        gold: "Oui"
        platinum: "Oui"

      - title: "Chat privé dédié (via Discord)"
        silver: "Non"
        gold: "Oui"
        platinum: "Oui"

      - title: "Support téléphonique"
        silver: "Non"
        gold: "Oui"
        platinum: "Oui ☎"

      - title: "Fonctionnalités personnalisées"
        silver: "Non"
        gold: "Frais supplémentaires"
        platinum: "Frais supplémentaires"

faq_area:
  title: "Questions fréquemment posées"
  description: "Voici quelques-unes des questions que nous recevons le plus souvent. Si vous ne trouvez pas ce que vous cherchez, contactez-nous à tout moment."
  accordions:
    - title: "KubeDB est-il open source ?"
      description: "KubeDB suit un modèle open-core. L'API et le client sont disponibles sous la licence Apache v2 pour l'intégration avec des projets clients."

    - title: "KubeDB est-il éprouvé par des déploiements à grande échelle ?"
      description: "KubeDB a été lancé en 2017 et a depuis été déployé chez de nombreux clients, y compris des déploiements à grande échelle."

    - title: "En quoi KubeDB est-il différent de l'utilisation des StatefulSets ?"
      description: "KubeDB se distingue par ses opérations complètes du jour 2, englobant la surveillance, les alertes, la sauvegarde/la récupération, les mises à jour de versions et les fonctions de mise à l'échelle."

    - title: "Pourquoi utiliser KubeDB plutôt que les opérateurs des fournisseurs de bases de données ?"
      description: "Contrairement aux opérateurs des fournisseurs de bases de données, avec KubeDB, vous pouvez facilement satisfaire tous vos besoins en bases de données sous un seul contrat et avec un minimum d'efforts techniques."

    - title: "Quels sont les avantages de KubeDB par rapport aux services de base de données gérés par des fournisseurs de cloud ?"
      description: "KubeDB offre une large gamme d'options de bases de données, supportant des environnements multi-cloud et sur site, tout en offrant des solutions plus économiques."

footer:
  about_appscode: 
    - "AppsCode est un leader de la plateforme de données natives pour Kubernetes. AppsCode a été fondée en 2016 par Tamal Saha, un ancien ingénieur de Google."
    - "AppsCode développe un certain nombre de produits populaires pour Kubernetes, à savoir KubeDB, Stash, KubeVault, Kubeform, Voyager. AppsCode est basée à Las Vegas, Nevada, USA, avec des bureaux d'ingénierie à Dhaka, Bangladesh."
  contact_us:
    title: "CONTACTEZ NOUS"
  copy_right: "AppsCode Inc. Tous droits réservés."
---
