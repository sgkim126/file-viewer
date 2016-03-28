TS_SRC := $(shell ls src/*.ts src/*.tsx)
STYL_SRC := $(shell ls src/*.styl)
PY_SRC := $(shell ls src/*.py ./viewer.py)
PY_TEST := $(shell ls src/*_test.py)

PORT := 12389

all: ./html/viewer.js

run: all | ENV
	./ENV/bin/python3 ./viewer.py --debug True $(PORT)

./html/viewer.js: ./src/main.ts $(TS_SRC) $(STYL_SRC) | ./typings/browser.d.ts
	./node_modules/.bin/webpack --entry ./$< --output-path $(@D) --output-filename $(@F)

ENV: ./requirements.txt
	virtualenv -p python3 $@
	./ENV/bin/pip install --upgrade pip
	./ENV/bin/pip install -r $<
	@touch $@

./typings/browser.d.ts: ./typings.json | ./node_modules/
	./node_modules/.bin/typings install

./node_modules/: ./package.json
	npm install

test: | ./ENV/
	./ENV/bin/python3 -m unittest $(PY_TEST)

lint: | tslint pylint

tslint: | ./node_modules/
	./node_modules/.bin/tslint -c tslint.json $(TS_SRC)

pylint: | ./ENV/
	./ENV/bin/pep8 $(PY_SRC)

clean:
	rm -f ./html/viewer.js
	rm -f ./html/viewer.css

distclean: | clean
	rm -rf ./node_modules/
	rm -rf ./typings/
	rm -rf ./ENV/
