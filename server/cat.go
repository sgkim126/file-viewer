package main

import (
	"bufio"
	"encoding/json"
	"io/ioutil"
	"os"
	"os/exec"
)

func handleCat(data *[]byte) (*[]byte, error) {
	var command CatCommand
	err := json.Unmarshal(*data, &command)
	if err != nil {
		return nil, err
	}

	path := command.Path

	stdoutFile, err := ioutil.TempFile("", "filew-viewer")
	defer stdoutFile.Close()
	if err != nil {
		return nil, err
	}

	cmd := exec.Command("cat", path)
	cmd.Stdout = stdoutFile

	err = cmd.Run()
	if err != nil {
		return nil, err
	}

	var lines []string
	file, err := os.Open(stdoutFile.Name())
	defer file.Close()
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		if scanner.Err() != nil {
			return nil, scanner.Err()
		}
		lines = append(lines, scanner.Text())
	}

	result := make(map[string]interface{})
	result["seq"] = command.Seq
	result["lines"] = lines

	encoded, err := json.Marshal(result)
	if err != nil {
		return nil, err
	}
	return &encoded, nil
}
