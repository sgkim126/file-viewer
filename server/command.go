package main

import (
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
		shouldNot(err)
		return fmt.Sprintf("%s | %s %s", c.command, request.Name(), options)
	}

	panic(errors.New("Cannot make command. Invalid input"))
}
func RunCommand(request CommandRequest, kg KeyGenerator, cm *ContextManager) Response {
	inputPath, err := request.input().Path(request.key(), *cm)
	shouldNot(err)

	stdoutFile, err := ioutil.TempFile("", "filew-viewer")
	defer stdoutFile.Close()
	gocleanup.Register(func() {
		os.Remove(stdoutFile.Name())
	})
	shouldNot(err)

	arguments := append(request.options(), inputPath)
	cmd := exec.Command(request.Name(), arguments...)
	cmd.Stdout = stdoutFile

	err = cmd.Run()
	shouldNot(err)

	var command string
	command = request.Commands(request.key(), *cm)
	id, err := cm.AddContext(request.key(), stdoutFile.Name(), command)
	shouldNot(err)

	bytes, chars, words, lines, max_line_length := wc(stdoutFile.Name())

	return CommandResponse{
		request.seq(),
		command,
		id,
		bytes,
		chars,
		words,
		lines,
		max_line_length,
	}
}
