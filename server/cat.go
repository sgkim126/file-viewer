package main

type CatOption struct {
	NumberNonblank  *bool `json:"number-nonblank"`
	ShowEnds        *bool `json:"show-ends"`
	Number          *bool `json:"number"`
	SqueezeBlank    *bool `json:"squeeze-blank"`
	ShowTabs        *bool `json:"show-tabs"`
	ShowNonprinting *bool `json:"show-nonprinting"`
}

type CatRequest struct {
	Seq
	Input  CommandInput `json:"input"`
	Option CatOption    `json:"option"`
}

func (request CatRequest) Name() string {
	return "cat"
}

func (request CatRequest) Commands(key key, cm ContextManager) string {
	return Commands(request, key, cm)
}

func (request CatRequest) Handle(kg KeyGenerator, cm *ContextManager) Response {
	return RunCommand(request, kg, cm)
}

func (request CatRequest) input() CommandInput {
	return request.Input
}

func (request CatRequest) options() []string {
	options := []string{}
	option := request.Option
	if option.NumberNonblank != nil && *option.NumberNonblank {
		options = append(options, "--number-nonblank")
	}
	if option.ShowEnds != nil && *option.ShowEnds {
		options = append(options, "--show-ends")
	}
	if option.Number != nil && *option.Number {
		options = append(options, "--number")
	}
	if option.SqueezeBlank != nil && *option.SqueezeBlank {
		options = append(options, "--squeeze-blank")
	}
	if option.ShowTabs != nil && *option.ShowTabs {
		options = append(options, "--show-tabs")
	}
	if option.ShowNonprinting != nil && *option.ShowNonprinting {
		options = append(options, "--show-nonprinting")
	}
	return []string{}
}

func (request CatRequest) key() key {
	return *request.Key
}

func (request CatRequest) seq() Seq {
	return request.Seq
}
