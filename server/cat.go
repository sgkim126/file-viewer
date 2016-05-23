package main

type CatRequest struct {
	Seq
	Input CommandInput `json:"input"`
}

func (request CatRequest) Name() string {
	return "head"
}

func (request CatRequest) Commands(key key, cm ContextManager) (command string, err error) {
	command, err = Commands(request, key, cm)
	return
}

func (request CatRequest) Handle(kg KeyGenerator, cm *ContextManager) (Response, error) {
	return RunCommand(request, kg, cm)
}

func (request CatRequest) input() CommandInput {
	return request.Input
}

func (request CatRequest) options() []string {
	return []string{}
}

func (request CatRequest) key() key {
	return *request.Key
}

func (request CatRequest) seq() Seq {
	return request.Seq
}
