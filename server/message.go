package main

import (
	"encoding/json"
	"errors"
	"fmt"
)

type Request interface {
	Handle(kg TokenGenerator, cm *ContextManager) Response
}

type Seq struct {
	Token *token `json:"token"`
	Seq   *int   `json:"seq"`
}

type RequestType struct {
	Seq
	Type    string  `json:"type"`
	Command *string `json:"command"`
}

func (requestType RequestType) Request(data []byte) Request {
	switch requestType.Type {
	case "new":
		var request NewRequest
		err := json.Unmarshal(data, &request)
		shouldNot(err)
		return request
	case "ls":
		var request LsRequest
		err := json.Unmarshal(data, &request)
		shouldNot(err)
		return request
	case "close":
		var request CloseRequest
		err := json.Unmarshal(data, &request)
		shouldNot(err)
		return request
	case "more":
		var request MoreRequest
		err := json.Unmarshal(data, &request)
		shouldNot(err)
		return request
	case "command":
		if requestType.Command != nil {
			switch *requestType.Command {
			case "cat":
				var request CatRequest
				err := json.Unmarshal(data, &request)
				shouldNot(err)
				return request
			case "tac":
				var request TacRequest
				err := json.Unmarshal(data, &request)
				shouldNot(err)
				return request
			case "head":
				var request HeadRequest
				err := json.Unmarshal(data, &request)
				shouldNot(err)
				return request
			case "tail":
				var request TailRequest
				err := json.Unmarshal(data, &request)
				shouldNot(err)
				return request
			case "uniq":
				var request UniqRequest
				err := json.Unmarshal(data, &request)
				shouldNot(err)
				return request
			case "sort":
				var request SortRequest
				err := json.Unmarshal(data, &request)
				shouldNot(err)
				return request
			case "cut":
				var request CutRequest
				err := json.Unmarshal(data, &request)
				shouldNot(err)
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

type MessageError struct {
	Seq
	Error string `json:"error"`
}

type CommandError struct {
	Seq
	Errors  []string `json:"errors"`
	Command string   `json:"command"`
	Name    string   `json:"name"`
}

type CommandResponse struct {
	Seq
	Command       string `json:"command"`
	Name          string `json:"name"`
	Bytes         int    `json:"bytes"`
	Chars         int    `json:"chars"`
	Words         int    `json:"words"`
	Lines         int    `json:"lines"`
	MaxLineLength int    `json:"max_line_length"`
}

func (response CommandResponse) ResponseMessage() []byte {
	encoded, err := json.Marshal(response)
	if err != nil {
		return []byte(err.Error())
	}
	return encoded
}
