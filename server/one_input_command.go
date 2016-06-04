package main

import (
	"errors"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"strings"

	"github.com/onsi/gocleanup"
)

type OneInputCommandRequest interface {
	Name() string
	Commands(token token, cm ContextManager) string
	input() CommandInput
	options() []string
	token() token
	seq() Seq
}

func CommandsForOneInput(request OneInputCommandRequest, token token, cm ContextManager) string {
	options := strings.Join(request.options(), " ")
	if options != "" {
		options = " " + options
	}
	input := request.input()
	if input.File != nil {
		return fmt.Sprintf("%s%s %s", request.Name(), options, *input.File)
	}
	if input.Pipe != nil {
		var c Context
		c, err := cm.GetContext(token, *input.Pipe)
		shouldNot(err)
		return fmt.Sprintf("%s | %s%s", c.command, request.Name(), options)
	}

	panic(errors.New("Cannot make command. Invalid input"))
}
func RunCommandForOneInput(request OneInputCommandRequest, tg TokenGenerator, cm *ContextManager) Response {
	inputPath := request.input().Path(request.token(), *cm)

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
	command = request.Commands(request.token(), *cm)
	id, err := cm.AddContext(request.token(), stdoutFile.Name(), command)
	shouldNot(err)

	bytes, chars, words, lines, max_line_length := wc(stdoutFile.Name())

	return CommandResponse{
		request.seq(),
		command,
		id,
		request.Name(),
		bytes,
		chars,
		words,
		lines,
		max_line_length,
	}
}