NODE_BIN 		 = node_modules/.bin
EXAMPLE_DIST = example/dist
EXAMPLE_SRC  = example/src
STANDALONE   = standalone
SRC          = src
DIST         = dist
TEST         = test/*.test.js
MOCHA_OPTS   = --compilers js:babel-core/register --require test/setup.js -b --timeout 20000 --reporter spec

lint:
	@echo Linting...
	@$(NODE_BIN)/standard --verbose | $(NODE_BIN)/snazzy src/index.js

test: lint
	@echo Start testing...
	@$(NODE_BIN)/mocha $(MOCHA_OPTS) $(TEST)

convertCSS:
	@echo Converting css...
	@node bin/transferSass.js

genStand:
	@echo Generating standard...
	@rm -rf $(STANDALONE) && mkdir $(STANDALONE)
	@$(NODE_BIN)/browserify -t babelify -t browserify-shim $(SRC)/index.js --standalone ReactTooltip -o $(STANDALONE)/react-tooltip.js
	@$(NODE_BIN)/browserify -t babelify -t browserify-shim $(SRC)/index.js --standalone ReactTooltip | $(NODE_BIN)/uglifyjs > $(STANDALONE)/react-tooltip.min.js
	@cp $(DIST)/style.js $(STANDALONE)/style.js

devJS:
	@$(NODE_BIN)/watchify -t babelify $(EXAMPLE_SRC)/index.js -o $(EXAMPLE_DIST)/index.js -dv

devCSS:
	@$(NODE_BIN)/node-sass $(EXAMPLE_SRC)/index.scss $(EXAMPLE_DIST)/index.css
	@$(NODE_BIN)/node-sass -w $(EXAMPLE_SRC)/index.scss $(EXAMPLE_DIST)/index.css

devServer:
	@echo Listening 8888...
	@$(NODE_BIN)/http-server example -p 8888 -s

dev:
	@echo starting dev server...
	@rm -rf $(EXAMPLE_DIST)
	@mkdir -p $(EXAMPLE_DIST)
	@make convertCSS
	@$(NODE_BIN)/concurrently --kill-others "make devJS" "make devCSS" "make devServer"

deployJS:
	@echo Generating deploy JS files...
	@$(NODE_BIN)/babel $(SRC)/index.js -o $(DIST)/react-tooltip.js
	@$(NODE_BIN)/babel $(SRC)/style.js -o $(DIST)/style.js
	@$(NODE_BIN)/babel $(SRC)/index.js | $(NODE_BIN)/uglifyjs > $(DIST)/react-tooltip.min.js

deployCSS:
	@echo Generating deploy CSS files...
	@cp $(SRC)/index.scss $(DIST)/react-tooltip.scss
	@$(NODE_BIN)/node-sass --output-style compressed $(SRC)/index.scss $(DIST)/react-tooltip.min.css

deploy: lint
	@echo Deploy...
	@rm -rf dist && mkdir dist
	@make convertCSS
	@make deployCSS
	@make deployJS
	@make genStand
	@echo success!

.PHONY: lint convertCSS genStand devJS devCSS devServer dev deployJS deployCSS deploy
