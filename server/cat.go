package main

import (
	"bufio"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"

	"github.com/onsi/gocleanup"
)

type CatRequest struct {
	Seq
	Input CommandInput `json:"input"`
}

func (request CatRequest) Handle(kg KeyGenerator, cm *ContextManager) (Response, error) {
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

	cmd := exec.Command("cat", path)
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

	command := fmt.Sprintf("cat %s", path)
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
