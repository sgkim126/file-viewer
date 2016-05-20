package main

import (
	"encoding/json"
)

type CommandResult interface {
	ResultMessage() []byte
}

func ResultMessage(v interface{}) []byte {
	encoded, err := json.Marshal(v)
	if err != nil {
		return []byte(err.Error())
	}
	return encoded
}

type CommandError struct {
	Seq
	Error string `json:"error"`
}

type ResultWithCommand struct {
	Seq
	Command string `json:"command"`
	Id      int    `json:"id"`
}

func (result CommandError) ResultMessage() []byte {
	return ResultMessage(result)
}
