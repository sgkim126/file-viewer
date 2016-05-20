package main

type NewRequest struct {
	RequestKey
}

func (request NewRequest) Handle(kg KeyGenerator, cm *ContextManager) (Response, error) {
	oldKey := request.Key
	if oldKey != nil {
		if cm.HasKey(*oldKey) {
			return NewResponse{
				*oldKey,
			}, nil
		}
	}
	newKey := <-kg
	cm.AddKey(newKey)
	return NewResponse{
		newKey,
	}, nil
}

type NewResponse struct {
	Key key `json:"key"`
}

func (response NewResponse) ResponseMessage() []byte {
	return ResponseMessage(response)
}
