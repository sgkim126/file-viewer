package main

import (
	"bufio"
	"fmt"
	"io/ioutil"
	"os"

	"github.com/onsi/gocleanup"
)

type MoreRequest struct {
	Seq
	Id    int   `json:"id"`
	Start int64 `json:"start"`
	Lines int   `json:"lines"`
}

func (request MoreRequest) Handle(kg KeyGenerator, cm *ContextManager) Response {
	c, err := cm.GetContext(*request.Key, request.Id)
	shouldNot(err)
	path := c.path

	file, err := os.Open(path)
	shouldNot(err)
	defer file.Close()

	resultFile, err := ioutil.TempFile("", "filew-viewer")
	shouldNot(err)
	resultFileName := resultFile.Name()
	defer func() {
		resultFile.Close()
		os.Remove(resultFileName)
	}()
	gocleanup.Register(func() {
		os.Remove(resultFileName)
	})

	writer := bufio.NewWriter(resultFile)

	file.Seek(request.Start, 0)
	scanner := bufio.NewScanner(file)
	var contents []string
	for i := 0; i < request.Lines; i += 1 {
		if !scanner.Scan() {
			break
		}
		shouldNot(scanner.Err())
		line := scanner.Text()
		contents = append(contents, line)
		writer.WriteString(fmt.Sprintf("%s\n", line))
	}
	err = writer.Flush()
	shouldNot(err)
	bytes, chars, words, lines, _ := wc(resultFileName)

	return MoreResponse{
		request.Seq,
		contents,
		bytes,
		chars,
		words,
		lines,
	}
}

type MoreResponse struct {
	Seq
	Contents []string `json:"contents"`
	Bytes    int      `json:"bytes"`
	Chars    int      `json:"chars"`
	Words    int      `json:"words"`
	Lines    int      `json:"lines"`
}

func (response MoreResponse) ResponseMessage() []byte {
	return ResponseMessage(response)
}
