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

func (request HeadRequest) Commands(token token, cm ContextManager) string {
	return Commands(request, token, cm)
}

func (request HeadRequest) Handle(tg TokenGenerator, cm *ContextManager) Response {
	return RunCommand(request, tg, cm)
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

func (request HeadRequest) token() token {
	return *request.Token
}

func (request HeadRequest) seq() Seq {
	return request.Seq
}
