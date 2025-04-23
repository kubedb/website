---
title: MongoDB Hidden-Node Concept
menu:
  docs_v2024.6.4:
    identifier: mg-hidden-concept
    name: Concept
    parent: mg-hidden
    weight: 10
menu_name: docs_v2024.6.4
section_menu_id: guides
info:
  autoscaler: v0.31.0
  cli: v0.46.0
  dashboard: v0.22.0
  installer: v2024.6.4
  ops-manager: v0.33.0
  provisioner: v0.46.0
  schema-manager: v0.22.0
  ui-server: v0.22.0
  version: v2024.6.4
  webhook-server: v0.22.0
---

> New to KubeDB? Please start [here](/docs/v2024.6.4/README).

# MongoDB Hidden node

Hidden node is a member of MongoDB ReplicaSet. It maintains a copy of the primary's data set but is invisible to client applications. Hidden members are good for workloads with different usage patterns from the other members in the replica set. For example, You are using an inMemory Mongodb database server, but in the same time you want your data to be replicated in a persistent storage, in that case, Hidden node is a smart choice.

Hidden members must always be priority 0 members and so cannot become primary. The db.hello() method does not display hidden members. Hidden members, however, may vote in elections.

<p align="center">
  <img alt="hidden-node"  src="/docs/v2024.6.4/images/mongodb/hidden.png" width="500" height="408">
</p>

# Considerations
There are some important considerations that should be taken care of by the Database administrators when deploying MongoDB. 

## Voting
Hidden members may vote in replica set elections. If you stop a voting hidden member, ensure that the set has an active majority or the primary will step down. [[reference]](https://www.mongodb.com/docs/manual/core/replica-set-hidden-member/#voting)

## Multiple hosts 
Always try to avoid scenarios where hidden-node is deployed on the same host as the primary of the replicaset.

## Write concern
As non-voting replica set members (i.e. members[n].votes is 0) cannot contribute to acknowledge write operations with majority write concern, hidden-members have to be voting capable in majority write-concern scenario.


## Next Steps

- [Deploy MongoDB ReplicaSet with Hidden-node](/docs/v2024.6.4/guides/mongodb/hidden-node/replicaset) using KubeDB.
- Detail concepts of [MongoDB object](/docs/v2024.6.4/guides/mongodb/concepts/mongodb).
- Detail concepts of [MongoDBVersion object](/docs/v2024.6.4/guides/mongodb/concepts/catalog).
- Want to hack on KubeDB? Check our [contribution guidelines](/docs/v2024.6.4/CONTRIBUTING).
