package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"net/http"

	"github.com/gorilla/websocket"
)

//go:generate go-bindata -prefix "html/" -pkg main -o bindata.go ../html/...

func main() {
	port := flag.Int("port", 12389, "port number to open server")
	flag.Parse()

	html, err := Asset("../html/index.html")
	if err != nil {
		panic(err)
	}
	css, err := Asset("../html/viewer.css")
	if err != nil {
		panic(err)
	}
	js, err := Asset("../html/viewer.js")
	if err != nil {
		panic(err)
	}

	DefaultPath := ""
	CSSPath := "viewer.css"
	JSPath := "viewer.js"

	contents := make(map[string]*[]byte)
	contents[DefaultPath] = &html
	contents[CSSPath] = &css
	contents[JSPath] = &js

	contentTypes := make(map[string]string)
	contentTypes[DefaultPath] = "text/html; charset=utf-8"
	contentTypes[CSSPath] = "text/css ; charset=utf-8"
	contentTypes[JSPath] = "application/javascript; charset=utf-8"

	http.Handle("/", http.StripPrefix("/", http.HandlerFunc(handleFile(contents, contentTypes))))
	http.HandleFunc("/c", handleCommand)
	fmt.Println("Listen :%d", *port)
	http.ListenAndServe(fmt.Sprintf(":%d", *port), nil)
}

func handleCommand(response http.ResponseWriter, request *http.Request) {
	upgrader := websocket.Upgrader{}
	ws, err := upgrader.Upgrade(response, request, nil)
	if err != nil {
		fmt.Println("Cannot upgrade:", err)
	}

	for {
		messageType, buffers, err := ws.ReadMessage()
		if messageType != 1 {
			continue
		}

		commandType := CommandType{}
		err = json.Unmarshal(buffers, &commandType)
		if err != nil {
			panic(err)
		}

		var result *[]byte
		switch commandType.Type {
		case "new":
			new := []byte("{\"key\":\"key\"}")
			result = &new
		case "pwd":
			result, err = handlePwd(&buffers)
			if err != nil {
				panic(err)
			}
		case "ls":
			result, err = handleLs(&buffers)
			if err != nil {
				panic(err)
			}
		case "cat":
			result, err = handleCat(&buffers)
			if err != nil {
				panic(err)
			}
		default:
		}

		err = ws.WriteMessage(messageType, *result)
		if err != nil {
			panic(err)
		}
	}
}

func handleFile(contents map[string]*[]byte, contentTypes map[string]string) func(http.ResponseWriter, *http.Request) {
	return func(response http.ResponseWriter, request *http.Request) {
		path := request.URL.Path
		content, ok := contents[path]
		if !ok {
			http.NotFound(response, request)
			return
		}
		contentType, ok := contentTypes[path]
		if !ok {
			http.NotFound(response, request)
			return
		}
		buffer := bytes.NewBuffer(*content)
		response.Header().Set("Content-Type", contentType)
		io.Copy(response, buffer)
	}
}
