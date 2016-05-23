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
	Commands(key key, cm ContextManager) string
	input() CommandInput
	options() []string
	key() key
	seq() Seq
}

func Commands(request CommandRequest, key key, cm ContextManager) string {
	options := ""
	input := request.input()
	if input.File != nil {
		return fmt.Sprintf("%s %s %s", request.Name(), options, *input.File)
	}
	if input.Pipe != nil {
		var c Context
		c, err := cm.GetContext(key, *input.Pipe)
		if err != nil {
			panic(err)
		}
		return fmt.Sprintf("%s | %s %s", c.command, request.Name(), options)
	}

	panic(errors.New("Cannot make command. Invalid input"))
}
func RunCommand(request CommandRequest, kg KeyGenerator, cm *ContextManager) Response {
	defer func() {
		r := recover()
		if r == nil {
			return
		}
		err, ok := r.(error)
		if !ok {
			fmt.Println("Error in RunCommand:", r)
			return
		}
		panic(MessageError{
			request.seq(),
			err.Error(),
		})
	}()
	inputPath, err := request.input().Path(request.key(), *cm)
	if err != nil {
		panic(err)
	}

	stdoutFile, err := ioutil.TempFile("", "filew-viewer")
	defer stdoutFile.Close()
	gocleanup.Register(func() {
		os.Remove(stdoutFile.Name())
	})
	if err != nil {
		panic(err)
	}

	arguments := append(request.options(), inputPath)
	cmd := exec.Command(request.Name(), arguments...)
	cmd.Stdout = stdoutFile

	err = cmd.Run()
	if err != nil {
		panic(err)
	}

	var lines []string
	file, err := os.Open(stdoutFile.Name())
	defer file.Close()
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		if scanner.Err() != nil {
			panic(scanner.Err())
		}
		lines = append(lines, scanner.Text())
	}

	var command string
	command = request.Commands(request.key(), *cm)
	id, err := cm.AddContext(request.key(), stdoutFile.Name(), command)
	if err != nil {
		panic(err)
	}

	return CommandResponse{
		request.seq(),
		command,
		id,
		lines,
	}
}
