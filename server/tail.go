package main

import (
	"strconv"
)

type TailOption struct {
	Lines *int
	Bytes *int

	Input CommandInput `json:"input"`
}

type TailRequest struct {
	Seq
	Option TailOption `json:"option"`
}

func (request TailRequest) Name() string {
	return "tail"
}

func (request TailRequest) Commands(token token, cm ContextManager) string {
	return CommandsForOneInput(request, token, cm)
}

func (request TailRequest) Handle(kg TokenGenerator, cm *ContextManager) Response {
	return RunCommandForOneInput(request, kg, cm)
}

func (request TailRequest) input() CommandInput {
	return request.Option.Input
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

func (request TailRequest) token() token {
	return *request.Token
}

func (request TailRequest) seq() Seq {
	return request.Seq
}
