package main

type NewRequest struct {
	Seq
}

func (request NewRequest) Handle(tg TokenGenerator, cm *ContextManager) Response {
	oldToken := request.Token
	if oldToken != nil {
		if cm.HasToken(*oldToken) {
			return NewResponse{
				*oldToken,
				cm.Root(),
			}
		}
	}
	newToken := <-tg
	cm.AddToken(newToken)
	return NewResponse{
		newToken,
		cm.Root(),
	}
}

type NewResponse struct {
	Token token  `json:"token"`
	Root  string `json:"root"`
}

func (response NewResponse) ResponseMessage() []byte {
	return ResponseMessage(response)
}
