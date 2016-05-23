package main

import (
	"bufio"
	"errors"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"

	"github.com/onsi/gocleanup"
)

type CommandRequest interface {
	Name() string
	Commands(key key, cm ContextManager) (string, error)
	input() CommandInput
	options() []string
	key() key
	seq() Seq
}

func Commands(request CommandRequest, key key, cm ContextManager) (command string, err error) {
	options := ""
	input := request.input()
	if input.File != nil {
		command = fmt.Sprintf("%s %s %s", request.Name(), options, *input.File)
		return
	}
	if input.Pipe != nil {
		var c Context
		c, err = cm.GetContext(key, *input.Pipe)
		if err != nil {
			return
		}
		command = fmt.Sprintf("%s | %s %s", c.command, request.Name(), options)
		return
	}

	err = errors.New("Cannot make command. Invalid input")
	return
}
func RunCommand(request CommandRequest, kg KeyGenerator, cm *ContextManager) (Response, error) {
	inputPath, err := request.input().Path(request.key(), *cm)
	if err != nil {
		return ErrorResponse{
			request.seq(),
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
			request.seq(),
			err.Error(),
		}, nil
	}

	arguments := append(request.options(), inputPath)
	cmd := exec.Command(request.Name(), arguments...)
	cmd.Stdout = stdoutFile

	err = cmd.Run()
	if err != nil {
		return ErrorResponse{
			request.seq(),
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
				request.seq(),
				scanner.Err().Error(),
			}, nil
		}
		lines = append(lines, scanner.Text())
	}

	var command string
	command, err = request.Commands(request.key(), *cm)
	if err != nil {
		return ErrorResponse{
			request.seq(),
			err.Error(),
		}, nil
	}
	id, err := cm.AddContext(request.key(), stdoutFile.Name(), command)
	if err != nil {
		return ErrorResponse{
			request.seq(),
			err.Error(),
		}, nil
	}

	return CommandResponse{
		request.seq(),
		command,
		id,
		lines,
	}, nil
}
