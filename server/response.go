package main

import (
	"encoding/json"
)

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

type ErrorResponse struct {
	Seq
	Error string `json:"error"`
}

type ResponseWithCommand struct {
	Seq
	Command string `json:"command"`
	Id      int    `json:"id"`
}

func (result ErrorResponse) ResponseMessage() []byte {
	return ResponseMessage(result)
}
