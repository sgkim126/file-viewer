package main

import (
	"encoding/json"
	"os"
)

type CloseRequest struct {
	Seq
	Id int `json:"id"`
}

type CloseResponse struct {
	Seq
}

func (result CloseResponse) ResponseMessage() []byte {
	return ResponseMessage(result)
}

func handleClose(data *[]byte, cm *ContextManager) (Response, error) {
	var command CloseRequest
	err := json.Unmarshal(*data, &command)
	if err != nil {
		return nil, err
	}

	path, err := cm.RemoveContext(*command.Key, command.Id)
	if err != nil {
		return nil, err
	}
	err = os.Remove(path)
	if err != nil {
		return nil, err
	}
	return CloseResponse{
		command.Seq,
	}, nil
}
