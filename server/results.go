package main

import (
	"encoding/json"
)

type CommandResult interface {
	ResultMessage() []byte
}

func ResultMessage(v interface{}) []byte {
	encoded, err := json.Marshal(v)
	if err != nil {
		return []byte(err.Error())
	}
	return encoded
}

type CommandError struct {
	Seq
	Error string `json:"error"`
}

type ResultWithCommand struct {
	Seq
	Command string `json:"command"`
}

func (result CommandError) ResultMessage() []byte {
	return ResultMessage(result)
}

type NewResult struct {
	Key key `json:"key"`
}

func (result NewResult) ResultMessage() []byte {
	return ResultMessage(result)
}

type FileStat struct {
	Name             string `json:"name"`
	IsDir            bool   `json:"is_dir"`
	IsFile           bool   `json:"is_file"`
	IsSymlink        bool   `json:"is_symlink"`
	Size             int64  `json:"size"`
	NumberOfHardLink int    `json:"number_of_hard_link"`
	Ctime            int64  `json:"ctime"`
	Mtime            int64  `json:"mtime"`
	Atime            int64  `json:"atime"`
	Mode             uint32 `json:"mode"`
}

type LsResult struct {
	Seq
	Files []FileStat `json:"files"`
}

func (result LsResult) ResultMessage() []byte {
	return ResultMessage(result)
}

type HomeResult struct {
	Seq
	Home string `json:"home"`
}

func (result HomeResult) ResultMessage() []byte {
	return ResultMessage(result)
}

type CatResult struct {
	ResultWithCommand
	Lines []string `json:"lines"`
}

func (result CatResult) ResultMessage() []byte {
	return ResultMessage(result)
}
