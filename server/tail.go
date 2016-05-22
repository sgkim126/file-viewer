package main

import (
	"bufio"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"strings"

	"github.com/onsi/gocleanup"
)

type TailOption struct {
	Lines *int `json:"lines"`
	Bytes *int `json:"bytes"`
}

type TailRequest struct {
	Seq
	Input  CommandInput `json:"input"`
	Option TailOption   `json:"option"`
}

func (request TailRequest) Handle(kg KeyGenerator, cm *ContextManager) (Response, error) {
	path, err := request.Input.Path(*request.Key, *cm)
	if err != nil {
		return ErrorResponse{
			request.Seq,
			err.Error(),
		}, nil
	}

	stdoutFile, err := ioutil.TempFile("", "filew-viewer")
	defer stdoutFile.Close()
	gocleanup.Register(func() {
		os.Remove(stdoutFile.Name())
	})
	if err != nil {
		return ErrorResponse{
			request.Seq,
			err.Error(),
		}, nil
	}

	options := "-q"
	if request.Option.Lines != nil {
		options = fmt.Sprintf("%s -n %d", options, *request.Option.Lines)
	}
	if request.Option.Bytes != nil {
		options = fmt.Sprintf("%s -c %d", options, *request.Option.Bytes)
	}

	arguments := append(strings.Split(options, " "), path)
	cmd := exec.Command("tail", arguments...)
	cmd.Stdout = stdoutFile

	err = cmd.Run()
	if err != nil {
		return ErrorResponse{
			request.Seq,
			err.Error(),
		}, nil
	}

	var lines []string
	file, err := os.Open(stdoutFile.Name())
	defer file.Close()
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		if scanner.Err() != nil {
			return ErrorResponse{
				request.Seq,
				scanner.Err().Error(),
			}, nil
		}
		lines = append(lines, scanner.Text())
	}

	command := fmt.Sprintf("tail %s %s", options, path)
	id, err := cm.AddContext(*request.Key, stdoutFile.Name(), command)
	if err != nil {
		return ErrorResponse{
			request.Seq,
			err.Error(),
		}, nil
	}

	return CommandResponse{
		request.Seq,
		command,
		id,
		lines,
	}, nil
}
