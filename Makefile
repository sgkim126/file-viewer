PY_SRC := $(shell ls py/*.py ./viewer.py)

all:

ENV: ./requirements.txt
	virtualenv -p python3 $@
	./ENV/bin/pip install --upgrade pip
	./ENV/bin/pip install -r $<
	@touch $@

lint: | ./ENV/
	./ENV/bin/pep8 $(PY_SRC)

distclean:
	rm -rf ./ENV/
