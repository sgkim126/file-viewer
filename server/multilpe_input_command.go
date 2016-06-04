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

type MultipleInputCommandRequest interface {
	Name() string
	inputs() []CommandInput
	options() []string
	token() token
	seq() Seq
}

func OptionsForMultipleInput(request MultipleInputCommandRequest, token token, cm ContextManager, file func(input CommandInput) string) []string {
	options := request.options()
	inputs := request.inputs()

	if len(inputs) == 0 {
		panic(errors.New("Cannot make command. Invalid input"))
	}

	for _, input := range inputs {
		options = append(options, file(input))
	}
	return options
}

func RunCommandForMultipleInput(request MultipleInputCommandRequest, tg TokenGenerator, cm *ContextManager) Response {
	stdoutFile, err := ioutil.TempFile("", "filew-viewer")
	defer stdoutFile.Close()
	gocleanup.Register(func() {
		os.Remove(stdoutFile.Name())
	})
	shouldNot(err)

	arguments := OptionsForMultipleInput(request, request.token(), *cm, func(input CommandInput) string {
		return input.Path(request.token(), *cm)
	})
	cmd := exec.Command(request.Name(), arguments...)
	cmd.Stdout = stdoutFile

	err = cmd.Run()
	shouldNot(err)

	argumentsForCommand := OptionsForMultipleInput(request, request.token(), *cm, func(input CommandInput) string {
		if input.File != nil {
			return *input.File
		}
		if input.Pipe != nil {
			var c Context
			c, err := cm.GetContext(request.token(), *input.Pipe)
			shouldNot(err)
			return fmt.Sprintf("<(%s)", c.command)
		}
		panic("cannot make command. Invalid input.")
	})
	command := strings.Join(argumentsForCommand, " ")
	if command != "" {
		command = " " + command
	}
	command = request.Name() + command
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
