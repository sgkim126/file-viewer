package main

import (
	"errors"
)

type CommandInput struct {
	File *string `json:"file"`
	Pipe *int    `json:"pipe"`
}

func (input CommandInput) Path(key key, cm ContextManager) (path string, err error) {
	if input.File != nil {
		path = *input.File
		return
	}
	if input.Pipe != nil {
		var c Context
		c, err = cm.GetContext(key, *input.Pipe)
		if err != nil {
			return
		}
		path = c.path
		return
	}

	err = errors.New("Cannot make path")
	return
}
