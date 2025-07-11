---
title: MongoDB Backup Customization | KubeStash
description: Customizing MongoDB Backup and Restore process with KubeStash
menu:
  docs_v2025.6.30:
    identifier: guides-mongodb-backup-kubestash-customization
    name: Customizing Backup & Restore Process
    parent: guides-mongodb-backup-stashv2
    weight: 40
menu_name: docs_v2025.6.30
section_menu_id: guides
info:
  autoscaler: v0.41.0
  cli: v0.56.0
  dashboard: v0.32.0
  installer: v2025.6.30
  ops-manager: v0.43.0
  provisioner: v0.56.0
  schema-manager: v0.32.0
  ui-server: v0.32.0
  version: v2025.6.30
  webhook-server: v0.32.0
---

# Customizing Backup and Restore Process

KubeStash provides rich customization supports for the backup and restore process to meet the requirements of various cluster configurations. This guide will show you some examples of these customizations.

## Customizing Backup Process

In this section, we are going to show you how to customize the backup process. Here, we are going to show some examples of providing arguments to the backup process, running the backup process as a specific user, ignoring some indexes during the backup process, etc.

### Passing arguments to the backup process

KubeStash MongoDB addon uses [mongoump](https://docs.mongodb.com/database-tools/mongodump/) for backup. You can pass arguments to the `mongodump` through `args` param under `spec.sessions.addon.tasks[0].params` section.

The below example shows how you can pass the `--db testdb` to take backup for a specific mongodb databases named `testdb`.

```yaml
apiVersion: core.kubestash.com/v1alpha1
kind: BackupConfiguration
metadata:
  name: mg
  namespace: demo
spec:
  target:
    apiGroup: kubedb.com
    kind: MongoDB
    namespace: demo
    name: sample-mongodb
  backends:
    - name: s3-backend
      storageRef:
        namespace: demo
        name: s3-storage
      retentionPolicy:
        name: backup-rp
        namespace: demo
  sessions:
    - name: frequent
      scheduler:
        schedule: "*/5 * * * *"
        jobTemplate:
          backoffLimit: 1
      repositories:
        - name: s3-repo
          backend: s3-backend
          directory: /mongodb
          encryptionSecret:
            name: encry-secret
            namespace: demo
      addon:
        name: mongodb-addon
        tasks:
          - name: logical-backup
            params:
              args: "--db=testdb"
```

> **WARNING**: Make sure that you have the specific database created before taking backup. In this case, Database `testdb` should exist before the backup job starts.

### Running backup job as a specific user

If your cluster requires running the backup job as a specific user, you can provide `securityContext` under `spec.sessions.addon.tasks[0].jobTemplate.spec` section. The below example shows how you can run the backup job as the root user.

```yaml
apiVersion: core.kubestash.com/v1alpha1
kind: BackupConfiguration
metadata:
  name: mg
  namespace: demo
spec:
  target:
    apiGroup: kubedb.com
    kind: MongoDB
    namespace: demo
    name: sample-mongodb
  backends:
    - name: s3-backend
      storageRef:
        namespace: demo
        name: s3-storage
      retentionPolicy:
        name: backup-rp
        namespace: demo
  sessions:
    - name: frequent
      scheduler:
        jobTemplate:
          backoffLimit: 1
        schedule: "*/5 * * * *"
      repositories:
        - name: s3-repo
          backend: s3-backend
          directory: /mongodb
          encryptionSecret:
            name: encry-secret
            namespace: demo
      addon:
        name: mongodb-addon
        tasks:
          - name: logical-backup
        jobTemplate:
          spec:
            securityContext:
              runAsUser: 0
              runAsGroup: 0     
```

### Specifying Memory/CPU limit/request for the backup job

If you want to specify the Memory/CPU limit/request for your backup job, you can specify `resources` field under `spec.sessions.addon.containerRuntimeSettings` section.

```yaml
apiVersion: core.kubestash.com/v1alpha1
kind: BackupConfiguration
metadata:
  name: mg
  namespace: demo
spec:
  target:
    apiGroup: kubedb.com
    kind: MongoDB
    namespace: demo
    name: sample-mongodb
  backends:
    - name: s3-backend
      storageRef:
        namespace: demo
        name: s3-storage
      retentionPolicy:
        name: backup-rp
        namespace: demo
  sessions:
    - name: frequent
      scheduler:
        jobTemplate:
          backoffLimit: 1
        schedule: "*/3 * * * *"
      repositories:
        - name: s3-repo
          backend: s3-backend
          directory: /mongodb
          encryptionSecret:
            name: encry-secret
            namespace: demo
      addon:
        name: mongodb-addon
        tasks:
          - name: logical-backup
        containerRuntimeSettings:
          resources:
            requests:
              cpu: "200m"
              memory: "1Gi"
            limits:
              cpu: "200m"
              memory: "1Gi"
```

## Customizing Restore Process

KubeStash also uses `mongorestore` during the restore process. In this section, we are going to show how you can pass arguments to the restore process, restore a specific snapshot, run restore job as a specific user, etc.

### Passing arguments to the restore process

Similar to the backup process, you can pass arguments to the restore process through the `args` params under `spec.addon.tasks[0].params` section. This example will restore data from database `testdb`.

```yaml
apiVersion: core.kubestash.com/v1alpha1
kind: RestoreSession
metadata:
  name: mg-restore
  namespace: demo
spec:
  target:
    name: restore-mongodb
    namespace: demo
    apiGroup: kubedb.com
    kind: MongoDB
  dataSource:
    snapshot: latest
    repository: s3-repo
    encryptionSecret:
      name: encry-secret 
      namespace: demo
  addon:
    name: mongodb-addon
    tasks:
      - name: logical-backup-restore
        params:
          args: "--db=testdb"
```

### Restore specific snapshot

You can also restore a specific snapshot. At first, list the available snapshot as bellow,

```bash
❯ kubectl get snapshots -n demo
NAMESPACE   NAME                             REPOSITORY   SESSION    SNAPSHOT-TIME          DELETION-POLICY   PHASE       VERIFICATION-STATUS   AGE
demo        s3-repo-mg-frequent-1702291682   s3-repo      frequent   2023-12-11T10:48:10Z   Delete            Succeeded                         82m
demo        s3-repo-mg-frequent-1702291685   s3-repo      frequent   2023-12-11T10:49:10Z   Delete            Succeeded                         82m
```

The below example shows how you can pass a specific snapshot id through the `snapshots` filed of `spec.dataSource` section.

```yaml
apiVersion: core.kubestash.com/v1alpha1
kind: RestoreSession
metadata:
  name: mg-restore
  namespace: demo
spec:
  target:
    name: restore-mongodb
    namespace: demo
    apiGroup: kubedb.com
    kind: MongoDB
  dataSource:
    snapshot: s3-repo-mg-frequent-1702291682
    repository: s3-repo
    encryptionSecret:
      name: encry-secret 
      namespace: demo
  addon:
    name: mongodb-addon
    tasks:
      - name: logical-backup-restore
```

>Please, do not specify multiple snapshots here. Each snapshot represents a complete backup of your database. Multiple snapshots are only usable during file/directory restore.

### Running restore job as a specific user

You can provide `securityContext` under `spec.addon.tasks.jobTemplate.spec` section to run the restore job as a specific user.

```yaml
apiVersion: core.kubestash.com/v1alpha1
kind: RestoreSession
metadata:
  name: mg-restore
  namespace: demo
spec:
  target:
    name: restore-mongodb
    namespace: demo
    apiGroup: kubedb.com
    kind: MongoDB
  dataSource:
    snapshot: latest
    repository: s3-repo
    encryptionSecret:
      name: encry-secret
      namespace: demo
  addon:
    name: mongodb-addon
    tasks:
      - name: logical-backup-restore
    jobTemplate:
      spec:
        securityContext:
          runAsUser: 0
          runAsGroup: 0 
```

### Specifying Memory/CPU limit/request for the restore job

Similar to the backup process, you can also provide `resources` field under the `spec.addon.containerRuntimeSettings` section to limit the Memory/CPU for your restore job.

```yaml
apiVersion: core.kubestash.com/v1alpha1
kind: RestoreSession
metadata:
  name: mg-restore
  namespace: demo
spec:
  target:
    name: restore-mongodb
    namespace: demo
    apiGroup: kubedb.com
    kind: MongoDB
  dataSource:
    snapshot: latest
    repository: s3-repo
    encryptionSecret:
      name: encry-secret 
      namespace: demo
  addon:
    name: mongodb-addon
    tasks:
      - name: logical-backup-restore
    containerRuntimeSettings:
      resources:
        requests:
          cpu: "200m"
          memory: "1Gi"
        limits:
          cpu: "200m"
          memory: "1Gi"
```

## Cleanup
To cleanup the resources crated by this tutorial, run the following commands,

```bash
❯ kubectl delete backupconfiguration -n demo <backup-configuration-name>
❯ kubectl delete restoresession -n demo <restore-session-name>
```