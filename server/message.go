package main

import (
	"encoding/json"
	"errors"
	"fmt"
)

type Request interface {
	Handle(kg KeyGenerator, cm *ContextManager) (Response, error)
}

type RequestKey struct {
	Key *key `json:"key"`
}

type RequestType struct {
	RequestKey
	Type    string  `json:"type"`
	Command *string `json:"command"`
}

func (requestType RequestType) Request(data []byte) (Request, error) {
	switch requestType.Type {
	case "new":
		var request NewRequest
		err := json.Unmarshal(data, &request)
		if err != nil {
			return nil, err
		}
		return request, nil
	case "home":
		var request HomeRequest
		err := json.Unmarshal(data, &request)
		if err != nil {
			return nil, err
		}
		return request, nil
	case "ls":
		var request LsRequest
		err := json.Unmarshal(data, &request)
		if err != nil {
			return nil, err
		}
		return request, nil
	case "close":
		var request CloseRequest
		err := json.Unmarshal(data, &request)
		if err != nil {
			return nil, err
		}
		return request, nil
	case "command":
		if requestType.Command != nil {
			switch *requestType.Command {
			case "cat":
				var request CatRequest
				err := json.Unmarshal(data, &request)
				if err != nil {
					return nil, err
				}
				return request, nil
			case "head":
				var request HeadRequest
				err := json.Unmarshal(data, &request)
				if err != nil {
					return nil, err
				}
				return request, nil
			case "tail":
				var request TailRequest
				err := json.Unmarshal(data, &request)
				if err != nil {
					return nil, err
				}
				return request, nil
			}
		}
		return nil, errors.New(fmt.Sprintf("Unhandled command: %s", string(data)))
	default:
		return nil, errors.New(fmt.Sprintf("Unhandled message: %s", string(data)))
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

type ErrorResponse struct {
	Seq
	Error string `json:"error"`
}

func (response ErrorResponse) ResponseMessage() []byte {
	return ResponseMessage(response)
}

type CommandResponse struct {
	Seq
	Command string   `json:"command"`
	Id      int      `json:"id"`
	Lines   []string `json:"lines"`
}

func (response CommandResponse) ResponseMessage() []byte {
	return ResponseMessage(response)
}
