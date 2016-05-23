package main

import (
	"strconv"
)

type HeadOption struct {
	Lines *int `json:"lines"`
	Bytes *int `json:"bytes"`
}

type HeadRequest struct {
	Seq
	Input  CommandInput `json:"input"`
	Option HeadOption   `json:"option"`
}

func (request HeadRequest) Name() string {
	return "head"
}

func (request HeadRequest) Commands(key key, cm ContextManager) (string, error) {
	return Commands(request, key, cm)
}

func (request HeadRequest) Handle(kg KeyGenerator, cm *ContextManager) (Response, error) {
	return RunCommand(request, kg, cm)
}

func (request HeadRequest) input() CommandInput {
	return request.Input
}

func (request HeadRequest) options() []string {
	options := []string{}
	if request.Option.Lines != nil {
		options = append(options, "-n", strconv.Itoa(*request.Option.Lines))
	}
	if request.Option.Bytes != nil {
		options = append(options, "-c", strconv.Itoa(*request.Option.Bytes))
	}
	return options
}

func (request HeadRequest) key() key {
	return *request.Key
}

func (request HeadRequest) seq() Seq {
	return request.Seq
}
