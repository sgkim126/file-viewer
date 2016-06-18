package main

import (
	"bufio"
	"errors"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"path"
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

	argumentsForShortCommand := OptionsForMultipleInput(request, request.token(), *cm, func(input CommandInput) string {
		if input.File != nil {
			return path.Base(*input.File)
		}
		if input.Pipe != nil {
			var c Context
			c, err := cm.GetContext(request.token(), *input.Pipe)
			shouldNot(err)
			return fmt.Sprintf("<(%s)", c.shortCommand)
		}
		panic("cannot make command. Invalid input.")
	})
	shortCommand := strings.Join(argumentsForShortCommand, " ")
	if shortCommand != "" {
		shortCommand = " " + shortCommand
	}
	shortCommand = request.Name() + shortCommand

	stdoutFile, err := ioutil.TempFile("", "file-viewer")
	shouldNot(err)

	defer func(fileName string) {
		r := recover()
		if r == nil {
			return
		}
		os.Remove(fileName)
		panic(r)
	}(stdoutFile.Name())
	defer stdoutFile.Close()
	gocleanup.Register(func() {
		os.Remove(stdoutFile.Name())
	})
	stderrFile, err := ioutil.TempFile("", "file-viewer")
	shouldNot(err)
	defer stderrFile.Close()
	gocleanup.Register(func() {
		os.Remove(stderrFile.Name())
	})
	defer os.Remove(stderrFile.Name())

	arguments := OptionsForMultipleInput(request, request.token(), *cm, func(input CommandInput) string {
		return input.Path(request.token(), *cm)
	})
	cmd := exec.Command(request.Name(), arguments...)
	cmd.Stdout = stdoutFile
	cmd.Stderr = stderrFile

	err = cmd.Run()
	if err != nil {
		stderr, err := os.Open(stderrFile.Name())
		shouldNot(err)
		scanner := bufio.NewScanner(stderr)
		e := []string{}
		for scanner.Scan() {
			shouldNot(scanner.Err())
			line := scanner.Text()
			e = append(e, line)
		}
		panic(CommandError{
			request.seq(),
			e,
			command,
			shortCommand,
			request.Name(),
		})
	}

	seq := *request.seq().Seq
	err = cm.AddContext(seq, request.token(), stdoutFile.Name(), command, shortCommand)
	shouldNot(err)

	bytes, chars, words, lines, max_line_length := wc(stdoutFile.Name())

	return CommandResponse{
		request.seq(),
		command,
		shortCommand,
		request.Name(),
		bytes,
		chars,
		words,
		lines,
		max_line_length,
	}
}
