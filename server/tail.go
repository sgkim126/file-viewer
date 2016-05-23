package main

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
)

type TailOption struct {
	Lines *int `json:"lines"`
	Bytes *int `json:"bytes"`
}

type TailRequest struct {
	Seq
	Input  CommandInput `json:"input"`
	Option TailOption   `json:"option"`
}

func (request TailRequest) Name() string {
	return "tail"
}

func (request TailRequest) Commands(key key, cm ContextManager) (command string, err error) {
	options := strings.Join(request.options(), " ")
	if request.Input.File != nil {
		command = fmt.Sprintf("%s %s %s", request.Name(), options, *request.Input.File)
		return
	}
	if request.Input.Pipe != nil {
		var c Context
		c, err = cm.GetContext(key, *request.Input.Pipe)
		if err != nil {
			return
		}
		command = fmt.Sprintf("%s | %s %s", c.command, request.Name(), options)
		return
	}

	err = errors.New("Cannot make command. Invalid input")
	return
}

func (request TailRequest) Handle(kg KeyGenerator, cm *ContextManager) (Response, error) {
	return RunCommand(request, kg, cm)
}

func (request TailRequest) input() CommandInput {
	return request.Input
}

func (request TailRequest) options() []string {
	options := []string{}
	if request.Option.Lines != nil {
		options = append(options, "-n", strconv.Itoa(*request.Option.Lines))
	}
	if request.Option.Bytes != nil {
		options = append(options, "-c", strconv.Itoa(*request.Option.Bytes))
	}
	return options
}

func (request TailRequest) key() key {
	return *request.Key
}

func (request TailRequest) seq() Seq {
	return request.Seq
}
