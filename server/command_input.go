package main

import (
	"errors"
)

type CommandInput struct {
	File *string `json:"file"`
	Pipe *int    `json:"pipe"`
}

func (input CommandInput) Path(token token, cm ContextManager) string {
	if input.File != nil {
		shouldInRoot(cm.Root(), *input.File)
		return *input.File
	}
	if input.Pipe != nil {
		c, err := cm.GetContext(token, *input.Pipe)
		shouldNot(err)
		return c.path
	}

	panic(errors.New("Cannot make path"))
}
