package main

import (
	"encoding/json"
)

type NewResponse struct {
	Key key `json:"key"`
}

func (result NewResponse) ResponseMessage() []byte {
	return ResponseMessage(result)
}

func handleNew(data *[]byte, kg KeyGenerator, cm *ContextManager) (Response, error) {
	var command RequestType
	err := json.Unmarshal(*data, &command)
	if err != nil {
		return nil, err
	}
	oldKey := command.Key
	if oldKey != nil {
		if cm.HasKey(*oldKey) {
			return NewResponse{
				*oldKey,
			}, nil
		}
	}
	newKey := <-kg
	cm.AddKey(newKey)
	return NewResponse{
		newKey,
	}, nil
}
