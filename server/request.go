package main

type RequestType struct {
	Key  *key   `json:"key"`
	Type string `json:"type"`
}

type Seq struct {
	RequestType
	Seq int `json:"seq"`
}
