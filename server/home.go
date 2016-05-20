package main

import (
	"encoding/json"
	"os"
)

type HomeCommand struct {
	Seq
}

type HomeResult struct {
	Seq
	Home string `json:"home"`
}

func (result HomeResult) ResultMessage() []byte {
	return ResultMessage(result)
}

func handleHome(data *[]byte) (CommandResult, error) {
	var command HomeCommand
	err := json.Unmarshal(*data, &command)
	if err != nil {
		return nil, err
	}

	return HomeResult{
		command.Seq,
		os.Getenv("HOME"),
	}, nil

}
