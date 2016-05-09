package main

type CommandType struct {
	Key  *string `json:"key"`
	Type string  `json:"type"`
}

type CommandSeq struct {
	Seq int `json:"seq"`
}

type PwdCommand struct {
	CommandSeq
}

type LsCommand struct {
	CommandSeq
	Path string `json:"path"`
}

type CatCommand struct {
	CommandSeq
	Path string `json:"path"`
}
