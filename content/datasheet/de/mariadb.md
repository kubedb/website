---
type: "datasheet"
id: "mariadb"
data: "data/products/kubedb/databases/mariadb.json"
url: "/de/datasheet/mariadb"
title: "All-in-One-Lösung zur Verwaltung von MariaDB auf Kubernetes"
description: "KubeDB ist eine Kubernetes-native Datenbankverwaltungsplattform, die alltägliche Aufgaben wie Bereitstellung, Überwachung, Upgrades, Patching, Skalierung, Volumenerweiterung, Backup, Wiederherstellung, Fehlererkennung und -behebung für verschiedene beliebte Datenbanken in privaten und öffentlichen Clouds vereinfacht und automatisiert."
hero_features:
  - "Verwalten Sie mehrere Datenbanken mit Leichtigkeit."
  - "Steigern Sie die Entwicklerproduktivität kosteneffizient mit KubeDB."
  - "Führen Sie Ihren DBaaS in jeder Cloud, vor Ort, auf Entwicklerrechnern oder in CI/CD aus."
  - "Verabschieden Sie sich von Kopfschmerzen dank unseres engagierten technischen Supports."
  - "App und Datenbank in einem einzigen schnellen Deployment zusammenführen."
  - "Nutzen Sie die volle Power von Datenbanken pro Microservice."

contact_sales: "VERTRIEB KONTAKTIEREN"
try_now: "JETZT AUSPROBIEREN"

social_prof_title: "Unsere ausgewählten Kunden"
features_section:
  title: "Funktionen"
  description: ""
  features:
    - "Datenbankbereitstellung und vereinfachte Verwaltung"
    - "Hohe Verfügbarkeit und Ausfallsicherheit"
    - "Private Registry und air-gapped Cluster"
    - "Backup- und Wiederherstellungsfunktionen"
    - "Integriertes Prometheus-Monitoring und -Benachrichtigungen"
    - "Horizontale & vertikale Skalierung"
    - "Volumenerweiterung"
    - "Self-Service Web-Portal"
    - "TLS-Verwaltung und Zertifikatsrotation"
    - "GitOps-Integration (ArgoCD / FluxCD)"
    - "Upgrades von Major-, Minor- und Patch-Versionen"
    - "Unterstützung für benutzerdefinierte Datenbank-Plugins"
    - "Cluster-übergreifender Zugriff mit Envoy Gateway"

kubernetes_platform:
  title: "KubeDB lässt sich mühelos in jede Kubernetes-Plattform integrieren, wie zum Beispiel:"
  description: "Wählen Sie Ihre bevorzugte Plattform und profitieren Sie von einfacher Bereitstellung, Skalierbarkeit und Verwaltung. Machen Sie mit uns den Schritt in die Zukunft der Anwendungsbereitstellung."
  platform_name:
    - "AWS Elastic Kubernetes Service (EKS)"
    - "Azure Kubernetes Service (AKS)"
    - "Google Kubernetes Engine (GKE)"
    - "Red Hat OpenShift"
    - "Rancher"
    - "VMware Tanzu"
    - "Equinix Metal"
    - "Openstack"
    - "Lokale Kubernetes-Cluster (On-Prem)"
    - "IBM Cloud"
    - "Oracle Cloud"
    - "Alibaba Cloud"
    - "Digital Ocean"
    - "Linode"
    - "Exoscale Cloud Hosting"

pricing_model:
  title: "Preismodell"
  description: "KubeDB wird basierend auf dem <strong class=\"has-text-primary\">Speicherlimit der von KubeDB verwalteten Datenbank-Container berechnet (nicht dem Speicher der Kubernetes-Worker-Nodes).</strong> Ein PostgreSQL mit 3 Replikas und jeweils 8 GB RAM ergibt zum Beispiel 24 GB Speicher zur Abrechnung."

support_plans:
  title: "Support-Pläne"
  features_table:
    thead:
      - ""
      - "Silber"
      - "Gold"
      - "Platin"
    tbody:
      - title: "Empfohlen für"
        silver: "Self-Service-Plan im Cloud-Stil für Produktionsdatenbanken"
        gold: "Für Produktionsdatenbanken"
        platinum: "Für geschäfts- und/oder missionskritische Datenbanken"

      - title: "Support-Abdeckung"
        silver: "Self-Service"
        gold: "8x5 ⏰"
        platinum: "24x7 ⏰"

      - title: "Reaktionszeit SLA"
        silver: "Best Effort"
        gold: "Ja"
        platinum: "Ja"

      - title: "Vierteljährliche Updates"
        silver: "Ja"
        gold: "Ja"
        platinum: "Ja"

      - title: "Notfall-Patches"
        silver: "Nein"
        gold: "Ja"
        platinum: "Ja"

      - title: "Incident-Tickets (mit SLA-Abdeckung)"
        silver: "N/V"
        gold: "5/Monat"
        platinum: "10/Monat"

      - title: "Ansprechpartner für Tickets"
        silver: "1"
        gold: "5"
        platinum: "10"

      - title: "Remote-Unterstützung (per Screensharing) gegen Aufpreis"
        silver: "Ja"
        gold: "Ja (inkl. 3 Std./Monat GRATIS)"
        platinum: "Ja (inkl. 5 Std./Monat GRATIS)"

      - title: "Produktions-Runbook"
        silver: "Nein"
        gold: "Ja"
        platinum: "Ja"

      - title: "Dedizierter privater Chat (via Discord)"
        silver: "Nein"
        gold: "Ja"
        platinum: "Ja"

      - title: "Telefon-Support"
        silver: "Nein"
        gold: "Ja"
        platinum: "Ja ☎"

      - title: "Benutzerdefinierte Funktionen"
        silver: "Nein"
        gold: "Zusätzliche Gebühr"
        platinum: "Zusätzliche Gebühr"

faq_area:
  title: "Häufig gestellte Fragen"
  description: "Hier finden Sie einige der am häufigsten gestellten Fragen. Wenn Ihre Frage nicht dabei ist, kontaktieren Sie uns jederzeit."
  accordions:
    - title: "Ist KubeDB Open Source?"
      description: "KubeDB folgt einem Open-Core-Modell. Die API und der Client stehen unter der Apache v2 Lizenz zur Integration in Kundenprojekte zur Verfügung."

    - title: "Ist KubeDB bereits bei großen Deployments erprobt?"
      description: "KubeDB wurde 2017 gestartet und seitdem bei zahlreichen Kunden – auch im großen Maßstab – eingesetzt."

    - title: "Worin unterscheidet sich KubeDB von StatefulSets?"
      description: "KubeDB hebt sich durch umfassende Day-2-Operationen hervor, einschließlich Monitoring, Benachrichtigungen, Backup/Wiederherstellung, Versionsupgrades und Skalierung."

    - title: "Warum KubeDB statt der Operatoren der DB-Anbieter?"
      description: "Im Gegensatz zu den Operatoren der Datenbankanbieter ermöglicht Ihnen KubeDB, alle Ihre Anforderungen unter einem einzigen Vertrag und mit minimalem Engineering-Aufwand zu erfüllen."

    - title: "Welche Vorteile bietet KubeDB gegenüber verwalteten Datenbankdiensten der Cloud-Anbieter?"
      description: "KubeDB bietet eine breite Auswahl an Datenbankoptionen und unterstützt Multi-Cloud- sowie On-Premise-Umgebungen – zu einem kosteneffizienteren Preis."

footer:
  about_appscode: 
    - "AppsCode ist führend im Bereich Cloud Native Data Platform für Kubernetes. Gegründet wurde AppsCode 2016 von Tamal Saha, einem ehemaligen Google-Ingenieur."
    - "AppsCode entwickelt beliebte Kubernetes-Produkte wie KubeDB, Stash, KubeVault, Kubeform und Voyager. Das Unternehmen hat seinen Hauptsitz in Las Vegas, Nevada, USA, mit Entwicklungsstandorten in Dhaka, Bangladesch."
  contact_us:
    title: "KONTAKTIEREN SIE UNS"
  copy_right: "AppsCode Inc. Alle Rechte vorbehalten."
---
