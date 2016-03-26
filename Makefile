TS_SRC := $(shell ls ts/*.ts ts/*.tsx)
PY_SRC := $(shell ls py/*.py ./viewer.py)

all: ./html/viewer.js

./html/viewer.js: ./ts/main.ts $(TS_SRC) | ./typings/browser.d.ts
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

lint: | ./ENV/
	./ENV/bin/pep8 $(PY_SRC)

clean:
	rm -f ./html/viewer.js

distclean: | clean
	rm -rf ./node_modules/
	rm -rf ./typings/
	rm -rf ./ENV/
