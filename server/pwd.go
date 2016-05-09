package main

import (
	"encoding/json"
	"os"
)

func handlePwd(data *[]byte) (*[]byte, error) {
	var command PwdCommand
	err := json.Unmarshal(*data, &command)
	if err != nil {
		return nil, err
	}
	result := make(map[string]interface{})
	result["seq"] = command.Seq
	result["pwd"] = os.Getenv("HOME")

	encoded, err := json.Marshal(result)
	if err != nil {
		return nil, err
	}
	return &encoded, nil
}
