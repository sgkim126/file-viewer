package main

import (
	"os"
)

type CloseRequest struct {
	Seq
	Id int `json:"id"`
}

func (request CloseRequest) Handle(kg KeyGenerator, cm *ContextManager) Response {
	path, err := cm.RemoveContext(*request.Key, request.Id)
	if err != nil {
		panic(MessageError{
			request.Seq,
			err.Error(),
		})
	}
	err = os.Remove(path)
	if err != nil {
		panic(MessageError{
			request.Seq,
			err.Error(),
		})
	}
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
