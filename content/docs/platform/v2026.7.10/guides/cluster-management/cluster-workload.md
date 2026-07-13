---
layout: docs
menu:
  docsplatform_v2026.7.10:
    identifier: cluster-management-k8sworkloads
    name: Kubernetes Workload Management
    parent: cluster-management
    weight: 40
menu_name: docsplatform_v2026.7.10
section_menu_id: guides
info:
  kubedb-installer: v2026.7.10
  kubeops-installer: v2026.7.10
  product: kubedbplatform
  version: v2026.7.10
---

# Kubernetes Workload Management

The **Workloads** group in the Cluster UI sidebar is where you browse and manage everything that runs application containers — Deployments, Pods, Jobs, and the other standard Kubernetes workload types.

## Open the Workloads Section

1. Navigate to the [Platform Console](https://console.appscode.com).
2. Click on your imported cluster to open its Cluster Overview page.
3. In the left sidebar, click **Workloads** to expand it.

Every list page in this group follows the same layout: a 🔍 search box, an **All Namespaces** filter dropdown, and a green **+ Create** button top-right.

---

## Deployments

A Deployment keeps a set number of identical app copies running and handles rolling updates — it's the standard way to run and update a stateless app. Use this page when you need to check rollout status, scale an app up/down, or push a new image version.

Lists every Deployment with its Namespace, Pods (ready count), Images, and Age. Click a row to view or edit it; use **+ Create** to deploy a new one.

![Deployments list page showing the table of deployments with namespace filter and Create button](../images/cluster-workload/deployments-list.png)

---

## Replica Sets

A Replica Set's only job is to keep a fixed number of Pod copies alive. You rarely create these by hand — a Deployment creates and manages one for you behind the scenes. Check this page when troubleshooting why a Deployment isn't scaling the way you expect.

Lists every Replica Set with its Namespace, Pods, Images, and Age.

![Replica Sets list page showing namespace, pods, images, and age columns](../images/cluster-workload/replica-sets-list.png)

---

## Replication Controllers

The older, legacy way to keep a fixed number of Pod copies running — same idea as a Replica Set, kept for backward compatibility. New workloads should use Deployments instead; you'd only see entries here on older setups.

Lists every Replication Controller with its Namespace, Pods, Images, and Age. Click **+ Create ReplicationController** to add one.

![Replication Controllers list page with no data available and a Create ReplicationController button](../images/cluster-workload/replication-controllers-list.png)

---

## Stateful Sets

For apps where each Pod needs a stable identity and its own storage — databases, queues, anything that can't just be swapped for an identical copy. Use this when running stateful services that care about pod order or persistent data.

Lists every Stateful Set with its Namespace, Pods, Images, and Age.

![Stateful Sets list page showing namespace, pods, images, and age columns](../images/cluster-workload/stateful-sets-list.png)

---

## Daemon Sets

Runs one copy of a Pod on every node automatically — typically used for cluster-wide infrastructure like log collectors or monitoring agents that need to run everywhere. Check this page to confirm a node-wide agent has rolled out to all nodes.

Lists every Daemon Set with its Namespace, Pods, Dsired, Current-Scheduled, Up-to-date, Node Selector, Images, and Age — the Desired/Current/Up-to-date columns show rollout progress at a glance.

![Daemon Sets list page showing desired, current-scheduled, and up-to-date columns](../images/cluster-workload/daemon-sets-list.png)

---

## Jobs

A Job runs a task once until it completes — a backup, a migration script, a one-off batch process — then stops, unlike a Deployment which runs forever. Use this page to check whether a one-off task finished and how long it took.

Lists every Job with its Namespace, Annotations, Completions, Duration, Images, and Age.

![Jobs list page showing completions, duration, images, and age columns](../images/cluster-workload/jobs-list.png)

---

## Cron Jobs

A Cron Job runs a Job on a repeating schedule — like a nightly backup or a recurring cleanup task — so you don't have to trigger it manually each time. Use the **Suspend** state here to pause a recurring task without deleting it.

Lists every Cron Job with its Namespace, Annotations, Schedule, Suspend, Active, Last Schedule, Images, and Age — the Schedule column shows the cron expression.

![Cron Jobs list page showing schedule, suspend, active, and last schedule columns](../images/cluster-workload/cron-jobs-list.png)

---

## Pods

A Pod is the actual running container(s) — the smallest unit in Kubernetes. Every Deployment, StatefulSet, Job, etc. above ultimately creates Pods to do the real work. This is the page to check when you need to see real-time container health or debug a crash.

Lists every Pod with its Namespace, Ready, Status, Restarts, IP, Images, and Age — the only Workloads item with these extra live-state columns, useful for spotting crashing or restarting containers.

![Pods list page showing Ready, Status, Restarts, and IP columns](../images/cluster-workload/pods-list.png)

---

## Quick Reference

| Task | How to do it |
|---|---|
| Open the Workloads view | Click your cluster on the Platform Console → click **Workloads** in the left sidebar |
| List a workload type | Click its name under the Workloads group (e.g. Deployments, Pods) |
| Filter by namespace | Use the **All Namespaces** dropdown on any list page |
| Create a new workload | Click **+ Create** on the resource's list page |
