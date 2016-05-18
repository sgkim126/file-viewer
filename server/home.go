package main

import (
	"encoding/json"
	"os"
)

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
