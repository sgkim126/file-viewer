package main

type TacOption struct {
	Before    *bool   `json:"before"`
	Regex     *bool   `json:"regex"`
	Separator *string `json:"separator"`

	Inputs []CommandInput `json:"inputs"`
}

type TacRequest struct {
	Seq
	Option TacOption `json:"option"`
}

func (request TacRequest) Name() string {
	return "tac"
}

func (request TacRequest) Handle(tg TokenGenerator, cm *ContextManager) Response {
	return RunCommandForMultipleInput(request, tg, cm)
}

func (request TacRequest) inputs() []CommandInput {
	return request.Option.Inputs
}

func (request TacRequest) options() []string {
	options := []string{}
	option := request.Option
	if option.Before != nil && *option.Before {
		options = append(options, "-b")
	}
	if option.Regex != nil && *option.Regex {
		options = append(options, "-r")
	}
	if option.Separator != nil {
		options = append(options, "-s", *option.Separator)
	}
	return options
}

func (request TacRequest) token() token {
	return *request.Token
}

func (request TacRequest) seq() Seq {
	return request.Seq
}
