package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
)

func handleCat(data *[]byte) (CommandResult, error) {
	var command CatCommand
	err := json.Unmarshal(*data, &command)
	if err != nil {
		return nil, err
	}

	path := command.Path

	stdoutFile, err := ioutil.TempFile("", "filew-viewer")
	defer stdoutFile.Close()
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

	return CatResult{
		ResultWithCommand{
			command.Seq,
			fmt.Sprintf("cat %s", path),
		},
		lines,
	}, nil
}
