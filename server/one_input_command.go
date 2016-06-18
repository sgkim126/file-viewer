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

type OneInputCommandRequest interface {
	Name() string
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

func ShortCommandsForOneInput(request OneInputCommandRequest, token token, cm ContextManager) string {
	options := strings.Join(request.options(), " ")
	if options != "" {
		options = " " + options
	}
	input := request.input()
	if input.File != nil {
		return fmt.Sprintf("%s%s %s", request.Name(), options, path.Base(*input.File))
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
	stderrFile, err := ioutil.TempFile("", "filew-viewer")
	shouldNot(err)
	defer stderrFile.Close()
	gocleanup.Register(func() {
		os.Remove(stderrFile.Name())
	})
	defer os.Remove(stderrFile.Name())

	arguments := append(request.options(), inputPath)
	cmd := exec.Command(request.Name(), arguments...)
	cmd.Stdout = stdoutFile
	cmd.Stderr = stderrFile

	defer func(fileName string) {
		r := recover()
		if r == nil {
			return
		}
		os.Remove(fileName)
		panic(r)
	}(stdoutFile.Name())

	command := CommandsForOneInput(request, request.token(), *cm)
	shortCommand := ShortCommandsForOneInput(request, request.token(), *cm)

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
