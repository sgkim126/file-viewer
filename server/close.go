package main

import (
	"encoding/json"
	"os"
)

type CloseCommand struct {
	Seq
	Id int `json:"id"`
}

type CloseResult struct {
	Seq
}

func (result CloseResult) ResultMessage() []byte {
	return ResultMessage(result)
}

func handleClose(data *[]byte, cm *ContextManager) (CommandResult, error) {
	var command CloseCommand
	err := json.Unmarshal(*data, &command)
	if err != nil {
		return nil, err
	}

	path, err := cm.RemoveContext(*command.Key, command.Id)
	if err != nil {
		return nil, err
	}
	err = os.Remove(path)
	if err != nil {
		return nil, err
	}
	return CloseResult{
		command.Seq,
	}, nil
}
