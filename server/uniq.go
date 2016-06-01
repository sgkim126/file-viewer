package main

import (
	"errors"
	"fmt"
	"strconv"
)

type UniqOption struct {
	Count          *bool   `json:"count"`
	Repeated       *bool   `json:"repeated"`
	AllRepeated    *string `json:"all-repeated"`
	SkipFields     *int    `json:"skip-fields"`
	IgnoreCase     *bool   `json:"ignore-case"`
	SkipChars      *int    `json:"skip-chars"`
	Unique         *bool   `json:"unique"`
	ZeroTerminated *bool   `json:"zero-terminated"`
	CheckChars     *int    `json:"check-chars"`
}

type UniqRequest struct {
	Seq
	Input  CommandInput `json:"input"`
	Option UniqOption   `json:"option"`
}

func (request UniqRequest) Name() string {
	return "uniq"
}

func (request UniqRequest) Commands(token token, cm ContextManager) string {
	return Commands(request, token, cm)
}

func (request UniqRequest) Handle(tg TokenGenerator, cm *ContextManager) Response {
	return RunCommand(request, tg, cm)
}

func (request UniqRequest) input() CommandInput {
	return request.Input
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
		case "seperate":
		default:
			panic(errors.New(fmt.Sprintf("\"%s\" is not a valid delmit method", delimitMethod)))
		}
		options = append(options, "--all-repeated", delimitMethod)
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
	return []string{}
}

func (request UniqRequest) token() token {
	return *request.Token
}

func (request UniqRequest) seq() Seq {
	return request.Seq
}
