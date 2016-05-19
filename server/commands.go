package main

type CommandType struct {
	Key  *key   `json:"key"`
	Type string `json:"type"`
}

type Seq struct {
	Seq int `json:"seq"`
}

type HomeCommand struct {
	Seq
}

type LsCommand struct {
	Seq
	Path string `json:"path"`
}

type CatCommand struct {
	Seq
	Path string `json:"path"`
}
