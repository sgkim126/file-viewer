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
	shouldNot(err)
	defer reader.Close()
	err = cmd.Start()
	shouldNot(err)
	result, err := ioutil.ReadAll(reader)
	shouldNot(err)
	err = cmd.Wait()
	shouldNot(err)
	_, err = fmt.Sscanf(string(result), "%d %d %d %d %d", &lines, &words, &chars, &bytes, &max_line_length)
	shouldNot(err)
	return
}
