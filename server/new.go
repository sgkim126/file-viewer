package main

import (
	"encoding/json"
)

func handleNew(data *[]byte, kg KeyGenerator, cm *ContextManager) (CommandResult, error) {
	var command CommandType
	err := json.Unmarshal(*data, &command)
	if err != nil {
		return nil, err
	}
	oldKey := command.Key
	if oldKey != nil {
		if cm.HasKey(*oldKey) {
			return NewResult{
				*oldKey,
			}, nil
		}
	}
	newKey := <-kg
	cm.AddKey(newKey)
	return NewResult{
		newKey,
	}, nil
}
