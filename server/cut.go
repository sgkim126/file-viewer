package main

import (
	"fmt"
)

type CutOption struct {
	Bytes      *string
	Characters *string
	Fields     *string

	Complement *bool

	Delimiter       *string
	OnlyDelimited   *bool
	OutputDelimiter *string

	Inputs []CommandInput `json:"inputs"`
}

type CutRequest struct {
	Seq
	Option CutOption `json:"option"`
}

func (request CutRequest) Name() string {
	return "cut"
}

func (request CutRequest) Handle(tg TokenGenerator, cm *ContextManager) Response {
	return RunCommandForMultipleInput(request, tg, cm)
}

func (request CutRequest) inputs() []CommandInput {
	return request.Option.Inputs
}

func (request CutRequest) options() []string {
	options := []string{}
	option := request.Option

	if option.Bytes != nil {
		options = append(options, "-b", *option.Bytes)
	}
	if option.Characters != nil {
		options = append(options, "-c", *option.Characters)
	}
	if option.Fields != nil {
		options = append(options, "-f", *option.Fields)
	}

	if option.Complement != nil && *option.Complement {
		options = append(options, "--complement")
	}
	if option.Delimiter != nil {
		options = append(options, fmt.Sprintf("--delimiter=%s", *option.Delimiter))
	}
	if option.OnlyDelimited != nil && *option.OnlyDelimited {
		options = append(options, "--only-delimited")
	}
	if option.OutputDelimiter != nil {
		options = append(options, fmt.Sprintf("--output-delimiter=%s", *option.OutputDelimiter))
	}
	return options
}

func (request CutRequest) token() token {
	return *request.Token
}

func (request CutRequest) seq() Seq {
	return request.Seq
}
