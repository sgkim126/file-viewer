package main

import (
	"os"
)

type CloseRequest struct {
	Seq
	Id int `json:"id"`
}

func (request CloseRequest) Handle(tg TokenGenerator, cm *ContextManager) Response {
	path, err := cm.RemoveContext(*request.Token, request.Id)
	shouldNot(err)
	err = os.Remove(path)
	shouldNot(err)
	return CloseResponse{
		request.Seq,
	}
}

type CloseResponse struct {
	Seq
}

func (response CloseResponse) ResponseMessage() []byte {
	return ResponseMessage(response)
}
