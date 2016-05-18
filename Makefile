GO_SRC := $(shell ls server/*.go)
TS_SRC := $(shell ls client/*.ts client/*.tsx)
STYL_SRC := $(shell ls client/*.styl)

PORT := 12389

all: ./server/server

run: ./server/server
	$< -port $(PORT)

./server/server: ./server/bindata.go $(GO_SRC) | goget
	cd ./server/; go build

./server/bindata.go: ./html/index.html ./html/viewer.js ./html/viewer.css | gobindata
	cd ./server/; go generate

./html/viewer.js: ./client/main.ts $(TS_SRC) $(STYL_SRC) | ./typings/browser.d.ts
	./node_modules/.bin/webpack --entry ./$< --output-path $(@D) --output-filename $(@F)

./typings/browser.d.ts: ./typings.json | ./node_modules/
	./node_modules/.bin/typings install

./node_modules/: ./package.json
	npm install

gobindata:
	go get -u github.com/jteeuwen/go-bindata/...

goget: ./server/bindata.go
	go get -t ./server/...

lint: | tslint

tslint: | ./node_modules/
	./node_modules/.bin/tslint -c tslint.json $(TS_SRC)

test: | goget
	cd ./server/; go test

clean:
	rm -f ./html/viewer.js
	rm -f ./html/viewer.css
	rm -f ./server/server

distclean: | clean
	rm -rf ./node_modules/
	rm -rf ./typings/
