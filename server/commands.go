package main

type CommandType struct {
	Key  *key   `json:"key"`
	Type string `json:"type"`
}

type Seq struct {
	CommandType
	Seq int `json:"seq"`
}
