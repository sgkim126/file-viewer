package main

type CommOption struct {
	Column1 *bool `json:"column1"`
	Column2 *bool `json:"column2"`
	Column3 *bool `json:"column3"`

	CheckOrder   *bool `json:"noCheckOrder"`
	NocheckOrder *bool `json:"noCheckOrder"`

	OutputDelimiter *string `json:"outputDelimiter"`

	Input1 CommandInput `json:"input1"`
	Input2 CommandInput `json:"input2"`
}

type CommRequest struct {
	Seq
	Option CommOption `json:"option"`
}

func (request CommRequest) Name() string {
	return "comm"
}

func (request CommRequest) Handle(tg TokenGenerator, cm *ContextManager) Response {
	return RunCommandForTwoInput(request, tg, cm)
}

func (request CommRequest) input1() CommandInput {
	return request.Option.Input1
}

func (request CommRequest) input2() CommandInput {
	return request.Option.Input2
}

func (request CommRequest) options() []string {
	options := []string{}
	option := request.Option
	column := "-"
	if option.Column1 != nil && *option.Column1 {
		column += "1"
	}
	if option.Column2 != nil && *option.Column2 {
		column += "2"
	}
	if option.Column3 != nil && *option.Column3 {
		column += "3"
	}
	if column != "-" {
		options = append(options, column)
	}

	if option.CheckOrder != nil && *option.CheckOrder {
		options = append(options, "--check-order")
	}
	if option.NocheckOrder != nil && *option.NocheckOrder {
		options = append(options, "--nocheck-order")
	}

	if option.OutputDelimiter != nil {
		options = append(options, "--output-delimiter")
	}
	return options
}

func (request CommRequest) token() token {
	return *request.Token
}

func (request CommRequest) seq() Seq {
	return request.Seq
}
