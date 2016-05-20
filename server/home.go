package main

import (
	"encoding/json"
	"os"
)

type HomeRequest struct {
	Seq
}

type HomeResponse struct {
	Seq
	Home string `json:"home"`
}

func (result HomeResponse) ResponseMessage() []byte {
	return ResponseMessage(result)
}

func handleHome(data *[]byte) (Response, error) {
	var command HomeRequest
	err := json.Unmarshal(*data, &command)
	if err != nil {
		return nil, err
	}

	return HomeResponse{
		command.Seq,
		os.Getenv("HOME"),
	}, nil

}
