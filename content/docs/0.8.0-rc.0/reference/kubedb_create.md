---
title: Kubedb Create
menu:
  docs_0.8.0-rc.0:
    identifier: kubedb-create
    name: Kubedb Create
    parent: reference
menu_name: docs_0.8.0-rc.0
section_menu_id: reference
info:
  version: 0.8.0-rc.0
---

## kubedb create

Create a resource by filename or stdin

### Synopsis

Create a resource by filename or stdin. 

JSON and YAML formats are accepted.

```
kubedb create [flags]
```

### Examples

```
  # Create a elasticsearch using the data in elastic.json.
  kubedb create -f ./elastic.json
  
  # Create a elasticsearch based on the JSON passed into stdin.
  cat elastic.json | kubedb create -f -
```

### Options

```
  -f, --filename strings   Filename to use to create the resource
  -h, --help               help for create
  -n, --namespace string   Create object(s) in this namespace. (default "default")
  -R, --recursive          Process the directory used in -f, --filename recursively.
```

### Options inherited from parent commands

```
      --analytics             Send analytical events to Google Analytics (default true)
      --kube-context string   name of the kubeconfig context to use
```

### SEE ALSO

* [kubedb](/docs/0.8.0-rc.0/reference/kubedb)	 - Command line interface for KubeDB


