.PHONY: run
run:
	hugo server

docs:
	hugo-tools docs-aggregator

deploy:
	rm -rf public
	hugo --minify
	firebase deploy
