package main

import (
	"errors"
	"fmt"
	"strconv"
)

type UniqOption struct {
	Count          *bool
	Repeated       *bool
	AllRepeated    *string
	SkipFields     *int
	IgnoreCase     *bool
	SkipChars      *int
	Unique         *bool
	ZeroTerminated *bool
	CheckChars     *int

	Input CommandInput `json:"input"`
}

type UniqRequest struct {
	Seq
	Option UniqOption `json:"option"`
}

func (request UniqRequest) Name() string {
	return "uniq"
}

func (request UniqRequest) Commands(token token, cm ContextManager) string {
	return CommandsForOneInput(request, token, cm)
}

func (request UniqRequest) Handle(tg TokenGenerator, cm *ContextManager) Response {
	return RunCommandForOneInput(request, tg, cm)
}

func (request UniqRequest) input() CommandInput {
	return request.Option.Input
}

func (request UniqRequest) options() []string {
	options := []string{}
	option := request.Option
	if option.Count != nil && *option.Count {
		options = append(options, "--count")
	}
	if option.Repeated != nil && *option.Repeated {
		options = append(options, "--repeated")
	}
	if option.AllRepeated != nil {
		delimitMethod := *option.AllRepeated
		if delimitMethod == "" {
			delimitMethod = "none"
		}
		switch delimitMethod {
		case "none":
		case "prepend":
		case "separate":
		default:
			panic(errors.New(fmt.Sprintf("\"%s\" is not a valid delmit method", delimitMethod)))
		}
		options = append(options, fmt.Sprintf("--all-repeated=%s", delimitMethod))
	}
	if option.SkipFields != nil {
		options = append(options, "--skip-fields", strconv.Itoa(*option.SkipFields))
	}
	if option.IgnoreCase != nil && *option.IgnoreCase {
		options = append(options, "--ignore-case")
	}
	if option.SkipChars != nil {
		options = append(options, "--skip-chars", strconv.Itoa(*option.SkipChars))
	}
	if option.Unique != nil && *option.Unique {
		options = append(options, "--unique")
	}
	if option.ZeroTerminated != nil && *option.ZeroTerminated {
		options = append(options, "--zero-terminated")
	}
	if option.CheckChars != nil {
		options = append(options, "--check-chars", strconv.Itoa(*option.CheckChars))
	}
	return options
}

func (request UniqRequest) token() token {
	return *request.Token
}

func (request UniqRequest) seq() Seq {
	return request.Seq
}
