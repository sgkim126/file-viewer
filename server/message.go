package main

import (
	"encoding/json"
	"errors"
	"fmt"
)

type Request interface {
	Handle(kg KeyGenerator, cm *ContextManager) Response
}

type RequestKey struct {
	Key *key `json:"key"`
}

type RequestType struct {
	RequestKey
	Type    string  `json:"type"`
	Command *string `json:"command"`
}

func (requestType RequestType) Request(data []byte) Request {
	switch requestType.Type {
	case "new":
		var request NewRequest
		err := json.Unmarshal(data, &request)
		if err != nil {
			panic(err)
		}
		return request
	case "home":
		var request HomeRequest
		err := json.Unmarshal(data, &request)
		if err != nil {
			panic(err)
		}
		return request
	case "ls":
		var request LsRequest
		err := json.Unmarshal(data, &request)
		if err != nil {
			panic(err)
		}
		return request
	case "close":
		var request CloseRequest
		err := json.Unmarshal(data, &request)
		if err != nil {
			panic(err)
		}
		return request
	case "command":
		if requestType.Command != nil {
			switch *requestType.Command {
			case "cat":
				var request CatRequest
				err := json.Unmarshal(data, &request)
				if err != nil {
					panic(err)
				}
				return request
			case "head":
				var request HeadRequest
				err := json.Unmarshal(data, &request)
				if err != nil {
					panic(err)
				}
				return request
			case "tail":
				var request TailRequest
				err := json.Unmarshal(data, &request)
				if err != nil {
					panic(err)
				}
				return request
			case "uniq":
				var request UniqRequest
				err := json.Unmarshal(data, &request)
				if err != nil {
					panic(err)
				}
				return request
			}
		}
		panic(errors.New(fmt.Sprintf("Unhandled command: %s", string(data))))
	default:
		panic(errors.New(fmt.Sprintf("Unhandled message: %s", string(data))))
	}
}

type Response interface {
	ResponseMessage() []byte
}

func ResponseMessage(v interface{}) []byte {
	encoded, err := json.Marshal(v)
	if err != nil {
		return []byte(err.Error())
	}
	return encoded
}

type Seq struct {
	RequestKey
	Seq int `json:"seq"`
}

type MessageError struct {
	Seq
	Error string `json:"error"`
}

type CommandResponse struct {
	Seq
	Command string   `json:"command"`
	Id      int      `json:"id"`
	Lines   []string `json:"lines"`
}

func (response CommandResponse) ResponseMessage() []byte {
	encoded, err := json.Marshal(response)
	if err != nil {
		return []byte(err.Error())
	}
	return encoded
}
