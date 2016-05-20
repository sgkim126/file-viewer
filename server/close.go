package main

import (
	"os"
)

type CloseRequest struct {
	Seq
	Id int `json:"id"`
}

func (request CloseRequest) Handle(kg KeyGenerator, cm *ContextManager) (Response, error) {
	path, err := cm.RemoveContext(*request.Key, request.Id)
	if err != nil {
		return nil, err
	}
	err = os.Remove(path)
	if err != nil {
		return nil, err
	}
	return CloseResponse{
		request.Seq,
	}, nil
}

type CloseResponse struct {
	Seq
}

func (response CloseResponse) ResponseMessage() []byte {
	return ResponseMessage(response)
}
