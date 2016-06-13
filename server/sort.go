package main

import (
	"fmt"
)

type SortOption struct {
	IngoreLeadingBlanks *bool
	DictionaryOrder     *bool
	IgnoreCase          *bool
	GeneralNumericSort  *bool
	IgnoreNonprinting   *bool
	MonthSort           *bool
	HumanNumericSort    *bool
	NumericSort         *bool
	RandomSort          *bool
	Reverse             *bool
	VersionSort         *bool

	BatchSize      *int
	Check          *bool
	CheckSilent    *bool
	Debug          *bool
	Files0From     *CommandInput
	Key            *int
	Merge          *bool
	Stable         *bool
	BufferSize     *int
	FieldSeperator *string
	Parallel       *int
	Unique         *bool
	ZeroTerminated *bool

	Inputs []CommandInput `json:"inputs"`
}

type SortRequest struct {
	Seq
	Option SortOption `json:"option"`
}

func (request SortRequest) Name() string {
	return "sort"
}

func (request SortRequest) Handle(tg TokenGenerator, cm *ContextManager) Response {
	return RunCommandForMultipleInput(request, tg, cm)
}

func (request SortRequest) inputs() []CommandInput {
	return request.Option.Inputs
}

func (request SortRequest) options() []string {
	options := []string{}
	option := request.Option
	if option.IngoreLeadingBlanks != nil && *option.IngoreLeadingBlanks {
		options = append(options, "--ignore-leading-blanks")
	}
	if option.DictionaryOrder != nil && *option.DictionaryOrder {
		options = append(options, "--dictionary-order")
	}
	if option.IgnoreCase != nil && *option.IgnoreCase {
		options = append(options, "--ignore-case")
	}
	if option.GeneralNumericSort != nil && *option.GeneralNumericSort {
		options = append(options, "--general-numeric-sort")
	}
	if option.IgnoreNonprinting != nil && *option.IgnoreNonprinting {
		options = append(options, "--ignore-nonprinting")
	}
	if option.MonthSort != nil && *option.MonthSort {
		options = append(options, "--month-sort")
	}
	if option.HumanNumericSort != nil && *option.HumanNumericSort {
		options = append(options, "--human-numeric-sort")
	}
	if option.NumericSort != nil && *option.NumericSort {
		options = append(options, "--numeric-sort")
	}
	if option.RandomSort != nil && *option.RandomSort {
		options = append(options, "--random-sort")
	}
	if option.Reverse != nil && *option.Reverse {
		options = append(options, "--reverse")
	}

	if option.BatchSize != nil {
		options = append(options, fmt.Sprintf("--batch-size=%d", *option.BatchSize))
	}
	if option.Check != nil && *option.Check {
		options = append(options, "--check")
	}
	if option.CheckSilent != nil && *option.CheckSilent {
		options = append(options, "--check-silent")
	}
	if option.Debug != nil && *option.Debug {
		options = append(options, "--debug")
	}
	if option.Files0From != nil {
		panic("--files0-from is not implemented")
	}
	if option.Key != nil {
		options = append(options, fmt.Sprintf("--key=%d", *option.Key))
	}
	if option.Merge != nil && *option.Merge {
		options = append(options, "--merge")
	}
	if option.Stable != nil && *option.Stable {
		options = append(options, "--stable")
	}
	if option.BufferSize != nil {
		options = append(options, fmt.Sprintf("--buffer-size=%d", *option.BufferSize))
	}
	if option.FieldSeperator != nil {
		options = append(options, fmt.Sprintf("--field-seperator=%s", *option.FieldSeperator))
	}
	if option.Parallel != nil {
		options = append(options, fmt.Sprintf("--parallel=%d", *option.Parallel))
	}
	if option.Unique != nil && *option.Unique {
		options = append(options, "--unique")
	}
	if option.ZeroTerminated != nil && *option.ZeroTerminated {
		options = append(options, "--zero-terminated")
	}
	return options
}

func (request SortRequest) token() token {
	return *request.Token
}

func (request SortRequest) seq() Seq {
	return request.Seq
}
