package main

import (
	"encoding/json"
	"os"
)

func handlePwd(data *[]byte) (CommandResult, error) {
	var command PwdCommand
	err := json.Unmarshal(*data, &command)
	if err != nil {
		return nil, err
	}

	return PwdResult{
		command.Seq,
		os.Getenv("HOME"),
	}, nil

}
