test:
	@"./node_modules/.bin/mocha"  --reporter list "./test/test.basic.js"

.PHONY: test

test-ext:
	@"./node_modules/.bin/mocha"  --reporter list "./test/test.extended.js"

.PHONY: test-ext