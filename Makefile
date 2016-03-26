PY_SRC := $(shell ls py/*.py ./viewer.py)

all:

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

distclean:
	rm -rf ./node_modules/
	rm -rf ./typings/
	rm -rf ./ENV/
