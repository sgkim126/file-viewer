package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"

	"github.com/onsi/gocleanup"
)

type CatCommand struct {
	Seq
	Path string `json:"path"`
}

type CatResult struct {
	ResultWithCommand
	Lines []string `json:"lines"`
}

func (result CatResult) ResultMessage() []byte {
	return ResultMessage(result)
}

func handleCat(data *[]byte, cm *ContextManager) (CommandResult, error) {
	var command CatCommand
	err := json.Unmarshal(*data, &command)
	if err != nil {
		return nil, err
	}

	path := command.Path

	stdoutFile, err := ioutil.TempFile("", "filew-viewer")
	defer stdoutFile.Close()
	gocleanup.Register(func() {
		os.Remove(stdoutFile.Name())
	})
	if err != nil {
		return CommandError{
			command.Seq,
			err.Error(),
		}, nil
	}

	cmd := exec.Command("cat", path)
	cmd.Stdout = stdoutFile

	err = cmd.Run()
	if err != nil {
		return CommandError{
			command.Seq,
			err.Error(),
		}, nil
	}

	var lines []string
	file, err := os.Open(stdoutFile.Name())
	defer file.Close()
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		if scanner.Err() != nil {
			return CommandError{
				command.Seq,
				scanner.Err().Error(),
			}, nil
		}
		lines = append(lines, scanner.Text())
	}

	commandString := fmt.Sprintf("cat %s", path)
	id, err := cm.AddContext(*command.Key, stdoutFile.Name(), commandString)
	if err != nil {
		return CommandError{
			command.Seq,
			err.Error(),
		}, nil
	}

	return CatResult{
		ResultWithCommand{
			command.Seq,
			commandString,
			id,
		},
		lines,
	}, nil
}
