.PHONY: run
run:
	hugo server --config=config.yaml

.PHONY: docs
docs: assets docs-operator docs-platform
	@true

.PHONY: docs-operator
docs-operator: hugo-tools
	$(HUGO_TOOLS) docs-aggregator --product=kubedb --docs-dir=docs --skip-assets
	find ./data -name "*.json" -exec sed -i 's/https:\/\/cdn.appscode.com\/images/\/assets\/images/g' {} \;

.PHONY: docs-platform
docs-platform: hugo-tools
	$(HUGO_TOOLS) docs-aggregator --product=kubedbplatform --docs-dir=docs/platform --skip-assets
	find ./data -name "*.json" -exec sed -i 's/https:\/\/cdn.appscode.com\/images/\/assets\/images/g' {} \;

.PHONY: assets
assets: hugo-tools
	$(HUGO_TOOLS) docs-aggregator --only-assets
	find ./data -name "*.json" -exec sed -i 's/https:\/\/cdn.appscode.com\/images/\/assets\/images/g' {} \;
	rm -rf static/files/cluster-api
	rm -rf static/files/cluster-api-provider-aws
	rm -rf static/files/cluster-api-provider-azure
	rm -rf static/files/cluster-api-provider-gcp
	rm -rf static/files/products/appscode/aws-marketplace
	rm -rf static/files/products/appscode/azure-marketplace
	rm -rf static/files/products/appscode/gcp-marketplace

.PHONY: gen
gen:
	rm -rf public
	hugo --config=config.yaml

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
	lychee --base-url http://localhost:1313 --max-concurrency 10 --exclude '^http://localhost:9090$$' 'public/**/*.html'

VERSION ?=

# https://stackoverflow.com/a/38982011/244009
.PHONY: set-operator-version
set-operator-version:
	@mv firebase.json firebase.bk.json
	@jq '(.hosting[] | .redirects[] | .destination) |= sub("\/docs\/(?!platform\/).*\/"; "/docs/$(VERSION)/"; "l")' firebase.bk.json > firebase.json

.PHONY: set-platform-version
set-platform-version:
	@mv firebase.json firebase.bk.json
	@jq '(.hosting[] | .redirects[] | .destination) |= sub("\/docs\/platform\/.*\/"; "/docs/platform/$(VERSION)/"; "l")' firebase.bk.json > firebase.json

ASSETS_REPO_URL ?=
.PHONY: set-assets-repo
set-assets-repo:
	@mv data/config.json data/config.bk.json
	@jq '(.assets | .repoURL) |= "$(ASSETS_REPO_URL)"' data/config.bk.json > data/config.json
	@rm -rf data/config.bk.json

HUGO_TOOLS = $(shell pwd)/bin/hugo-tools
.PHONY: hugo-tools
hugo-tools: ## Download hugo-tools locally if necessary.
	$(call go-get-tool,$(HUGO_TOOLS),appscodelabs/hugo-tools)

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
curl -fsSL -o $(1) https://github.com/$(2)/releases/latest/download/$${bin}; \
chmod +x $(1); \
}
endef
