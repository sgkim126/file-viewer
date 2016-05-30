package main

import (
	"fmt"
	"io/ioutil"
	"os/exec"
)

func wc(filename string) (bytes int, chars int, words int, lines int, max_line_length int) {
	options := []string{
		"--bytes",
		"--chars",
		"--words",
		"--lines",
		"--max-line-length",
		filename}
	cmd := exec.Command("wc", options...)
	reader, err := cmd.StdoutPipe()
	if err != nil {
		panic(err)
	}
	defer reader.Close()
	err = cmd.Start()
	if err != nil {
		panic(err)
	}
	result, err := ioutil.ReadAll(reader)
	if err != nil {
		panic(err)
	}
	err = cmd.Wait()
	if err != nil {
		panic(err)
	}
	_, err = fmt.Sscanf(string(result), "%d %d %d %d %d", &lines, &words, &chars, &bytes, &max_line_length)
	if err != nil {
		panic(err)
	}
	return
}
