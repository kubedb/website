.PHONY: run
run:
	hugo server --config=config.dev.yaml

.PHONY: docs
docs:
	hugo-tools docs-aggregator --shared

.PHONY: gen
gen:
	rm -rf public
	hugo --minify --config=config.yaml

.PHONY: deploy
deploy: gen
	firebase use prod
	firebase deploy
	firebase use default
