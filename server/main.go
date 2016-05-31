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
	bind := flag.String("bind", "127.0.0.1", "bind address")
	flag.Parse()

	html, err := Asset("../html/index.html")
	shouldNot(err)
	css, err := Asset("../html/viewer.css")
	shouldNot(err)
	js, err := Asset("../html/viewer.js")
	shouldNot(err)

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

	kg := NewKeyGenerator(3)
	cm := NewContextManager()

	http.Handle("/", http.StripPrefix("/", http.HandlerFunc(handleFile(contents, contentTypes))))
	http.HandleFunc("/c", http.HandlerFunc(handleRequest(kg, cm)))
	fmt.Println("Listen %s:%d", *bind, *port)
	http.ListenAndServe(fmt.Sprintf("%s:%d", *bind, *port), nil)
}

func handleRequest(kg KeyGenerator, cm ContextManager) func(http.ResponseWriter, *http.Request) {
	return func(response http.ResponseWriter, httpRequest *http.Request) {
		upgrader := websocket.Upgrader{}
		ws, err := upgrader.Upgrade(response, httpRequest, nil)
		if err != nil {
			fmt.Println("Cannot upgrade:", err)
		}

		for {
			messageType, buffers, err := ws.ReadMessage()
			if messageType != 1 {
				continue
			}
			go func(messageType int, buffers []byte, ws *websocket.Conn) {
				defer func(ws *websocket.Conn) {
					defer func() {
						r := recover()
						if r == nil {
							return
						}
						fmt.Println("Error in message handler.")
						fmt.Println("               Message :", string(buffers))
						fmt.Println("                 Error :", r)
						return
					}()
					r := recover()
					if r == nil {
						return
					}
					errorResponse, ok := r.(MessageError)
					if !ok {
						panic(r)
					}
					encoded, err := json.Marshal(errorResponse)
					shouldNot(err)
					err = ws.WriteMessage(messageType, encoded)
					shouldNot(err)
				}(ws)
				requestType := RequestType{}
				err = json.Unmarshal(buffers, &requestType)
				shouldNot(err)

				request := requestType.Request(buffers)
				response := request.Handle(kg, &cm)

				err = ws.WriteMessage(messageType, []byte(response.ResponseMessage()))
				shouldNot(err)
			}(messageType, buffers, ws)
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
