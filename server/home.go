package main

import (
	"os"
)

type HomeRequest struct {
	Seq
}

func (request HomeRequest) Handle(kg KeyGenerator, cm *ContextManager) (Response, error) {
	return HomeResponse{
		request.Seq,
		os.Getenv("HOME"),
	}, nil

}

type HomeResponse struct {
	Seq
	Home string `json:"home"`
}

func (response HomeResponse) ResponseMessage() []byte {
	return ResponseMessage(response)
}
