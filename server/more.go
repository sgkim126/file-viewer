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
	defer func() {
		r := recover()
		if r == nil {
			return
		}
		err, ok := r.(error)
		if !ok {
			fmt.Println("Error in More:", r)
			return
		}
		panic(MessageError{
			request.Seq,
			err.Error(),
		})
	}()

	c, err := cm.GetContext(*request.Key, request.Id)
	if err != nil {
		panic(err)
	}
	path := c.path

	file, err := os.Open(path)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	resultFile, err := ioutil.TempFile("", "filew-viewer")
	if err != nil {
		panic(err)
	}
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
		if scanner.Err() != nil {
			panic(scanner.Err())
		}
		line := scanner.Text()
		contents = append(contents, line)
		writer.WriteString(fmt.Sprintf("%s\n", line))
	}
	err = writer.Flush()
	if err != nil {
		panic(err)
	}
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
