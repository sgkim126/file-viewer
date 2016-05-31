package main

import (
	"fmt"
	"os"
)

type CloseRequest struct {
	Seq
	Id int `json:"id"`
}

func (request CloseRequest) Handle(kg KeyGenerator, cm *ContextManager) Response {
	defer func() {
		r := recover()
		if r == nil {
			return
		}
		err, ok := r.(error)
		if !ok {
			fmt.Println("Error in Close:", r)
			return
		}
		panic(MessageError{
			request.Seq,
			err.Error(),
		})
	}()

	path, err := cm.RemoveContext(*request.Key, request.Id)
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
