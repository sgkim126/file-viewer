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

type HeadRequest struct {
	Seq
	Path  string `json:"path"`
	Lines *int   `json:"lines"`
	Bytes *int   `json:"bytes"`
}

func (request HeadRequest) Handle(kg KeyGenerator, cm *ContextManager) (Response, error) {
	path := request.Path

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
	if request.Lines != nil {
		options = fmt.Sprintf("%s -n %d", options, *request.Lines)
	}
	if request.Bytes != nil {
		options = fmt.Sprintf("%s -c %d", options, *request.Bytes)
	}

	arguments := append(strings.Split(options, " "), path)
	cmd := exec.Command("head", arguments...)
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

	command := fmt.Sprintf("head %s %s", options, path)
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
