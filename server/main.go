package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gorilla/websocket"
)

//go:generate go-bindata -prefix "html/" -pkg main -o bindata.go ../html/...

func main() {
	port := flag.Int("port", 12389, "port number to open server")
	bind := flag.String("bind", "127.0.0.1", "bind address")
	root := flag.String("root", os.Getenv("HOME"), "root path")
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

	tg := NewTokenGenerator(3)
	cm := NewContextManager(*root)

	http.Handle("/", http.StripPrefix("/", http.HandlerFunc(handleFile(contents, contentTypes))))
	http.HandleFunc("/c", http.HandlerFunc(handleRequest(tg, cm, *root)))
	fmt.Println("  Root %s", *root)
	fmt.Println("Listen %s:%d", *bind, *port)
	http.ListenAndServe(fmt.Sprintf("%s:%d", *bind, *port), nil)
}

type WebsocketMessage struct {
	messageType int
	data        []byte
}

func writer(ws *websocket.Conn) chan<- WebsocketMessage {
	c := make(chan WebsocketMessage, 5)
	go func(c <-chan WebsocketMessage) {
		for m := range c {
			err := ws.WriteMessage(m.messageType, m.data)
			if err != nil {
				fmt.Println("Cannot write message:", err)
			}
		}
	}(c)
	return c
}

func handleRequest(tg TokenGenerator, cm ContextManager, root string) func(http.ResponseWriter, *http.Request) {
	return func(response http.ResponseWriter, httpRequest *http.Request) {
		upgrader := websocket.Upgrader{}
		ws, err := upgrader.Upgrade(response, httpRequest, nil)
		if err != nil {
			fmt.Println("Cannot upgrade:", err)
		}

		writer := writer(ws)
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
						commandError, ok := r.(CommandError)
						if !ok {
							panic(r)
						}
						encoded, err := json.Marshal(commandError)
						shouldNot(err)
						writer <- WebsocketMessage{messageType, encoded}
						return
					}
					encoded, err := json.Marshal(errorResponse)
					shouldNot(err)
					writer <- WebsocketMessage{messageType, encoded}
				}(ws)
				requestType := RequestType{}
				err = json.Unmarshal(buffers, &requestType)
				shouldNot(err)

				defer func() {
					r := recover()
					if r == nil {
						return
					}
					err, ok := r.(error)
					if !ok {
						panic(r)
					}
					panic(MessageError{
						requestType.Seq,
						err.Error(),
					})
				}()
				request := requestType.Request(buffers)
				response := request.Handle(tg, &cm)

				writer <- WebsocketMessage{messageType, []byte(response.ResponseMessage())}
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

func shouldInRoot(root string, path string) {
	rel, err := filepath.Rel(root, path)
	if err == nil {
		if !strings.HasPrefix(rel, "..") {
			return
		}
	}
	panic(errors.New(fmt.Sprintf("%s is out of root", path)))
}
