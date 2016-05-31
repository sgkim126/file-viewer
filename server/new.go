package main

type NewRequest struct {
	Seq
}

func (request NewRequest) Handle(kg KeyGenerator, cm *ContextManager) Response {
	oldKey := request.Key
	if oldKey != nil {
		if cm.HasKey(*oldKey) {
			return NewResponse{
				*oldKey,
				cm.Root(),
			}
		}
	}
	newKey := <-kg
	cm.AddKey(newKey)
	return NewResponse{
		newKey,
		cm.Root(),
	}
}

type NewResponse struct {
	Key  key    `json:"key"`
	Root string `json:"root"`
}

func (response NewResponse) ResponseMessage() []byte {
	return ResponseMessage(response)
}
