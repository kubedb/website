.PHONY: run
run:
	hugo server

.PHONY: docs
docs:
	hugo-tools docs-aggregator

.PHONY: deploy
deploy:
	rm -rf public
	hugo --minify
	firebase deploy
