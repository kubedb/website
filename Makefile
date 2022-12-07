.PHONY: run
run:
	hugo server --config=config.dev.yaml

.PHONY: docs
docs: hugo-tools
	$(HUGO_TOOLS) docs-aggregator
	find ./data -name "*.json" -exec sed -i 's/https:\/\/cdn.appscode.com\/images/\/assets\/images/g' {} \;

.PHONY: docs-skip-assets
docs-skip-assets: hugo-tools
	$(HUGO_TOOLS) docs-aggregator --skip-assets
	find ./data -name "*.json" -exec sed -i 's/https:\/\/cdn.appscode.com\/images/\/assets\/images/g' {} \;

.PHONY: assets
assets: hugo-tools
	$(HUGO_TOOLS) docs-aggregator --only-assets
	find ./data -name "*.json" -exec sed -i 's/https:\/\/cdn.appscode.com\/images/\/assets\/images/g' {} \;

.PHONY: gen
gen:
	rm -rf public
	hugo --config=config.dev.yaml

.PHONY: qa
qa: gen
	firebase use default
	firebase deploy

.PHONY: gen-prod
gen-prod:
	rm -rf public
	hugo --minify --config=config.yaml

.PHONY: release
release: gen-prod
	firebase use prod
	firebase deploy
	firebase use default

.PHONY: check-links
check-links:
	liche -r public -d http://localhost:1313 -c 10 -p -l -x '^http://localhost:9090$$'

VERSION ?=

# https://stackoverflow.com/a/38982011/244009
.PHONY: set-version
set-version:
	@mv firebase.json firebase.bk.json
	@jq '(.hosting[] | .redirects[] | .destination) |= sub("\/docs\/.*\/"; "/docs/$(VERSION)/"; "l")' firebase.bk.json > firebase.json

ASSETS_REPO_URL ?=
.PHONY: set-assets-repo
set-assets-repo:
	@mv data/config.json data/config.bk.json
	@jq '(.assets | .repoURL) |= "$(ASSETS_REPO_URL)"' data/config.bk.json > data/config.json
	@rm -rf data/config.bk.json

HUGO_TOOLS = $(shell pwd)/bin/hugo-tools
.PHONY: hugo-tools
hugo-tools: ## Download hugo-tools locally if necessary.
	$(call go-get-tool,$(HUGO_TOOLS),appscodelabs/hugo-tools,v0.2.21)

# go-get-tool will 'curl' binary from GH repo $2 with version $3 and install it to $1.
PROJECT_DIR := $(shell dirname $(abspath $(lastword $(MAKEFILE_LIST))))
define go-get-tool
@[ -f $(1) ] || { \
set -e ;\
OS=$$(echo `uname`|tr '[:upper:]' '[:lower:]'); \
ARCH=$$(uname -m); \
case $$ARCH in \
  armv5*) ARCH="armv5";; \
  armv6*) ARCH="armv6";; \
  armv7*) ARCH="arm";; \
  aarch64) ARCH="arm64";; \
  x86) ARCH="386";; \
  x86_64) ARCH="amd64";; \
  i686) ARCH="386";; \
  i386) ARCH="386";; \
esac; \
bin=hugo-tools-$${OS}-$${ARCH}; \
echo "Downloading $${bin}" ;\
mkdir -p $(PROJECT_DIR)/bin; \
curl -fsSL -o $(1) https://github.com/$(2)/releases/download/$(3)/$${bin}; \
chmod +x $(1); \
}
endef
