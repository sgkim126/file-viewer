package main

import (
	"fmt"
)

type CutOption struct {
	List1 *int    `json:"list1"`
	List2 *int    `json:"list2"`
	List  *string `json:"list"`

	Complement *bool `json:"complement"`

	Delimiter       *string `json:"delimiter"`
	OnlyDelimited   *bool   `json:"onlyDelimited"`
	OutputDelimiter *string `json:"outputDelimiter"`

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

	lists := "-"
	if option.List1 != nil {
		lists = fmt.Sprintf("%d%s", *option.List1, lists)
	}
	if option.List2 != nil {
		lists = fmt.Sprintf("%s%d", lists, *option.List2)
	}
	if option.List == nil {
		panic("you must specify a list of bytes, characters, or fields")
	}
	switch *option.List {
	case "byte":
	case "character":
	case "field":
	default:
		panic("you must specify a list of bytes, characters, or fields")
	}
	if lists != "-" {
		options = append(options, fmt.Sprintf("--%ss=%s", *option.List, lists))
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
