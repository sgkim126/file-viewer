GO_SRC := $(shell ls server/*.go)
TS_SRC := $(shell ls client/*.ts client/*.tsx)
STYL_SRC := $(shell ls client/*.styl)

PORT := 12389
BIND := 0.0.0.0

all: ./server/server

run: ./server/server
	$< -port $(PORT) -bind $(BIND) --root=$(PWD)/data

./server/server: ./server/commands.go ./server/bindata.go $(GO_SRC) | goget
	cd ./server/; go build

./server/bindata.go: ./html/index.html ./html/viewer.js ./html/viewer.css ./html/commands.json | gobindata ./server/commands.go
	cd ./server/; go generate

./server/commands.go: ./server/generate.js ./html/commands.json
	cd ./server/; go generate

./server/generate.js: ./server/generate.ts | ./typings/browser.d.ts
	./node_modules/.bin/webpack --target node --entry ./$< --output-path $(@D) --output-filename $(@F)

./html/viewer.js: ./client/viewer.ts $(TS_SRC) $(STYL_SRC) | ./typings/browser.d.ts
	./node_modules/.bin/webpack --target web --entry ./$< --output-path $(@D) --output-filename $(@F)

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
	./node_modules/.bin/tslint -c tslint.json $(TS_SRC) ./server/generate.ts

test: | goget
	cd ./server/; go test

clean:
	rm -f ./html/viewer.js
	rm -f ./html/viewer.css
	rm -f ./server/server
	rm -f ./server/*.js
	rm -f ./server/bindata.go
	rm -f ./server/commands.go

distclean: | clean
	rm -rf ./node_modules/
	rm -rf ./typings/
